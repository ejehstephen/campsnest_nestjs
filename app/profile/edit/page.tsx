"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Save
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/lib/auth/auth-provider";
import { updateAcademicProfileAction } from "@/lib/auth/actions";
import { compressAvatarImage } from "@/lib/utils";

const VIBE_TAG_OPTIONS = [
  "Night Owl 🌙",
  "Early Riser ☀️",
  "Quiet Studies 📚",
  "Non-Smoker 🚭",
  "Gamer 🎮",
  "Music Lover 🎵",
  "Clean & Tidy ✨",
  "Social & Outgoing 👋",
  "Cooking Enthusiast 🍳",
  "Sports & Fitness 🏋️‍♂️"
];

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();

  // Form State
  const [fullName, setFullName] = React.useState(profile?.name || "Stephen Ekeson");
  const [username, setUsername] = React.useState(
    (profile?.name || "stephen_ek").toLowerCase().replace(/\s+/g, "_")
  );
  const [department, setDepartment] = React.useState(profile?.department || "B.Sc Computer Science");
  const [level, setLevel] = React.useState(profile?.level || "300 Level");
  const [phone, setPhone] = React.useState(profile?.phone_number || "+234 803 123 4567");
  const [location, setLocation] = React.useState("Greenfield Estate, Opp Old Library");
  const [bio, setBio] = React.useState(
    profile?.bio || "UI/UX & Web3 builder. Night owl coder, Burna Boy on repeat, looking for a chill roommate for 400L around Greenfield Estate."
  );
  
  const [selectedVibeTags, setSelectedVibeTags] = React.useState<string[]>(
    profile?.preferences && profile.preferences.length > 0
      ? profile.preferences
      : ["Night Owl 🌙", "Quiet Studies 📚", "Non-Smoker 🚭", "Gamer 🎮"]
  );

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState(
    profile?.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  );

  React.useEffect(() => {
    if (profile) {
      if (profile.name && profile.name !== "New User" && profile.name !== "new user") {
        setFullName(profile.name);
        setUsername(profile.name.toLowerCase().replace(/[^a-z0-9_]/g, "").replace(/\s+/g, "_"));
      } else if (profile.email) {
        const emailPrefix = profile.email.split("@")[0].replace(/[0-9]/g, " ").trim();
        if (emailPrefix) {
          const formatted = emailPrefix
            .split(/\s+|_/)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          setFullName(formatted);
          setUsername(emailPrefix.toLowerCase().replace(/\s+/g, "_"));
        }
      }
      if (profile.department) setDepartment(profile.department);
      if (profile.level) setLevel(profile.level);
      if (profile.phone_number) setPhone(profile.phone_number);
      if (profile.bio) setBio(profile.bio);
      if (profile.profile_image && profile.profile_image.trim() !== "") setAvatarUrl(profile.profile_image);
      if (profile.preferences && profile.preferences.length > 0) {
        setSelectedVibeTags(profile.preferences);
      }
    }
  }, [profile]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressAvatarImage(file);
        setAvatarUrl(compressed);
      } catch (err) {
        console.error("Error compressing image:", err);
      }
    }
  };

  const toggleVibeTag = (tag: string) => {
    if (selectedVibeTags.includes(tag)) {
      setSelectedVibeTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedVibeTags((prev) => [...prev, tag]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (profile?.id) {
        await updateAcademicProfileAction(profile.id, {
          name: fullName,
          profile_image: avatarUrl,
          department,
          level,
          phone_number: phone,
          whatsapp_number: phone,
          bio,
          preferences: selectedVibeTags,
        });
      }
      await refreshProfile();
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err) {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-20 max-w-4xl mx-auto">
        
        {/* Top Header & Back Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Edit Profile</span>
                <span className="text-base">✏️</span>
              </h1>
              <p className="text-xs text-text-dim">
                Update your campus identity, contact details, and vibe preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Success Toast Banner */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-fade-in-up">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Profile saved successfully! Redirecting back to profile...</span>
          </div>
        )}

        {/* Edit Form Card */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Circular Avatar Photo Upload Banner */}
          <div className="p-6 rounded-3xl bg-[#141122] border border-white/10 space-y-4 flex flex-col sm:flex-row items-center gap-6">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-dashed border-brand-violet/60 hover:border-brand-magenta transition-all cursor-pointer group bg-[#18142E] shadow-2xl flex items-center justify-center overflow-hidden shrink-0"
            >
              {avatarUrl ? (
                <>
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-full w-full object-cover rounded-full"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                    <Camera className="h-5 w-5 text-brand-magenta-light" />
                    <span className="text-[10px]">Change</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-text-muted group-hover:text-white space-y-1">
                  <Camera className="h-7 w-7 text-brand-violet-light group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">Select Photo</span>
                </div>
              )}

              <div className="absolute bottom-0 inset-x-0 bg-brand-violet/90 py-0.5 text-[9px] font-extrabold text-white text-center tracking-wider">
                SELECT IMAGE
              </div>
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                <span>Student Profile Picture</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED
                </span>
              </h3>
              <p className="text-xs text-text-dim max-w-sm">
                Click the circular avatar space to upload a profile picture directly from your device.
              </p>
            </div>
          </div>

          {/* Personal Information Fields */}
          <div className="p-6 rounded-3xl bg-[#141122] border border-white/10 space-y-4">
            <h2 className="text-sm font-heading font-extrabold text-white uppercase tracking-wider text-brand-violet-light">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-brand-violet-light" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-white/15 bg-white/[0.04] text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-brand-magenta-light" />
                  <span>Username</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-white/15 bg-white/[0.04] text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                  required
                />
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-brand-blue-light" />
                  <span>Department / Major</span>
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-white/15 bg-white/[0.04] text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                  required
                />
              </div>

              {/* Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Academic Level</span>
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-white/15 bg-[#181432] text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                >
                  <option value="100 Level">100 Level</option>
                  <option value="200 Level">200 Level</option>
                  <option value="300 Level">300 Level</option>
                  <option value="400 Level">400 Level</option>
                  <option value="500 Level / PG">500 Level / PG</option>
                </select>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Phone Number (Call/WhatsApp)</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-white/15 bg-white/[0.04] text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                  required
                />
              </div>

              {/* Campus Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-brand-magenta" />
                  <span>Hostel / Campus Area</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-white/15 bg-white/[0.04] text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-text-secondary">
                Student Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all leading-relaxed"
                placeholder="Tell other students about your lifestyle, interests, or housing needs..."
              />
            </div>
          </div>

          {/* Vibe & Lifestyle Preference Tags */}
          <div className="p-6 rounded-3xl bg-[#141122] border border-white/10 space-y-4">
            <div>
              <h2 className="text-sm font-heading font-extrabold text-white uppercase tracking-wider text-brand-magenta-light">
                Vibe & Lifestyle Tags
              </h2>
              <p className="text-xs text-text-dim">
                Select tags that best describe your lifestyle for roommate matching.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {VIBE_TAG_OPTIONS.map((tag) => {
                const isSelected = selectedVibeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleVibeTag(tag)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-gradient-to-r from-brand-violet to-brand-magenta text-white border-transparent shadow-md"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white border-white/10"
                    }`}
                  >
                    <span>{tag}</span>
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/profile">
              <button
                type="button"
                className="px-5 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white transition-all"
              >
                Cancel
              </button>
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#8B5CF6] text-white text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save Profile Changes"}</span>
            </button>
          </div>

        </form>

      </div>
    </AppShell>
  );
}
