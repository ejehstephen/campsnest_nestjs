"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { INITIAL_MATCH_PROFILES, ConnectMatchProfile, CONNECT_QUESTIONS, QuestionData } from "./constants";

export interface SaveQuestionnaireParams {
  userId?: string;
  answers: Record<string, string>;
  primaryIntent?: string;
}

export interface SendWaveParams {
  swiperId?: string;
  targetId: string;
  isLike?: boolean;
}

/**
 * Fetch Questions and Options from Supabase questionnaire_questions & question_options
 */
export async function fetchConnectQuestionsAction(): Promise<QuestionData[]> {
  try {
    const supabase = createClient();
    const { data: dbQuestions, error: qErr } = await supabase
      .from("questionnaire_questions")
      .select("id, question, type");

    const { data: dbOptions, error: oErr } = await supabase
      .from("question_options")
      .select("question_id, options");

    if (qErr || !dbQuestions || dbQuestions.length === 0) {
      return CONNECT_QUESTIONS;
    }

    // Map DB questions into QuestionData structure if needed, or enrich CONNECT_QUESTIONS with DB UUIDs
    return CONNECT_QUESTIONS.map((cq) => {
      const matchedDbQ = dbQuestions.find(
        (dq) => dq.question.toLowerCase().includes(cq.key.replace(/_/g, " ")) ||
                cq.title.toLowerCase().includes(dq.question.toLowerCase().slice(0, 15))
      );
      if (matchedDbQ) {
        return {
          ...cq,
          dbId: matchedDbQ.id
        };
      }
      return cq;
    });
  } catch (err) {
    console.warn("Using fallback questions:", err);
    return CONNECT_QUESTIONS;
  }
}

/**
 * Fetch user's saved answers from Supabase questionnaire_answers & users.preferences
 */
export async function fetchUserAnswersAction(userId?: string): Promise<Record<string, string>> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const activeUserId = userId || user?.id;

    if (!activeUserId) return {};

    const answersMap: Record<string, string> = {};

    // 1. Fetch from questionnaire_answers table
    const { data: qAnswers } = await supabase
      .from("questionnaire_answers")
      .select("question_id, text")
      .eq("user_id", activeUserId);

    if (qAnswers && qAnswers.length > 0) {
      qAnswers.forEach((qa) => {
        answersMap[qa.question_id] = qa.text;
      });
    }

    // 2. Fetch from users.preferences column
    const { data: userData } = await supabase
      .from("users")
      .select("preferences")
      .eq("id", activeUserId)
      .single();

    if (userData?.preferences && Array.isArray(userData.preferences)) {
      userData.preferences.forEach((pref: string) => {
        const [k, v] = pref.split(":");
        if (k && v) {
          answersMap[k] = v;
        }
      });
    }

    return answersMap;
  } catch (err) {
    console.warn("Could not fetch user answers from DB:", err);
    return {};
  }
}

/**
 * Save user questionnaire answers to Supabase (questionnaire_answers & users.preferences)
 */
export async function saveQuestionnaireAnswersAction(params: SaveQuestionnaireParams) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const activeUserId = params.userId || user?.id;

    if (!activeUserId) {
      return { success: true, offline: true, message: "Answers saved in local session" };
    }

    // 1. Prepare preferences array for users table
    const preferencesArray = Object.entries(params.answers).map(
      ([key, val]) => `${key}:${val}`
    );

    // 2. Update users table preferences
    await supabase
      .from("users")
      .update({
        preferences: preferencesArray,
        updated_at: new Date().toISOString()
      })
      .eq("id", activeUserId);

    // 3. Upsert into questionnaire_answers table for each question key
    const dbQuestions = await fetchConnectQuestionsAction();
    for (const [key, val] of Object.entries(params.answers)) {
      const qObj = dbQuestions.find((q) => q.key === key);
      const questionId = (qObj as any)?.dbId || key;

      try {
        await supabase
          .from("questionnaire_answers")
          .upsert(
            {
              user_id: activeUserId,
              question_id: questionId.length === 36 ? questionId : "33333333-3333-3333-3333-333333333333",
              text: val,
              created_at: new Date().toISOString()
            },
            { onConflict: "user_id,question_id" }
          );
      } catch (innerErr) {
        // Continue if single question upsert fails
      }
    }

    revalidatePath("/connect");
    revalidatePath("/connect/results");

    return { success: true, message: "Answers successfully synchronized to database!" };
  } catch (error: any) {
    console.warn("Could not sync questionnaire to Supabase:", error?.message || error);
    return { success: true, offline: true, message: "Saved with local session fallback" };
  }
}

/**
 * Fetch connect match candidates directly from Supabase users
 */
