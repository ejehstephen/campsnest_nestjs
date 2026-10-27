"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Building2, 
  ShoppingBag, 
  AlertTriangle, 
  Radio, 
  Settings, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Trash2, 
  ExternalLink, 
  UserCheck, 
  UserX, 
  Send, 
  Lock, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Sliders,
  DollarSign,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Eye,
  Check,
  X,
  Video
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/auth-provider";
import { CAMPUS_LIST } from "@/lib/constants";
import { UserProfile, UserRole } from "@/types/user.types";
import { isVideoUrl } from "@/lib/utils";
import { 
  fetchAdminStatsAction, 
  fetchAdminUsersAction, 
  updateUserAdminAction, 
  fetchAdminHousingAction, 
  updateHousingAdminAction, 
  fetchAdminMarketAction, 
  updateMarketItemAdminAction, 
  fetchAdminReportsAction, 
  resolveReportAdminAction, 
  broadcastAdminNotificationAction,
  fetchAdminConfigAction,
  updateAdminConfigAction,
  verifyAdminPasskeyAction,
  AdminStats,
  AdminReportItem
} from "@/lib/admin/actions";
import { deleteHousingListingAction } from "@/lib/housing/actions";
import { deleteMarketItemAction } from "@/lib/market/actions";

type AdminTab = "overview" | "users" | "housing" | "market" | "reports" | "broadcast" | "config";

