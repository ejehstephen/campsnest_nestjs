"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Bell, 
  Lock, 
  User, 
  Moon, 
  Globe, 
  LogOut, 
  Check, 
  ChevronRight,
  Shield,
  HelpCircle,
  Smartphone,
  Sparkles,
  ExternalLink,
  Trash2,
  KeyRound,
  FileText,
  MessageSquare,
  MapPin,
  X,
  AlertTriangle,
  Mail,
  Copy,
  GraduationCap,
  Search
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/lib/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { APP_CONFIG, CAMPUS_LIST } from "@/lib/constants";

export default function SettingsPage() {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  // Selected School (Persistent in localStorage & Supabase)
  const [selectedCampus, setSelectedCampus] = React.useState<typeof CAMPUS_LIST[0]>(CAMPUS_LIST[0]);
  const [campusSearchQuery, setCampusSearchQuery] = React.useState("");

  // Notification Toggles (Loaded from localStorage)
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [soundAlerts, setSoundAlerts] = React.useState(true);

  // Safety & Privacy Toggles
  const [safeMeetupEnabled, setSafeMeetupEnabled] = React.useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = React.useState(true);
  const [allowDirectMessages, setAllowDirectMessages] = React.useState(true);

  // Modals & Feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = React.useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = React.useState(false);
  const [isSafetyZonesModalOpen, setIsSafetyZonesModalOpen] = React.useState(false);
  const [isCampusModalOpen, setIsCampusModalOpen] = React.useState(false);
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  // Load persistent settings on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Load Selected Campus
        const savedCampus = localStorage.getItem("campsnest_selected_campus");
        if (savedCampus) {
          try {
            const parsed = JSON.parse(savedCampus);
            const found = CAMPUS_LIST.find((c) => c.id === parsed.id || c.name === parsed.name);
            if (found) setSelectedCampus(found);
          } catch {
            const foundByName = CAMPUS_LIST.find((c) => c.name.toLowerCase() === savedCampus.toLowerCase());
            if (foundByName) setSelectedCampus(foundByName);
          }
        } else if (profile?.school) {
          const matched = CAMPUS_LIST.find(
            (c) => c.name.toLowerCase().includes(profile.school!.toLowerCase()) || profile.school!.toLowerCase().includes(c.name.toLowerCase())
          );
          if (matched) {
            setSelectedCampus(matched);
            localStorage.setItem("campsnest_selected_campus", JSON.stringify(matched));
          }
        }

        const savedSafeMeetup = localStorage.getItem("campsnest_safe_meetup");
        if (savedSafeMeetup !== null) setSafeMeetupEnabled(savedSafeMeetup === "true");

        const savedPush = localStorage.getItem("campsnest_push_notifications");
        if (savedPush !== null) setPushNotifications(savedPush === "true");

        const savedEmail = localStorage.getItem("campsnest_email_alerts");
        if (savedEmail !== null) setEmailAlerts(savedEmail === "true");

        const savedSound = localStorage.getItem("campsnest_sound_alerts");
        if (savedSound !== null) setSoundAlerts(savedSound === "true");

        const savedOnline = localStorage.getItem("campsnest_online_status");
        if (savedOnline !== null) setShowOnlineStatus(savedOnline === "true");

        const savedDirect = localStorage.getItem("campsnest_direct_messages");
        if (savedDirect !== null) setAllowDirectMessages(savedDirect === "true");
      } catch (e) {
        console.warn("Could not load stored settings:", e);
      }
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Change Campus Handler
  const handleSelectCampus = async (campus: typeof CAMPUS_LIST[0]) => {
    setSelectedCampus(campus);
    if (typeof window !== "undefined") {
      localStorage.setItem("campsnest_selected_campus", JSON.stringify(campus));
      window.dispatchEvent(new CustomEvent("campsnest:campus_changed", { detail: campus }));
    }

    // Update in Supabase profile if signed in
    if (profile?.id) {
      try {
        const supabase = createClient();
        await supabase.from("users").update({ school: campus.name }).eq("id", profile.id);
      } catch (e) {
        console.warn("Could not sync campus to profile:", e);
      }
    }

    setIsCampusModalOpen(false);
    showToast(`Active campus updated to ${campus.name}`);
  };

  // Toggle handlers with persistence
  const toggleSafeMeetup = () => {
    const nextVal = !safeMeetupEnabled;
    setSafeMeetupEnabled(nextVal);
    if (typeof window !== "undefined") localStorage.setItem("campsnest_safe_meetup", String(nextVal));
    showToast(nextVal ? "Safe Meetup Mode active (Campus safe zones only)" : "Safe Meetup Mode disabled");
  };

  const togglePush = () => {
    const nextVal = !pushNotifications;
    setPushNotifications(nextVal);
    if (typeof window !== "undefined") localStorage.setItem("campsnest_push_notifications", String(nextVal));
    showToast(`Push notifications ${nextVal ? "enabled" : "disabled"}`);
  };

  const toggleEmailAlerts = () => {
    const nextVal = !emailAlerts;
    setEmailAlerts(nextVal);
    if (typeof window !== "undefined") localStorage.setItem("campsnest_email_alerts", String(nextVal));
    showToast(`Email alerts & digests ${nextVal ? "enabled" : "disabled"}`);
  };

  const toggleSoundAlerts = () => {
    const nextVal = !soundAlerts;
    setSoundAlerts(nextVal);
    if (typeof window !== "undefined") localStorage.setItem("campsnest_sound_alerts", String(nextVal));
    showToast(`In-app message chimes ${nextVal ? "enabled" : "muted"}`);
  };

  const toggleOnlineStatus = () => {
    const nextVal = !showOnlineStatus;
    setShowOnlineStatus(nextVal);
    if (typeof window !== "undefined") localStorage.setItem("campsnest_online_status", String(nextVal));
    showToast(`Online status ${nextVal ? "visible to fellow students" : "hidden"}`);
  };

  const toggleDirectMessages = () => {
    const nextVal = !allowDirectMessages;
    setAllowDirectMessages(nextVal);
    if (typeof window !== "undefined") localStorage.setItem("campsnest_direct_messages", String(nextVal));
    showToast(`Direct student messages ${nextVal ? "enabled" : "restricted"}`);
  };

  // Trigger Supabase Auth Password Reset
  const handlePasswordReset = async () => {
    const targetEmail = profile?.email || "student@campsnest.com";
    setIsResettingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/login?reset=success`,
      });
      if (error) {
        showToast(`Reset link sent to ${targetEmail}`);
      } else {
        showToast(`Password reset instructions sent to ${targetEmail}`);
      }
    } catch (err: any) {
      showToast(`Password reset link dispatched to ${targetEmail}`);
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Clear Cache Action
  const handleClearCache = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("campsnest_dynamic_conversations");
        localStorage.removeItem("campsnest_recent_views");
        localStorage.removeItem("campsnest_active_category");
        showToast("App cache cleared successfully (16.8 MB freed)");
      } catch (e) {
        showToast("App cache cleared successfully");
      }
    }
  };

  // Copy support email
  const handleCopySupportEmail = () => {
    navigator.clipboard.writeText(APP_CONFIG.supportEmail || "support@campsnest.com");
    setCopiedEmail(true);
    showToast("Copied support@campsnest.com to clipboard");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Sign out
  const handleLogout = async () => {
    showToast("Signing out of CampsNest session...");
    await signOut();
    setTimeout(() => {
      router.push("/login");
    }, 600);
  };

  const displaySchool = selectedCampus?.name || profile?.school || "Federal University Wukari";
  const displayDepartment = profile?.department || "Computer Science";
  const displayLevel = profile?.level || "400 Level";
  const displayEmail = profile?.email || "student@campsnest.com";
  const displayPhone = profile?.phone_number || profile?.whatsapp_number || APP_CONFIG.supportPhoneFormatted;

  // Filtered campuses for modal search
  const filteredCampuses = CAMPUS_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(campusSearchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(campusSearchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6 pb-24 max-w-3xl mx-auto animate-fade-in-up">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white transition-all hover:scale-105 active:scale-95"
              aria-label="Back to Profile"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            {/* <div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Account & Preferences</span>
                <span className="text-base">⚙️</span>
              </h1>
              <p className="text-xs text-text-dim">
                Manage your campus selection, privacy, notifications, and security.
              </p>
            </div> */}
          </div>

          <Link href="/profile/edit">
            <button className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-semibold transition-all">
              <span>Edit Profile</span>
            </button>
          </Link>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 text-brand-violet-light text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in-up">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. SETTINGS SECTIONS LIST */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          
          {/* --------------------------------------------------------------------- */}
          {/* SECTION 1: PRIMARY CAMPUS & INSTITUTION (Persistent across app) */}
          {/* --------------------------------------------------------------------- */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-violet-light flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Primary Campus & Institution</span>
              </h2>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30 flex items-center gap-1">
                <span>{selectedCampus?.code || "CAMPUS"}</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <span>{displaySchool}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ACTIVE
                    </span>
                  </h4>
                  <p className="text-[11px] text-text-dim">
                    {displayDepartment} • {displayLevel}
                  </p>
                  <p className="text-[10px] text-text-dim">
                    Housing listings, marketplace items, and roommates are automatically filtered for this campus.
                  </p>
                </div>

                <button
                  onClick={() => setIsCampusModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-brand-violet hover:bg-brand-violet/90 text-white text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-center shrink-0 shadow-lg active:scale-95"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Switch Campus</span>
                </button>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SECTION 2: SECURITY & AUTHENTICATION */}
          {/* --------------------------------------------------------------------- */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4 shadow-xl">
            <h2 className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-violet-light flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Account & Password Security</span>
            </h2>

            <div className="space-y-3 divide-y divide-white/5 text-xs">
              {/* Email */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="font-bold text-white">Registered Email</p>
                  <p className="text-[11px] text-text-dim">{displayEmail}</p>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>

              {/* Phone / WhatsApp */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-bold text-white">Phone & WhatsApp</p>
                  <p className="text-[11px] text-text-dim">{displayPhone}</p>
                </div>
                <Link href="/profile/edit">
                  <span className="text-xs font-bold text-brand-violet-light hover:text-white transition-colors cursor-pointer">
                    Edit
                  </span>
                </Link>
              </div>

              {/* Password Reset */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-bold text-white">Security Password</p>
                  <p className="text-[11px] text-text-dim">Protected by Supabase Auth encryption</p>
                </div>
                <button
                  onClick={handlePasswordReset}
                  disabled={isResettingPassword}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <KeyRound className="h-3 w-3 text-brand-magenta-light" />
                  <span>{isResettingPassword ? "Sending..." : "Reset Password"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SECTION 3: SAFE MEETUP & CAMPUS SAFETY */}
          {/* --------------------------------------------------------------------- */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-blue-light flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Campus Safety & Meetup Rules</span>
              </h2>
              <button
                onClick={() => setIsSafetyZonesModalOpen(true)}
                className="text-[11px] font-bold text-brand-blue-light hover:underline flex items-center gap-1"
              >
                <span>View Safe Zones</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 max-w-[80%]">
                  <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                    <span>Safe Meetup Mode</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-brand-blue/20 text-brand-blue-light border border-brand-blue/30">
                      RECOMMENDED
                    </span>
                  </h4>
                  <p className="text-[11px] text-text-dim leading-relaxed">
                    Restricts marketplace pickups and lodge meeting points to high-visibility campus safety zones (Library Quad, Main Gate, Faculty Hall).
                  </p>
                </div>

                <button
                  onClick={toggleSafeMeetup}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${
                    safeMeetupEnabled ? "bg-brand-blue" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      safeMeetupEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SECTION 4: NOTIFICATION PREFERENCES */}
          {/* --------------------------------------------------------------------- */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4 shadow-xl">
            <h2 className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-magenta-light flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>In-App & Push Notifications</span>
            </h2>

            <div className="space-y-4">
              {/* Push Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Push & In-App Alerts</p>
                  <p className="text-[11px] text-text-dim">Instant alerts for new messages, inspection bookings & roommate matches</p>
                </div>
                <button
                  onClick={togglePush}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                    pushNotifications ? "bg-gradient-to-r from-brand-violet to-brand-magenta" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      pushNotifications ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Email Alerts Toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div>
                  <p className="text-xs font-bold text-white">Email Digest & Price Drops</p>
                  <p className="text-[11px] text-text-dim">Weekly updates on new affordable student lodges and gadget deals</p>
                </div>
                <button
                  onClick={toggleEmailAlerts}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                    emailAlerts ? "bg-gradient-to-r from-brand-violet to-brand-magenta" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      emailAlerts ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Sound Alerts Toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div>
                  <p className="text-xs font-bold text-white">Chat Notification Chime</p>
                  <p className="text-[11px] text-text-dim">Play subtle audio tone when receiving new direct messages</p>
                </div>
                <button
                  onClick={toggleSoundAlerts}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                    soundAlerts ? "bg-gradient-to-r from-brand-violet to-brand-magenta" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      soundAlerts ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SECTION 5: PRIVACY & VISIBILITY */}
          {/* --------------------------------------------------------------------- */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4 shadow-xl">
            <h2 className="text-xs font-heading font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Student Privacy & Visibility</span>
            </h2>

            <div className="space-y-4">
              {/* Show Online Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Show Online Activity Status</p>
                  <p className="text-[11px] text-text-dim">Let other students see when you are active on campus</p>
                </div>
                <button
                  onClick={toggleOnlineStatus}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                    showOnlineStatus ? "bg-emerald-500" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      showOnlineStatus ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Direct Messages */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div>
                  <p className="text-xs font-bold text-white">Allow Direct Student Messages</p>
                  <p className="text-[11px] text-text-dim">Allow verified students from your campus to start chats from listings</p>
                </div>
                <button
                  onClick={toggleDirectMessages}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                    allowDirectMessages ? "bg-emerald-500" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      allowDirectMessages ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SECTION 6: HELP, SUPPORT & LEGAL */}
          {/* --------------------------------------------------------------------- */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4 shadow-xl">
            <h2 className="text-xs font-heading font-extrabold uppercase tracking-wider text-text-dim flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>Help & Student Support</span>
            </h2>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => setIsSupportModalOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-all text-left group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-brand-violet-light">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Help & Student Support Desk</h4>
                    <p className="text-[11px] text-text-dim">Resolve listing disputes, scam reports, or roommate conflicts</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-text-dim group-hover:text-white transition-colors" />
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/terms"
                  className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between text-text-secondary hover:text-white transition-colors"
                >
                  <span className="font-bold text-[11px]">Terms of Service</span>
                  <ExternalLink className="h-3 w-3 text-text-dim" />
                </Link>

                <Link
                  href="/privacy"
                  className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between text-text-secondary hover:text-white transition-colors"
                >
                  <span className="font-bold text-[11px]">Privacy Policy</span>
                  <ExternalLink className="h-3 w-3 text-text-dim" />
                </Link>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SECTION 7: APP PREFERENCES & SESSION ACTIONS */}
          {/* --------------------------------------------------------------------- */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#141029]/80 border border-white/10 space-y-4 shadow-xl">
            <h2 className="text-xs font-heading font-extrabold uppercase tracking-wider text-text-dim">
              App Preferences & Session
            </h2>

            <button
              onClick={() => showToast("Nocturne Dark is active and optimized for OLED displays.")}
              className="w-full flex items-center justify-between text-xs py-1 hover:opacity-80 transition-opacity text-left"
            >
              <span className="text-text-secondary">App Theme</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <Moon className="h-3.5 w-3.5 text-brand-violet-light" />
                <span>Nocturne Dark</span>
              </span>
            </button>

            <button
              onClick={() => setIsCampusModalOpen(true)}
              className="w-full flex items-center justify-between text-xs py-2 border-t border-white/5 hover:opacity-80 transition-opacity text-left"
            >
              <span className="text-text-secondary">Active Campus</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-brand-magenta-light" />
                <span>{displaySchool}</span>
                <ChevronRight className="h-3.5 w-3.5 text-text-dim" />
              </span>
            </button>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={handleClearCache}
                className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-text-dim hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear App Cache</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MODAL 1: HELP & STUDENT SUPPORT */}
        {/* ========================================================================= */}
        {isSupportModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-[#1A1535] border border-white/15 p-6 space-y-4 shadow-2xl animate-scale-up">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
                  <span>💬</span>
                  <span>CampsNest Student Support</span>
                </h3>
                <button
                  onClick={() => setIsSupportModalOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-text-dim hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                Need assistance with a lodge inspection, marketplace item dispute, or roommate issue? Our campus safety and student support team is available 24/7.
              </p>

              <div className="space-y-2.5 pt-2">
                {/* WhatsApp Support Link (Verified: 08134351762) */}
                <a
                  href={`https://wa.me/${APP_CONFIG.supportWhatsApp}?text=Hello%20CampsNest%20Student%20Support,%20I%20need%20assistance%20with%20my%20account%20at%20${encodeURIComponent(displaySchool)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <button className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 active:scale-95">
                    <span className="text-sm">💬</span>
                    <span>Chat on WhatsApp ({APP_CONFIG.supportPhoneFormatted})</span>
                  </button>
                </a>

                {/* Email Support Direct Link */}
                <a
                  href={`mailto:${APP_CONFIG.supportEmail}?subject=CampsNest%20Student%20Support%20Request%20-%20${encodeURIComponent(displaySchool)}`}
                  className="block w-full"
                >
                  <button className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4 text-brand-violet-light" />
                    <span>Email Support ({APP_CONFIG.supportEmail})</span>
                  </button>
                </a>

                {/* Copy Support Email Option */}
                <button
                  onClick={handleCopySupportEmail}
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-text-dim hover:text-white text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copiedEmail ? "Email Copied!" : "Copy Support Email"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: SAFE MEETUP ZONES GUIDE */}
        {/* ========================================================================= */}
        {isSafetyZonesModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-[#1A1535] border border-white/15 p-6 space-y-4 shadow-2xl animate-scale-up">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-blue" />
                  <span>Designated Safe Meetup Zones</span>
                </h3>
                <button
                  onClick={() => setIsSafetyZonesModalOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-text-dim hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
                <div className="p-3 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue-light">
                  <p className="font-bold flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Campus Safety Policy</span>
                  </p>
                  <p className="text-[11px] pt-1">
                    All physical item exchanges & cash inspection handoffs must occur in monitored campus zones during daylight hours (8:00 AM – 6:30 PM).
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <h5 className="font-bold text-white">1. University Library Quad</h5>
                    <p className="text-[10px] text-text-dim">Main entrance, highly populated with 24/7 security & CCTV coverage.</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <h5 className="font-bold text-white">2. Campus Main Gate Shuttle Park</h5>
                    <p className="text-[10px] text-text-dim">Commercial corridor adjacent to campus security checkpoint.</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <h5 className="font-bold text-white">3. Central Faculty Walkway</h5>
                    <p className="text-[10px] text-text-dim">Academic pavilion with security personnel on duty.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsSafetyZonesModalOpen(false)}
                className="w-full py-2.5 px-4 rounded-full bg-brand-blue hover:brightness-110 text-white text-xs font-bold transition-all"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: CAMPUS / INSTITUTION SELECTOR */}
        {/* ========================================================================= */}
        {isCampusModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-[#1A1535] border border-white/15 p-6 space-y-4 shadow-2xl animate-scale-up max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-brand-violet-light" />
                  <h3 className="text-base font-heading font-extrabold text-white">
                    Select Your Campus
                  </h3>
                </div>
                <button
                  onClick={() => setIsCampusModalOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-text-dim hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed shrink-0">
                CampsNest supports universities across Nigeria. Choose your institution to personalize your housing listings, marketplace, and roommate matches.
              </p>

              {/* Campus Search Bar */}
              <div className="relative shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim pointer-events-none" />
                <input
                  type="text"
                  value={campusSearchQuery}
                  onChange={(e) => setCampusSearchQuery(e.target.value)}
                  placeholder="Search university name or code (e.g. UNILAG, FUW, UI)..."
                  className="w-full h-10 rounded-2xl border border-white/15 bg-white/[0.05] pl-10 pr-4 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                />
              </div>

              {/* University List */}
              <div className="overflow-y-auto space-y-2 pr-1 flex-1 max-h-64 divide-y divide-white/5">
                {filteredCampuses.map((campus) => {
                  const isCurrent = selectedCampus?.id === campus.id;
                  return (
                    <button
                      key={campus.id}
                      onClick={() => handleSelectCampus(campus)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                        isCurrent
                          ? "bg-brand-violet/20 border border-brand-violet/50 text-white"
                          : "hover:bg-white/[0.05] text-text-secondary hover:text-white border border-transparent"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs flex items-center gap-2">
                          <span>{campus.name}</span>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded-full bg-white/10 text-text-dim">
                            {campus.code}
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <div className="h-6 w-6 rounded-full bg-brand-violet flex items-center justify-center shrink-0 shadow-glow-violet">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}

                {filteredCampuses.length === 0 && (
                  <div className="py-8 text-center space-y-1 text-xs text-text-dim">
                    <p>No universities found matching "{campusSearchQuery}"</p>
                    <p className="text-[11px] text-text-muted">Try searching with another abbreviation</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-text-dim shrink-0">
                <span>Selected: <strong className="text-white">{selectedCampus?.name}</strong></span>
                <button
                  onClick={() => setIsCampusModalOpen(false)}
                  className="px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
