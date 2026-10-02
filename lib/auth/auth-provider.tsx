"use client";

import * as React from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types/user.types";

export const DEFAULT_DEMO_PROFILE: UserProfile = {
  id: "demo-student-id",
  name: "Stephen Ekeson",
  email: "student@fuwukari.edu.ng",
  profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  school: "Federal University Wukari",
  faculty: "Faculty of Science",
  department: "B.Sc Computer Science",
  level: "300 Level",
  age: 21,
  gender: "Male",
  phone_number: "+234 803 123 4567",
  whatsapp_number: "+234 803 123 4567",
  bio: "UI/UX & Web3 builder. Night owl coder, Burna Boy on repeat, looking for a chill roommate for 400L around Greenfield Estate.",
  preferences: ["Night Owl 🌙", "Quiet Studies 📚", "Non-Smoker 🚭", "Gamer 🎮"],
  role: "user",
  is_banned: false,
  is_verified: true,
  is_super_admin: false,
  privacy_show_profile: true,
  privacy_show_marketplace: true,
  privacy_allow_matching: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(DEFAULT_DEMO_PROFILE);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const supabase = createClient();

  const fetchProfile = React.useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (data && !error) {
        let updatedProfile = data as UserProfile;

        // If DB has "New User" or empty name, check session user metadata full_name/name
        if (!updatedProfile.name || updatedProfile.name === "New User" || updatedProfile.name === "new user") {
          const { data: authData } = await supabase.auth.getUser();
          const metaName = authData?.user?.user_metadata?.full_name || 
                           authData?.user?.user_metadata?.name || 
                           authData?.user?.user_metadata?.display_name;
          if (metaName && metaName !== "New User" && metaName.trim() !== "") {
            updatedProfile.name = metaName.trim();
            // Sync back to users table in background
            supabase.from("users").update({ name: metaName.trim() }).eq("id", userId).then();
          } else if (authData?.user?.email) {
            // If email is present (e.g. ejehstephen966@gmail.com -> Ejeh Stephen or prefix)
            const emailPrefix = authData.user.email.split("@")[0].replace(/[0-9]/g, " ").trim();
            if (emailPrefix) {
              const formattedName = emailPrefix
                .split(/\s+|_/)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
              updatedProfile.name = formattedName;
              supabase.from("users").update({ name: formattedName }).eq("id", userId).then();
            }
          }
        }

        setProfile(updatedProfile);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("campsnest_user_profile", JSON.stringify(updatedProfile));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  }, [supabase]);

  React.useEffect(() => {
    const initAuth = async () => {
      // Safely load client cache after mount to prevent SSR hydration mismatch
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("campsnest_user_profile") || sessionStorage.getItem("campsnest_user_profile");
          if (cached) {
            setProfile(JSON.parse(cached));
          }
        } catch (e) {}
      }

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }

      setIsLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else if (event === "SIGNED_OUT") {
          setProfile(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("campsnest_user_profile");
            sessionStorage.removeItem("campsnest_user_profile");
          }
        }

        setIsLoading(false);
      }
    );

    const handleProfileUpdated = (e: any) => {
      if (e.detail) {
        setProfile(e.detail);
        if (typeof window !== "undefined") {
          localStorage.setItem("campsnest_user_profile", JSON.stringify(e.detail));
        }
      }
    };

    window.addEventListener("campsnest:profile_updated", handleProfileUpdated);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("campsnest:profile_updated", handleProfileUpdated);
    };
  }, [supabase, fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("campsnest_user_profile");
      sessionStorage.removeItem("campsnest_user_profile");
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