export default function AdminDashboardPage() {
  const { profile, user } = useAuth();
  
  // Security & Passkey state
  const [isAdminUnlocked, setIsAdminUnlocked] = React.useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = React.useState<string>("");
  const [passkeyError, setPasskeyError] = React.useState<string | null>(null);
  const [isVerifyingPasskey, setIsVerifyingPasskey] = React.useState<boolean>(false);

  // Active view state
  const [activeTab, setActiveTab] = React.useState<AdminTab>("overview");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);

  // Data states
  const [stats, setStats] = React.useState<AdminStats>({
    totalUsers: 171,
    verifiedUsers: 142,
    bannedUsers: 0,
    totalHouses: 11,
    activeHouses: 11,
    featuredHouses: 4,
    totalMarketItems: 69,
    availableMarketItems: 65,
    openReports: 0,
  });

  // Users Tab
  const [usersList, setUsersList] = React.useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = React.useState<string>("");
  const [userRoleFilter, setUserRoleFilter] = React.useState<string>("all");
  const [userStatusFilter, setUserStatusFilter] = React.useState<string>("all");
  const [selectedUserDetail, setSelectedUserDetail] = React.useState<UserProfile | null>(null);

  // Housing Tab
  const [housingList, setHousingList] = React.useState<any[]>([]);
  const [housingSearch, setHousingSearch] = React.useState<string>("");
  const [housingStatusFilter, setHousingStatusFilter] = React.useState<string>("all");

  // Market Tab
  const [marketList, setMarketList] = React.useState<any[]>([]);
  const [marketSearch, setMarketSearch] = React.useState<string>("");
  const [marketCategoryFilter, setMarketCategoryFilter] = React.useState<string>("all");

  // Reports Tab
  const [reportsList, setReportsList] = React.useState<AdminReportItem[]>([]);
  const [reportStatusFilter, setReportStatusFilter] = React.useState<string>("all");
  const [resolutionNoteInput, setResolutionNoteInput] = React.useState<{ [key: string]: string }>({});

  // Broadcast Tab
  const [broadcastTitle, setBroadcastTitle] = React.useState<string>("");
  const [broadcastBody, setBroadcastBody] = React.useState<string>("");
  const [broadcastTarget, setBroadcastTarget] = React.useState<string>("all");
  const [broadcastCategory, setBroadcastCategory] = React.useState<"system" | "security" | "housing" | "market" | "vibe">("system");
  const [isBroadcasting, setIsBroadcasting] = React.useState<boolean>(false);

  // Platform Config Tab
  const [appConfig, setAppConfig] = React.useState<{ [key: string]: string }>({});
  const [supportWhatsAppInput, setSupportWhatsAppInput] = React.useState<string>("");

  // Determine admin authorization status
  const isAuthorizedAdmin = React.useMemo(() => {
    if (isAdminUnlocked) return true;
    if (profile?.role === "admin" || profile?.role === "super_admin" || profile?.is_super_admin) return true;
    if (profile?.email === "stephenejeh92@gmail.com" || user?.email === "stephenejeh92@gmail.com") return true;
    if (typeof window !== "undefined" && localStorage.getItem("campsnest_admin_unlocked") === "true") return true;
    return false;
  }, [profile, user, isAdminUnlocked]);

  // Load all dashboard data
  const loadDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        statsRes,
        usersRes,
        housingRes,
        marketRes,
        reportsRes,
        configRes
      ] = await Promise.all([
        fetchAdminStatsAction(),
        fetchAdminUsersAction({ search: userSearch, role: userRoleFilter, status: userStatusFilter }),
        fetchAdminHousingAction({ search: housingSearch, status: housingStatusFilter }),
        fetchAdminMarketAction({ search: marketSearch, category: marketCategoryFilter }),
        fetchAdminReportsAction({ status: reportStatusFilter }),
        fetchAdminConfigAction(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsersList(usersRes.users);
      if (housingRes.success) setHousingList(housingRes.listings);
      if (marketRes.success) setMarketList(marketRes.items);
      if (reportsRes.success) setReportsList(reportsRes.reports);
      if (configRes) {
        setAppConfig(configRes);
        setSupportWhatsAppInput(configRes.support_whatsapp || "2348134351762");
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userSearch, userRoleFilter, userStatusFilter, housingSearch, housingStatusFilter, marketSearch, marketCategoryFilter, reportStatusFilter]);

  React.useEffect(() => {
    if (isAuthorizedAdmin) {
      loadDashboardData();
    }
  }, [isAuthorizedAdmin, loadDashboardData]);

  // Toast / Banner notice timer
  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Emergency Passkey handler
  const handlePasskeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingPasskey(true);
    setPasskeyError(null);

    const res = await verifyAdminPasskeyAction(passkeyInput);
    setIsVerifyingPasskey(false);

    if (res.success) {
      setIsAdminUnlocked(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("campsnest_admin_unlocked", "true");
      }
    } else {
      setPasskeyError(res.error || "Invalid security passkey.");
    }
  };

  // User Actions
  const handleToggleUserBan = async (u: UserProfile) => {
    const nextBan = !u.is_banned;
    const res = await updateUserAdminAction(u.id, { is_banned: nextBan });
    if (res.success) {
      setUsersList((prev) => prev.map((item) => (item.id === u.id ? { ...item, is_banned: nextBan } : item)));
      showNotice(`${u.name} has been ${nextBan ? "banned from platform" : "unbanned"}.`);
    } else {
      showNotice(`Error: ${res.error}`);
    }
  };

  const handleToggleUserVerification = async (u: UserProfile) => {
    const nextVer = !u.is_verified;
    const res = await updateUserAdminAction(u.id, { is_verified: nextVer });
    if (res.success) {
      setUsersList((prev) => prev.map((item) => (item.id === u.id ? { ...item, is_verified: nextVer } : item)));
      showNotice(`${u.name} verification status: ${nextVer ? "Verified Student ✅" : "Unverified"}.`);
    } else {
      showNotice(`Error: ${res.error}`);
    }
  };

  const handleChangeUserRole = async (u: UserProfile, newRole: UserRole) => {
    const res = await updateUserAdminAction(u.id, { role: newRole });
    if (res.success) {
      setUsersList((prev) => prev.map((item) => (item.id === u.id ? { ...item, role: newRole } : item)));
      showNotice(`Role for ${u.name} changed to ${newRole.toUpperCase()}.`);
    } else {
      showNotice(`Error: ${res.error}`);
    }
  };

  // Housing Actions
  const handleToggleHouseFeatured = async (house: any) => {
    const nextFeatured = !house.is_featured;
    const res = await updateHousingAdminAction(house.id, { is_featured: nextFeatured });
    if (res.success) {
      setHousingList((prev) => prev.map((h) => (h.id === house.id ? { ...h, is_featured: nextFeatured } : h)));
      showNotice(`Lodge "${house.title}" ${nextFeatured ? "marked as Featured ⭐" : "unfeatured"}.`);
    }
  };

  const handleToggleHouseVerified = async (house: any) => {
    const nextVerified = !house.is_owner_verified;
    const res = await updateHousingAdminAction(house.id, { is_owner_verified: nextVerified });
    if (res.success) {
      setHousingList((prev) => prev.map((h) => (h.id === house.id ? { ...h, is_owner_verified: nextVerified } : h)));
      showNotice(`Lodge "${house.title}" owner status: ${nextVerified ? "Verified Host 🛡️" : "Unverified"}.`);
    }
  };

  const handleToggleHouseActive = async (house: any) => {
    const nextActive = !house.is_active;
    const res = await updateHousingAdminAction(house.id, { is_active: nextActive });
    if (res.success) {
      setHousingList((prev) => prev.map((h) => (h.id === house.id ? { ...h, is_active: nextActive } : h)));
      showNotice(`Lodge "${house.title}" status changed to ${nextActive ? "Active" : "Inactive"}.`);
    }
  };

  const handleDeleteHouse = async (house: any) => {
    if (!confirm(`Are you sure you want to permanently delete lodge "${house.title}"?`)) return;
    const res = await deleteHousingListingAction(house.id);
    if (res.success) {
      setHousingList((prev) => prev.filter((h) => h.id !== house.id));
      showNotice(`Lodge "${house.title}" deleted.`);
    }
  };

  // Market Actions
  const handleToggleMarketStatus = async (item: any, newStatus: "available" | "sold") => {
    const res = await updateMarketItemAdminAction(item.id, newStatus);
    if (res.success) {
      setMarketList((prev) => prev.map((m) => (m.id === item.id ? { ...m, status: newStatus } : m)));
      showNotice(`Item "${item.title}" marked as ${newStatus.toUpperCase()}.`);
    }
  };

  const handleDeleteMarketItem = async (item: any) => {
    if (!confirm(`Permanently remove marketplace item "${item.title}"?`)) return;
    const res = await deleteMarketItemAction(item.id);
    if (res.success) {
      setMarketList((prev) => prev.filter((m) => m.id !== item.id));
      showNotice(`Marketplace item "${item.title}" removed.`);
    }
  };

  // Report Actions
  const handleResolveReport = async (reportId: string, status: "resolved" | "dismissed") => {
    const note = resolutionNoteInput[reportId] || "";
    const res = await resolveReportAdminAction(reportId, {
      status,
      resolution_notes: note,
    });
    if (res.success) {
      setReportsList((prev) => prev.map((r) => (r.id === reportId ? { ...r, status, resolution_notes: note } : r)));
      showNotice(`Report marked as ${status.toUpperCase()}.`);
    }
  };

  // Broadcast Notification
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) {
      showNotice("Please fill out both notification title and announcement body.");
      return;
    }

    setIsBroadcasting(true);
    const res = await broadcastAdminNotificationAction({
      title: broadcastTitle,
      body: broadcastBody,
      targetSchool: broadcastTarget,
      category: broadcastCategory,
      actionUrl: "/home",
    });
    setIsBroadcasting(false);

    if (res.success) {
      showNotice(`Broadcast alert successfully dispatched to ${res.sentCount} students! 📢`);
      setBroadcastTitle("");
      setBroadcastBody("");
    } else {
      showNotice(`Broadcast notice: ${res.error}`);
    }
  };

  // App Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAdminConfigAction("support_whatsapp", supportWhatsAppInput.trim());
    showNotice("Platform configuration updated successfully.");
  };

  // =========================================================================
  // SECURITY GATE SCREEN (FOR UNAUTHORIZED USERS)
  // =========================================================================
  if (!isAuthorizedAdmin) {
    return (
      <AppShell>
        <div className="min-h-[75vh] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#141029] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl text-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-violet/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-magenta/20 rounded-full blur-3xl pointer-events-none" />

            <div className="h-16 w-16 rounded-3xl bg-brand-violet/20 border border-brand-violet/30 mx-auto flex items-center justify-center text-brand-violet-light shadow-[0_0_24px_rgba(139,92,246,0.3)]">
              <Lock className="h-8 w-8 text-brand-violet-light" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                CampsNest Admin Portal
              </h1>
              <p className="text-xs text-text-dim leading-relaxed">
                This administrative command center is restricted to verified campus coordinators and platform moderators.
              </p>
            </div>

            {/* Emergency Passkey Form */}
            <form onSubmit={handlePasskeySubmit} className="space-y-4 pt-2 text-left">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                  Admin Passkey
                </label>
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter administrative passkey..."
                  className="w-full h-11 rounded-2xl bg-white/[0.04] border border-white/15 px-4 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                />
              </div>

              {passkeyError && (
                <p className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{passkeyError}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifyingPasskey || !passkeyInput.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-violet to-brand-magenta hover:brightness-110 active:scale-[0.99] text-white text-xs font-bold shadow-[0_4px_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifyingPasskey ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                <span>Authorize & Enter Hub</span>
              </button>
            </form>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-text-dim">
              <Link href="/home" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Home</span>
              </Link>
              <Link href="/login" className="hover:text-brand-violet-light transition-colors">
                Switch Account
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // =========================================================================
  // MAIN ADMIN COMMAND CENTER
  // =========================================================================
  return (
    <AppShell>
      <div className="space-y-6 pb-24 max-w-7xl mx-auto animate-fade-in">
        
        {/* Toast Action Notification */}
        {actionNotice && (
          <div className="fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-[#1C163D] border border-brand-violet/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-slide-down">
            <Sparkles className="h-4 w-4 text-brand-magenta shrink-0 animate-pulse" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. ADMIN HUB HEADER BANNER */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-r from-[#171133] via-[#120D26] to-[#0A0718] p-5 sm:p-7 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-violet/20 border border-brand-violet/30 text-brand-violet-light text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-brand-magenta" />
                  <span>Platform Command Center</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Live Supabase DB
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-2.5">
                CampsNest 2.0 Admin Hub <span className="text-xl">⚡</span>
              </h1>
              <p className="text-xs text-text-dim">
                Signed in as <strong className="text-white">{profile?.name || "Stephen (Super Admin)"}</strong> • Complete multi-campus governance & moderation.
              </p>
            </div>

            {/* Quick Actions & Live Refresh */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={loadDashboardData}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-brand-magenta" : ""}`} />
                <span>Refresh Data</span>
              </button>

              <button
                onClick={() => setActiveTab("broadcast")}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-violet to-brand-magenta hover:brightness-110 text-white text-xs font-bold shadow-[0_4px_16px_rgba(236,72,153,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Radio className="h-3.5 w-3.5" />
                <span>Broadcast Alert</span>
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TAB NAVIGATION PILLS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "overview" as const, label: "Overview", icon: Sliders },
            { id: "users" as const, label: `Students (${stats.totalUsers})`, icon: Users },
            { id: "housing" as const, label: `Housing (${stats.totalHouses})`, icon: Building2 },
            { id: "market" as const, label: `Marketplace (${stats.totalMarketItems})`, icon: ShoppingBag },
            { id: "reports" as const, label: `Reports (${stats.openReports})`, icon: ShieldAlert },
            { id: "broadcast" as const, label: "Broadcast Alert", icon: Radio },
            { id: "config" as const, label: "Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 select-none ${
                  isActive
                    ? "bg-brand-violet text-white shadow-[0_4px_16px_rgba(139,92,246,0.35)]"
                    : "bg-white/[0.04] hover:bg-white/[0.08] text-text-dim hover:text-white border border-white/10"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-text-muted"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & PLATFORM METRICS */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
              
              <div className="p-4 sm:p-5 rounded-3xl bg-[#141029] border border-white/10 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-dim">Total Students</span>
                  <div className="p-2 rounded-xl bg-brand-violet/20 text-brand-violet-light">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  {stats.totalUsers}
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  <span>{stats.verifiedUsers} Verified on Campus</span>
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-[#141029] border border-white/10 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-dim">Housing Lodges</span>
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  {stats.totalHouses}
                </div>
                <p className="text-[11px] text-text-dim">
                  <span className="text-white font-semibold">{stats.activeHouses} Active</span> • {stats.featuredHouses} Featured
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-[#141029] border border-white/10 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-dim">Marketplace Items</span>
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  {stats.totalMarketItems}
                </div>
                <p className="text-[11px] text-text-dim">
                  <span className="text-emerald-400 font-semibold">{stats.availableMarketItems} Available</span> for sale
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-[#141029] border border-white/10 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-dim">Safety Moderation</span>
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  {stats.openReports}
                </div>
                <p className="text-[11px] text-rose-400 font-semibold">
                  {stats.openReports === 0 ? "All queues clean 🛡️" : "Pending admin review"}
                </p>
              </div>

            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => setActiveTab("users")}
                className="p-5 rounded-3xl bg-gradient-to-br from-[#171233] to-[#130E29] border border-white/10 hover:border-brand-violet/50 transition-all cursor-pointer group shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="h-10 w-10 rounded-2xl bg-brand-violet/20 flex items-center justify-center text-brand-violet-light group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5" />
                  </span>
                  <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-brand-violet-light transition-colors">Manage Students & Roles</h3>
                  <p className="text-xs text-text-dim mt-0.5">Verify identity documents, elevate host roles, or ban abusive accounts.</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab("housing")}
                className="p-5 rounded-3xl bg-gradient-to-br from-[#171233] to-[#130E29] border border-white/10 hover:border-brand-violet/50 transition-all cursor-pointer group shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="h-10 w-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-brand-violet-light transition-colors">Moderate Accommodations</h3>
                  <p className="text-xs text-text-dim mt-0.5">Feature executive lodges, audit inspection fees, verify lodge hosts.</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab("reports")}
                className="p-5 rounded-3xl bg-gradient-to-br from-[#171233] to-[#130E29] border border-white/10 hover:border-brand-violet/50 transition-all cursor-pointer group shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="h-10 w-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                    <ShieldAlert className="h-5 w-5" />
                  </span>
                  <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-brand-violet-light transition-colors">Trust & Safety Queue</h3>
                  <p className="text-xs text-text-dim mt-0.5">Resolve scam alerts, investigate fraud reports, maintain safe campus living.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: USERS & STUDENTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "users" && (
          <div className="space-y-4 animate-fade-in">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#141029] border border-white/10">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search student name, email, department, or school..."
                  className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-4 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-brand-violet"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="all" className="bg-[#141029]">All Roles</option>
                  <option value="user" className="bg-[#141029]">Student</option>
                  <option value="host" className="bg-[#141029]">Lodge Host</option>
                  <option value="admin" className="bg-[#141029]">Admin</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="all" className="bg-[#141029]">All Statuses</option>
                  <option value="verified" className="bg-[#141029]">Verified Only</option>
                  <option value="banned" className="bg-[#141029]">Banned Only</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-3xl border border-white/10 bg-[#141029] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.03] text-text-dim uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-5 py-3.5">Student / User</th>
                      <th className="px-4 py-3.5">Campus & Level</th>
                      <th className="px-4 py-3.5">Role</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-text-dim">
                          No students matched your query.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Avatar size="sm" src={u.profile_image || undefined} fallback={u.name?.slice(0, 2).toUpperCase() || "ST"} />
                              <div>
                                <p className="font-bold text-white flex items-center gap-1.5">
                                  <span>{u.name || "Campus Student"}</span>
                                  {u.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />}
                                </p>
                                <p className="text-[11px] text-text-dim">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 text-text-secondary">
                            <p className="font-medium text-white/90">{u.school || "FU Wukari"}</p>
                            <p className="text-[10px] text-text-dim">{u.department || "Computer Science"} • {u.level || "300L"}</p>
                          </td>

                          <td className="px-4 py-3.5">
                            <select
                              value={u.role || "user"}
                              onChange={(e) => handleChangeUserRole(u, e.target.value as UserRole)}
                              className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-[11px] font-bold text-white focus:outline-none"
                            >
                              <option value="user" className="bg-[#141029]">Student</option>
                              <option value="host" className="bg-[#141029]">Host</option>
                              <option value="admin" className="bg-[#141029]">Admin</option>
                            </select>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              {u.is_banned ? (
                                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                                  Banned
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                                  Active
                                </span>
                              )}
                              {u.is_verified && (
                                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold border border-indigo-500/20">
                                  Verified
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => setSelectedUserDetail(u)}
                              className="p-1.5 rounded-xl hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                              title="View full profile"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleToggleUserVerification(u)}
                              className={`p-1.5 rounded-xl transition-colors ${
                                u.is_verified ? "text-emerald-400 hover:bg-emerald-500/10" : "text-text-muted hover:text-white hover:bg-white/10"
                              }`}
                              title={u.is_verified ? "Revoke Verification" : "Grant Verified Student Badge"}
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleToggleUserBan(u)}
                              className={`p-1.5 rounded-xl transition-colors ${
                                u.is_banned ? "text-emerald-400 hover:bg-emerald-500/10" : "text-rose-400 hover:bg-rose-500/10"
                              }`}
                              title={u.is_banned ? "Unban User" : "Ban User from Platform"}
                            >
                              {u.is_banned ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: HOUSING LISTINGS MODERATION */}
        {/* ========================================================================= */}
        {activeTab === "housing" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#141029] border border-white/10">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  value={housingSearch}
                  onChange={(e) => setHousingSearch(e.target.value)}
                  placeholder="Search lodge title, location, or school..."
                  className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-4 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-brand-violet"
                />
              </div>

              <select
                value={housingStatusFilter}
                onChange={(e) => setHousingStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="all" className="bg-[#141029]">All Listings</option>
                <option value="active" className="bg-[#141029]">Active Only</option>
                <option value="featured" className="bg-[#141029]">Featured Only</option>
                <option value="inactive" className="bg-[#141029]">Inactive</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {housingList.length === 0 ? (
                <div className="col-span-full py-12 text-center text-text-dim">
                  No accommodations found.
                </div>
              ) : (
                housingList.map((house) => (
                  <div key={house.id} className="rounded-3xl border border-white/10 bg-[#141029] overflow-hidden shadow-lg flex flex-col justify-between">
                    <div>
                      {/* Image / Video Preview & Badges */}
                      <div className="relative aspect-video w-full bg-[#181333] overflow-hidden">
                        {isVideoUrl(house.image) ? (
                          <video
                            src={house.image}
                            muted
                            playsInline
                            autoPlay
                            loop
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={house.image || "/campsnest-logo.png"}
                            alt={house.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/campsnest-logo.png";
                            }}
                          />
                        )}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          {house.is_featured && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-black text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                              <Star className="h-3 w-3 fill-current" />
                              <span>Featured</span>
                            </span>
                          )}
                          {house.is_owner_verified && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Verified Host</span>
                            </span>
                          )}
                          {(house.has_video || isVideoUrl(house.image)) && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/90 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                              <Video className="h-3 w-3" />
                              <span>Tour</span>
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs font-extrabold">
                          ₦{Number(house.price).toLocaleString()}/yr
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-white text-sm line-clamp-1">{house.title}</h3>
                          <Link href={`/housing/${house.id}`} target="_blank" className="p-1 rounded-lg hover:bg-white/10 text-text-muted hover:text-white shrink-0">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                        <p className="text-xs text-text-dim line-clamp-1">{house.location} • {house.school}</p>
                        <p className="text-[11px] text-text-secondary">Host: <strong className="text-white">{house.host_name}</strong> ({house.host_phone || "No phone"})</p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleHouseFeatured(house)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                          house.is_featured ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-white/[0.05] text-text-muted hover:text-white"
                        }`}
                      >
                        <Star className={`h-3 w-3 ${house.is_featured ? "fill-current" : ""}`} />
                        <span>{house.is_featured ? "Featured" : "Feature"}</span>
                      </button>

                      <button
                        onClick={() => handleToggleHouseVerified(house)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                          house.is_owner_verified ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-white/[0.05] text-text-muted hover:text-white"
                        }`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        <span>{house.is_owner_verified ? "Verified" : "Verify Host"}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteHouse(house)}
                        className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MARKETPLACE ITEMS MODERATION */}
        {/* ========================================================================= */}
        {activeTab === "market" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#141029] border border-white/10">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  value={marketSearch}
                  onChange={(e) => setMarketSearch(e.target.value)}
                  placeholder="Search item title, seller, or school..."
                  className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-4 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-brand-violet"
                />
              </div>

              <select
                value={marketCategoryFilter}
                onChange={(e) => setMarketCategoryFilter(e.target.value)}
                className="h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="all" className="bg-[#141029]">All Categories</option>
                <option value="electronics" className="bg-[#141029]">Electronics</option>
                <option value="computers" className="bg-[#141029]">Laptops & Tech</option>
                <option value="books" className="bg-[#141029]">Books & Handouts</option>
                <option value="hostel_essentials" className="bg-[#141029]">Hostel Essentials</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketList.length === 0 ? (
                <div className="col-span-full py-12 text-center text-text-dim">
                  No marketplace items found.
                </div>
              ) : (
                marketList.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-white/10 bg-[#141029] overflow-hidden shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-video w-full bg-[#181333] overflow-hidden">
                        <img 
                          src={item.image || "/campsnest-logo.png"} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/campsnest-logo.png";
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                          {item.category}
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md text-emerald-400 text-xs font-extrabold">
                          ₦{Number(item.price).toLocaleString()}
                        </div>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
                          <Link href={`/market/${item.id}`} target="_blank" className="p-1 rounded-lg hover:bg-white/10 text-text-muted hover:text-white shrink-0">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                        <p className="text-xs text-text-dim line-clamp-2">{item.description}</p>
                        <p className="text-[11px] text-text-secondary">Seller: <strong className="text-white">{item.seller_name}</strong> ({item.school})</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleMarketStatus(item, item.status === "available" ? "sold" : "available")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            item.status === "sold" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                          }`}
                        >
                          {item.status === "sold" ? "Mark Available" : "Mark Sold"}
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteMarketItem(item)}
                        className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TRUST, SAFETY & REPORTS MODERATION */}
        {/* ========================================================================= */}
        {activeTab === "reports" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141029] border border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white">Safety Moderation Queue</h3>
                <p className="text-xs text-text-dim">Complaints and flags filed by students regarding fake items, scam hosts, or abuse.</p>
              </div>

              <select
                value={reportStatusFilter}
                onChange={(e) => setReportStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="all" className="bg-[#141029]">All Statuses</option>
                <option value="pending" className="bg-[#141029]">Pending Review</option>
                <option value="resolved" className="bg-[#141029]">Resolved</option>
                <option value="dismissed" className="bg-[#141029]">Dismissed</option>
              </select>
            </div>

            <div className="space-y-3">
              {reportsList.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-[#141029] border border-white/10 space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Trust & Safety Queue Clear</h4>
                  <p className="text-xs text-text-dim max-w-sm mx-auto">No pending student safety violations reported on campus.</p>
                </div>
              ) : (
                reportsList.map((report) => (
                  <div key={report.id} className="p-5 rounded-3xl bg-[#141029] border border-white/10 space-y-3 shadow-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            report.status === "pending"
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                              : report.status === "resolved"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-white/10 text-text-dim border-white/15"
                          }`}>
                            {report.status}
                          </span>
                          <span className="text-xs font-bold text-white">{report.reason}</span>
                        </div>
                        <p className="text-xs text-text-dim">
                          Filed by <strong className="text-white">{report.reporter_name}</strong> on {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-brand-violet-light">{report.target_title}</span>
                      </div>
                    </div>

                    {report.details && (
                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-white/90">
                        {report.details}
                      </div>
                    )}

                    {/* Resolution Action Row */}
                    <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <input
                        type="text"
                        placeholder="Add resolution notes..."
                        value={resolutionNoteInput[report.id] || report.resolution_notes || ""}
                        onChange={(e) => setResolutionNoteInput({ ...resolutionNoteInput, [report.id]: e.target.value })}
                        className="flex-1 h-9 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-xs text-white placeholder:text-text-dim focus:outline-none"
                      />

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleResolveReport(report.id, "resolved")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all"
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => handleResolveReport(report.id, "dismissed")}
                          className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-text-dim hover:text-white text-xs font-bold border border-white/10 transition-all"
                        >
                          Dismiss Flag
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: BROADCAST SYSTEM ANNOUNCEMENT */}
        {/* ========================================================================= */}
        {activeTab === "broadcast" && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-[#141029] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-brand-magenta/20 text-brand-magenta">
                  <Radio className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-heading font-extrabold text-white">Campus Broadcast Alert</h3>
              </div>
              <p className="text-xs text-text-dim">
                Push instantaneous announcements, safety warnings, and academic updates directly to student devices.
              </p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary">Notification Title</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. New Executive Lodge Listings Added Around Campus!"
                  className="w-full h-11 rounded-2xl bg-white/[0.04] border border-white/15 px-4 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-brand-violet"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary">Announcement Message</label>
                <textarea
                  rows={4}
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  placeholder="Type the full message students will see in push alerts and in-app inbox..."
                  className="w-full rounded-2xl bg-white/[0.04] border border-white/15 p-4 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-brand-violet resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary">Target Campus</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full h-11 rounded-2xl bg-[#181333] border border-white/15 px-3 text-xs text-white focus:outline-none"
                  >
                    <option value="all">All Nigerian Campuses (Global)</option>
                    {CAMPUS_LIST.map((c) => (
                      <option key={c.id} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary">Alert Category</label>
                  <select
                    value={broadcastCategory}
                    onChange={(e) => setBroadcastCategory(e.target.value as any)}
                    className="w-full h-11 rounded-2xl bg-[#181333] border border-white/15 px-3 text-xs text-white focus:outline-none"
                  >
                    <option value="system">System Notice</option>
                    <option value="security">Safety Alert 🛡️</option>
                    <option value="housing">Housing Update 🏡</option>
                    <option value="market">Market Deal 🛍️</option>
                    <option value="vibe">Campus Vibe 💖</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBroadcasting || !broadcastTitle.trim() || !broadcastBody.trim()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-violet to-brand-magenta hover:brightness-110 active:scale-[0.99] text-white text-xs font-bold shadow-[0_4px_24px_rgba(236,72,153,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isBroadcasting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span>Send Broadcast Alert 📢</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: PLATFORM SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "config" && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-[#141029] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="space-y-1.5">
              <h3 className="text-lg font-heading font-extrabold text-white">Platform Settings</h3>
              <p className="text-xs text-text-dim">Configure global parameters and administrative contact numbers.</p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary">Official Support WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    value={supportWhatsAppInput}
                    onChange={(e) => setSupportWhatsAppInput(e.target.value)}
                    placeholder="2348134351762"
                    className="w-full h-11 rounded-2xl bg-white/[0.04] border border-white/15 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-violet"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                <p className="font-bold text-white">Standard Inspection Fee</p>
                <p className="text-text-dim">Fixed platform inspection admin fee: <strong className="text-brand-violet-light">₦1,000</strong></p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-brand-violet hover:bg-brand-violet/90 text-white text-xs font-bold shadow-lg transition-all"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: FULL USER DETAIL VIEW */}
        {/* ========================================================================= */}
        {selectedUserDetail && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-[#141029] border border-white/20 p-6 space-y-5 shadow-2xl text-white relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar size="md" src={selectedUserDetail.profile_image || undefined} fallback={selectedUserDetail.name?.slice(0, 2).toUpperCase()} />
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>{selectedUserDetail.name}</span>
                      {selectedUserDetail.is_verified && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                    </h3>
                    <p className="text-xs text-text-dim">{selectedUserDetail.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUserDetail(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[10px] text-text-dim uppercase font-bold">Campus / School</span>
                  <p className="font-semibold text-white">{selectedUserDetail.school || "FU Wukari"}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[10px] text-text-dim uppercase font-bold">Academic Department</span>
                  <p className="font-semibold text-white">{selectedUserDetail.department || "Computer Science"} ({selectedUserDetail.level || "300L"})</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[10px] text-text-dim uppercase font-bold">WhatsApp / Phone</span>
                  <p className="font-semibold text-white">{selectedUserDetail.whatsapp_number || selectedUserDetail.phone_number || "None listed"}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[10px] text-text-dim uppercase font-bold">System Role</span>
                  <p className="font-semibold text-brand-violet-light uppercase">{selectedUserDetail.role}</p>
                </div>
              </div>

              {selectedUserDetail.bio && (
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-text-secondary space-y-1">
                  <span className="text-[10px] text-text-dim uppercase font-bold">Bio</span>
                  <p>{selectedUserDetail.bio}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => setSelectedUserDetail(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