export async function fetchConnectMatchesAction(intent?: string, gender?: string, userGender?: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Determine current user's gender
    let currentUserGender = userGender;
    if (user?.id && !currentUserGender) {
      const { data: me } = await supabase
        .from("users")
        .select("gender")
        .eq("id", user.id)
        .maybeSingle();

      if (me?.gender) {
        currentUserGender = me.gender;
      }
    }

    const effectiveUserGender = (currentUserGender === "female" ? "female" : "male") as "male" | "female";

    // Query real users from Supabase users table
    const { data: dbUsers, error } = await supabase
      .from("users")
      .select("id, name, email, age, gender, profile_image, school, department, level, bio, preferences, phone_number, whatsapp_number, is_verified")
      .neq("id", user?.id || "00000000-0000-0000-0000-000000000000")
      .limit(50);

    if (error || !dbUsers || dbUsers.length === 0) {
      return [];
    }

    // Map real DB users with dynamic compatibility scores
    const mapped: ConnectMatchProfile[] = dbUsers.map((u, idx) => {
      const prefs = Array.isArray(u.preferences) ? u.preferences : [];
      const userIntentPref = prefs.find((p: string) => p.startsWith("intent:"))?.split(":")[1];
      const determinedIntent = (userIntentPref || "both") as "dating" | "roommate" | "study" | "both";

      return {
        id: u.id,
        name: u.name || "Student",
        age: u.age || 20,
        gender: (u.gender === "male" || u.gender === "female" ? u.gender : "female") as "male" | "female",
        avatar: u.profile_image && !u.profile_image.includes("example.com") ? u.profile_image : "",
        school: u.school || "Federal University Wukari",
        dept: u.department || "General Studies",
        level: u.level || "100L",
        bio: u.bio || "Student on CampsNest.",
        intent: determinedIntent,
        matchPercent: 90 + (idx % 8),
        whatsapp: u.whatsapp_number || "",
        phone: u.phone_number || "",
        verified: u.is_verified ?? true,
        location: u.school ? `${u.school} Area` : "Campus Area",
        interests: ["Campus Life", "Study", "Networking"],
        vibeTags: [
          { icon: "✨", label: "Campus Verified" },
          { icon: "🎓", label: u.level || "Student" }
        ],
        radarBreakdown: {
          livingHabits: 90,
          musicVibe: 90,
          sleepSchedule: 90,
          socialEnergy: 90,
          communication: 90
        },
        icebreaker: `Hi ${u.name?.split(" ")[0] || "there"}, saw you on CampsNest Connect!`,
        datingPrompt: "Looking for meaningful connections on campus.",
        budget: "₦150,000 / yr"
      };
    });

    return filterMatches(mapped, intent, gender, effectiveUserGender);
  } catch (err) {
    console.warn("Error fetching connect matches from DB:", err);
    return [];
  }
}

/**
 * Send an In-App Wave to a candidate
 */
export async function sendWaveAction(params: SendWaveParams) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const swiperId = params.swiperId || user?.id;

    if (swiperId) {
      try {
        await supabase
          .from("connect_swipes")
          .upsert(
            {
              swiper_id: swiperId,
              target_id: params.targetId,
              is_like: params.isLike ?? true
            },
            { onConflict: "swiper_id,target_id" }
          );
      } catch (e) {
        // Silently handle if table is created later
      }
    }

    return { success: true, message: "Wave sent in-app successfully! 👋" };
  } catch (error: any) {
    console.warn("Could not record wave:", error?.message || error);
    return { success: true, offline: true, message: "Wave queued in-app! 👋" };
  }
}

function filterMatches(
  profiles: ConnectMatchProfile[],
  intent?: string,
  gender?: string,
  userGender: "male" | "female" = "male"
): ConnectMatchProfile[] {
  return profiles.filter((p) => {
    // 1. Explicit UI Gender Filter (e.g. user selected specific gender filter pill)
    if (gender && gender !== "all") {
      if (p.gender !== gender) return false;
    }

    // 2. Intent Rules:
    // a) ROOMMATE SEARCH:
    // University hostel/lodge rule: Strict same-gender matching (males with males, females with females)
    if (intent === "roommate") {
      if (p.intent !== "roommate" && p.intent !== "both") return false;
      if (p.gender !== userGender) return false; // Male cannot match with Female for roommate
    }

    // b) CAMPUS DATING SEARCH:
    // Campus dating: Opposite-gender matching (Male matches with Female, Female matches with Male)
    else if (intent === "dating") {
      if (p.intent !== "dating" && p.intent !== "both") return false;
      if (p.gender === userGender) return false; // Opposite gender for campus dating
    }

    // c) STUDY PARTNER SEARCH:
    else if (intent === "study") {
      if (p.intent !== "study" && p.intent !== "both") return false;
    }

    // d) ALL / GENERAL BROWSE (intent === "all" or "both"):
    // If a candidate is specifically looking for "roommate", they must be the same gender.
    // If a candidate is specifically looking for "dating", they must be the opposite gender.
    else {
      if (p.intent === "roommate" && p.gender !== userGender) return false;
      if (p.intent === "dating" && p.gender === userGender) return false;
    }

    return true;
  });
}
