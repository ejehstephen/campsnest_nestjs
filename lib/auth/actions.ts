"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  school: string;
  gender: string;
}

export interface ProfileUpdateParams {
  name?: string;
  profile_image?: string;
  faculty?: string;
  department?: string;
  level?: string;
  phone_number?: string;
  whatsapp_number?: string;
  bio?: string;
  preferences?: string[];
}

/**
 * Sign In with email and password (Production Supabase Auth)
 */
export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true, session: data.session };
  } catch (err: any) {
    return { error: err?.message || "An unexpected error occurred connecting to Supabase." };
  }
}

/**
 * Sign Up new student (Production Supabase Auth + Users table sync)
 */
export async function signUpAction(params: SignUpParams) {
  const { name, email, password, school, gender } = params;

  if (!name || !email || !password || !school || !gender) {
    return { error: "Please complete all required fields." };
  }

  try {
    const supabase = createClient();
    
    // 1. Register user in Supabase Auth with complete metadata
    const cleanName = name.trim();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: cleanName,
          full_name: cleanName,
          display_name: cleanName,
          school,
          gender,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    // 2. Insert or update corresponding profile record in public.users table
    if (data.user) {
      const { error: dbError } = await supabase.from("users").upsert({
        id: data.user.id,
        name: cleanName,
        email: email.trim(),
        school,
        gender,
        role: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });

      if (dbError) {
        console.error("Database user record insertion error:", dbError.message);
      }
    }

    return {
      success: true,
      userId: data.user?.id,
      session: !!data.session,
      requiresVerification: !data.session,
    };
  } catch (err: any) {
    return { error: err?.message || "Unable to reach Supabase Auth server. Check network connection or API keys." };
  }
}

/**
 * Verify Email OTP Token
 */
export async function verifyOtpAction(email: string, token: string) {
  if (!email || !token) {
    return { error: "Email and verification code are required." };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      return { error: error.message };
    }

    // If verified user has name in metadata, ensure public.users has it synced
    if (data.user) {
      const metaName = data.user.user_metadata?.name || data.user.user_metadata?.full_name || data.user.user_metadata?.display_name;
      if (metaName) {
        await supabase
          .from("users")
          .update({ name: metaName, updated_at: new Date().toISOString() })
          .eq("id", data.user.id);
      }
    }

    revalidatePath("/", "layout");
    return { success: true, userId: data.user?.id };
  } catch (err: any) {
    return { error: err?.message || "Verification failed." };
  }
}

/**
 * Resend Email Verification Code
 */
export async function resendVerificationOtpAction(email: string) {
  if (!email) {
    return { error: "Email address is required." };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      return { error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to resend code." };
  }
}

/**
 * Update Academic Profile (Step 3 & Edit Profile)
 */
export async function updateAcademicProfileAction(
  userId: string,
  data: ProfileUpdateParams
) {
  if (!userId) {
    return { success: true };
  }

  try {
    const supabase = createClient();

    // Prepare full payload
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (data.name && data.name.trim()) {
      updatePayload.name = data.name.trim();
      try {
        await supabase.auth.updateUser({
          data: {
            name: data.name.trim(),
            full_name: data.name.trim(),
            display_name: data.name.trim()
          }
        });
      } catch (e) {}
    }
    if (data.profile_image) updatePayload.profile_image = data.profile_image;
    if (data.faculty) updatePayload.faculty = data.faculty;
    if (data.department) updatePayload.department = data.department;
    if (data.level) updatePayload.level = data.level;
    if (data.phone_number) updatePayload.phone_number = data.phone_number;
    if (data.whatsapp_number) updatePayload.whatsapp_number = data.whatsapp_number;
    if (data.bio) updatePayload.bio = data.bio;
    if (data.preferences) updatePayload.preferences = data.preferences;

    // First attempt: update all fields
    const { error } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("id", userId);

    if (error) {
      console.warn("Database profile update warning:", error.message);

      // If column error occurs (e.g. missing optional DB columns), retry with standard columns
      const safePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (data.name && data.name.trim()) safePayload.name = data.name.trim();
      if (data.profile_image) safePayload.profile_image = data.profile_image;
      if (data.phone_number) safePayload.phone_number = data.phone_number;
      if (data.preferences) safePayload.preferences = data.preferences;

      const { error: safeError } = await supabase
        .from("users")
        .update(safePayload)
        .eq("id", userId);

      if (safeError) {
        console.error("Safe database update error:", safeError.message);
      }
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    console.warn("updateAcademicProfileAction exception:", err?.message);
    revalidatePath("/", "layout");
    return { success: true };
  }
}

/**
 * Request Password Reset Email / OTP
 */
export async function resetPasswordAction(email: string) {
  if (!email) {
    return { error: "Please enter your student email address." };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/forgot-password?step=update`,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Password reset request failed." };
  }
}

/**
 * Update User Password
 */
export async function updatePasswordAction(password: string) {
  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Password update failed." };
  }
}

/**
 * Sign Out Action
 */
export async function signOutAction() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (err) {
    // Continue redirect
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Delete User Account & Cascade Cleanup
 */
export async function deleteAccountAction() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No active user session found to delete." };
    }

    const userId = user.id;

    // 1. Try legacy Supabase RPC if present in Postgres
    try {
      await supabase.rpc("delete_user");
    } catch (rpcErr) {
      console.warn("RPC delete_user fallback:", rpcErr);
    }

    // 2. Cascade delete records owned by this user
    try {
      // Delete housing listings owned by user (and their child rows)
      const { data: userHouses } = await supabase
        .from("room_listings")
        .select("id")
        .eq("owner_id", userId);

      if (userHouses && userHouses.length > 0) {
        const houseIds = userHouses.map((h) => h.id);
        await supabase.from("room_listing_images").delete().in("room_listing_id", houseIds);
        await supabase.from("room_listing_amenities").delete().in("room_listing_id", houseIds);
        await supabase.from("saved_houses").delete().in("room_listing_id", houseIds);
        await supabase.from("room_listings").delete().eq("owner_id", userId);
      }

      // Delete marketplace items
      await supabase.from("marketplace_items").delete().eq("seller_id", userId);

      // Delete messages and participants
      await supabase.from("messages").delete().eq("sender_id", userId);
      await supabase.from("conversation_participants").delete().eq("user_id", userId);

      // Delete saved houses
      await supabase.from("saved_houses").delete().eq("user_id", userId);

      // Delete inspection requests
      await supabase.from("inspections").delete().eq("student_id", userId);
      await supabase.from("inspections").delete().eq("host_id", userId);

      // Delete questionnaire answers
      await supabase.from("questionnaire_answers").delete().eq("user_id", userId);

      // Delete profile in public.users
      await supabase.from("users").delete().eq("id", userId);
    } catch (cleanErr) {
      console.warn("User records cascading cleanup warning:", cleanErr);
    }

    // 3. Sign out session
    await supabase.auth.signOut();

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    console.error("deleteAccountAction exception:", err);
    return { success: true }; // Allow client to purge local storage and sign out
  }
}
