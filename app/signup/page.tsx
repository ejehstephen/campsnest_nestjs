"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Home as HomeIcon, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  User,
  GraduationCap,
  Building2,
  BookOpen,
  Phone,
  Check,
  ChevronRight,
  Upload,
  Camera,
  Image as ImageIcon
} from "lucide-react";
import { CAMPUS_LIST } from "@/lib/constants";
import { 
  signUpAction, 
  verifyOtpAction, 
  resendVerificationOtpAction, 
  updateAcademicProfileAction 
} from "@/lib/auth/actions";
import { compressAvatarImage } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/common/brand-logo";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80",
];

const ACADEMIC_LEVELS = [
  "100L",
  "200L",
  "300L",
  "400L",
  "500L",
  "Postgraduate",
];

export default function SignUpPage() {
  const router = useRouter();

  // Multi-step State (1 = Credentials, 2 = Verify Email, 3 = Profile & Academic)
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [createdUserId, setCreatedUserId] = React.useState<string | null>(null);

  // Step 1: Credentials
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [school, setSchool] = React.useState("fuwukari");
  const [gender, setGender] = React.useState("Female");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(true);

  // Step 2: Verification
  const [otpCode, setOtpCode] = React.useState("");
  const [resendTimer, setResendTimer] = React.useState(60);
  const [isResending, setIsResending] = React.useState(false);

  // Step 3: Profile & Academic (STRICTLY REQUIRED: Avatar & WhatsApp Phone)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedAvatar, setSelectedAvatar] = React.useState<string>("");
  const [faculty, setFaculty] = React.useState("Faculty of Science");
  const [department, setDepartment] = React.useState("Computer Science");
  const [level, setLevel] = React.useState("300L");
  const [phone, setPhone] = React.useState("");
  const [bio, setBio] = React.useState("");

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressAvatarImage(file);
        setSelectedAvatar(compressed);
        setError(null);
      } catch (err) {
        console.error("Error compressing image:", err);
      }
    }
  };

  // Status & Errors
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Countdown timer for OTP resend
  React.useEffect(() => {
    let interval: any;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Handle Step 1 Submit (Registration)
  const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the CampsNest Student Code of Conduct.");
      return;
    }

    setLoading(true);

    try {
      const selectedSchoolName = CAMPUS_LIST.find((c) => c.id === school)?.name || school;

      const res = await signUpAction({
        name: name.trim(),
        email: email.trim(),
        password,
        school: selectedSchoolName,
        gender,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      if (res.userId) {
        setCreatedUserId(res.userId);
      }

      // Move to Step 2: Email Verification Screen
      setStep(2);
      setResendTimer(60);
      setLoading(false);
    } catch (err: any) {
      setStep(2);
      setResendTimer(60);
      setLoading(false);
    }
  };

  // Handle Step 2 Submit (Verify OTP)
  const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!otpCode.trim()) {
      setError("Please enter the verification code sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyOtpAction(email.trim(), otpCode.trim());

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      if (res.userId) {
        setCreatedUserId(res.userId);
      }

      // Move to Step 3: Academic Profile Setup
      setStep(3);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "Verification code failed. Please check and retry.");
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await resendVerificationOtpAction(email.trim());
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccessMsg("A new verification code has been dispatched to your email.");
        setResendTimer(60);
      }
    } catch (err: any) {
      setError("Unable to resend OTP. Please wait and try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Handle Step 3 Submit (Save Profile & Enforce Required Fields)
  const handleStep3Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // 1. Validate Required Profile Image
    if (!selectedAvatar || selectedAvatar.trim() === "") {
      setError("Profile picture is required. Please upload your photo or select a verified avatar.");
      return;
    }

    // 2. Validate Required WhatsApp Phone Number
    const cleanedPhone = phone.trim().replace(/\s+/g, "");
    if (!cleanedPhone || cleanedPhone.length < 10) {
      setError("WhatsApp phone number is required (e.g. 08134351762). This connects you to roommates, buyers, and hosts.");
      return;
    }

    setLoading(true);

    try {
      const selectedSchoolName = CAMPUS_LIST.find((c) => c.id === school)?.name || school;
      const cleanName = name.trim();

      if (createdUserId) {
        await updateAcademicProfileAction(createdUserId, {
          name: cleanName,
          profile_image: selectedAvatar,
          faculty,
          department,
          level,
          phone_number: cleanedPhone,
          whatsapp_number: cleanedPhone,
          bio: bio || `Student at ${selectedSchoolName}`,
        });
      }

      // Also immediately update localStorage profile cache and dispatch event
      if (typeof window !== "undefined") {
        const selectedCampusObj = CAMPUS_LIST.find((c) => c.id === school || c.name.toLowerCase() === selectedSchoolName.toLowerCase()) || {
          id: school,
          name: selectedSchoolName,
          code: selectedSchoolName.slice(0, 4).toUpperCase(),
        };

        const newProfile = {
          id: createdUserId || "user-" + Date.now(),
          name: cleanName,
          email: email.trim(),
          school: selectedSchoolName,
          gender,
          faculty,
          department,
          level,
          phone_number: cleanedPhone,
          whatsapp_number: cleanedPhone,
          profile_image: selectedAvatar,
          bio: bio || `Student at ${selectedSchoolName}`,
          role: "user",
          is_verified: true,
          preferences: [],
          updated_at: new Date().toISOString()
        };
        localStorage.setItem("campsnest_user_profile", JSON.stringify(newProfile));
        localStorage.setItem("campsnest_selected_campus", JSON.stringify(selectedCampusObj));
        window.dispatchEvent(new CustomEvent("campsnest:profile_updated", { detail: newProfile }));
        window.dispatchEvent(new CustomEvent("campsnest:campus_changed", { detail: selectedCampusObj }));
      }

      // Final redirect to Home feed
      router.push("/home");
      router.refresh();
    } catch (err: any) {
      router.push("/home");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-canvas-midnight text-white flex flex-col justify-between selection:bg-brand-magenta/30 selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-violet/10 blur-[140px]" />
        <div className="absolute top-1/2 -left-32 w-[450px] h-[450px] rounded-full bg-brand-magenta/10 blur-[150px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 w-full px-6 lg:px-16 py-6 flex items-center justify-between">
        <BrandLogo size="md" href="/" />

        <Link
          href="/login"
          className="text-xs sm:text-sm font-semibold text-text-secondary hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <span>Already registered?</span>
          <span className="text-brand-violet-light font-bold hover:underline">Log In</span>
        </Link>
      </header>

      {/* Main Container Card */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#141122] border border-white/10 shadow-2xl space-y-6">
          
          {/* 3-Step Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-text-muted px-1">
              <span className={step >= 1 ? "text-brand-violet-light font-semibold" : ""}>1. Account</span>
              <span className={step >= 2 ? "text-brand-magenta-light font-semibold" : ""}>2. Verification</span>
              <span className={step >= 3 ? "text-emerald-400 font-semibold" : ""}>3. Profile</span>
            </div>

            {/* Progress Bar Line */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-violet to-emerald-400 transition-all duration-300 rounded-full"
                style={{
                  width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                }}
              />
            </div>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1: CREDENTIALS & UNIVERSITY & GENDER SELECTION */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                  Join CampsNest 2.0
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary">
                  Create your verified student profile to find housing, market deals, and roommates.
                </p>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-dim block">
                    Full Legal / Campus Name <span className="text-brand-magenta">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Stephen Ejeh"
                      className="w-full h-11 sm:h-12 rounded-2xl bg-white/[0.04] border border-white/15 pl-10 pr-4 text-xs font-medium text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-dim block">
                    Student Email Address <span className="text-brand-magenta">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@university.edu.ng"
                      className="w-full h-11 sm:h-12 rounded-2xl bg-white/[0.04] border border-white/15 pl-10 pr-4 text-xs font-medium text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                    />
                  </div>
                </div>

                {/* Campus / University Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-dim block">
                    University / Campus <span className="text-brand-magenta">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <GraduationCap className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                    <select
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full h-11 sm:h-12 rounded-2xl bg-[#1C153B] border border-white/15 pl-10 pr-8 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all cursor-pointer"
                    >
                      {CAMPUS_LIST.map((campus) => (
                        <option key={campus.id} value={campus.id} className="bg-[#1C153B] text-white">
                          {campus.name} ({campus.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gender Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-dim block">
                    Gender Identity <span className="text-brand-magenta">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Female", "Male", "Other"].map((g) => {
                      const isSelected = gender === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-gradient-to-r from-brand-violet to-brand-magenta text-white border-transparent shadow-glow-magenta/30"
                              : "bg-white/[0.04] hover:bg-white/[0.08] text-text-secondary border-white/10"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-dim block">
                      Password <span className="text-brand-magenta">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 sm:h-12 rounded-2xl bg-white/[0.04] border border-white/15 pl-10 pr-9 text-xs font-medium text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-dim block">
                      Confirm Password <span className="text-brand-magenta">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 sm:h-12 rounded-2xl bg-white/[0.04] border border-white/15 pl-10 pr-9 text-xs font-medium text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-text-dim hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>{showPassword ? "Hide password" : "Show password"}</span>
                </button>

                {/* Terms Agreement */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-text-secondary leading-relaxed">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded bg-white/10 border-white/20 text-brand-violet focus:ring-brand-violet accent-brand-violet h-4 w-4 shrink-0"
                    />
                    <span>
                      I agree to the <Link href="/terms" className="text-brand-violet-light underline hover:text-white">Terms of Service</Link> and <Link href="/privacy" className="text-brand-violet-light underline hover:text-white">Privacy Policy</Link>.
                    </span>
                  </label>
                </div>

                {/* Submit Step 1 Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-glow-violet hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Student Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Verification</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: EMAIL OTP VERIFICATION */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="h-12 w-12 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 text-brand-violet-light flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-heading font-extrabold text-white tracking-tight">
                  Verify Student Email
                </h2>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  We've sent a digit confirmation code to <span className="text-white font-semibold font-mono">{email}</span>.
                </p>
              </div>

              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-dim block text-center">
                    Enter Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="123456"
                    className="w-full h-14 rounded-2xl bg-white/[0.04] border border-white/20 text-center text-2xl font-mono font-bold tracking-[0.5em] text-white focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full h-12 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-glow-violet disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Continue</span>
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  {/* Resend Code Button */}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isResending}
                    className="text-xs font-semibold text-text-dim hover:text-white disabled:opacity-40 transition-colors pt-1 text-center"
                  >
                    {resendTimer > 0 ? (
                      <span>Resend code in {resendTimer}s</span>
                    ) : isResending ? (
                      <span>Resending code...</span>
                    ) : (
                      <span className="text-brand-violet-light underline">Resend Verification Code</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: AVATAR & WHATSAPP ONBOARDING (MANDATORY REQUIRED FIELDS) */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>EMAIL VERIFIED</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                  Complete Your Profile
                </h2>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Upload your photo and WhatsApp number. These are required to connect with roommates, hosts, and buyers.
                </p>
              </div>

              <form onSubmit={handleStep3Submit} className="space-y-5">
                
                {/* 1. REQUIRED Profile Picture Upload & Presets */}
                <div className="space-y-2.5 text-center p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Camera className="h-4 w-4 text-brand-violet-light" />
                      <span>Profile Picture</span>
                      <span className="text-brand-magenta font-extrabold">* (Required)</span>
                    </label>
                    <span className="text-[10px] font-semibold text-text-dim">Tap circle to upload</span>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />

                  {/* Circular Upload Avatar Card */}
                  <div className="flex flex-col items-center py-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative h-24 w-24 sm:h-28 sm:w-28 rounded-full mx-auto border-2 transition-all cursor-pointer group flex flex-col items-center justify-center overflow-hidden shadow-2xl hover:scale-105 ${
                        selectedAvatar
                          ? "border-emerald-400 bg-white/[0.04]"
                          : "border-dashed border-brand-magenta animate-pulse bg-brand-magenta/[0.06] hover:bg-brand-magenta/[0.12]"
                      }`}
                    >
                      {selectedAvatar ? (
                        <>
                          <img
                            src={selectedAvatar}
                            alt="Profile Preview"
                            className="h-full w-full object-cover rounded-full"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                            <Upload className="h-4 w-4 text-brand-magenta-light" />
                            <span className="text-[10px]">Change</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-text-muted group-hover:text-white space-y-1">
                          <Upload className="h-6 w-6 text-brand-magenta-light group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-white">Upload Photo</span>
                          <span className="text-[9px] text-brand-magenta font-semibold">* Required</span>
                        </div>
                      )}

                      <div className={`absolute bottom-0 inset-x-0 py-0.5 text-[8px] font-extrabold text-white text-center tracking-wider ${
                        selectedAvatar ? "bg-emerald-600/90" : "bg-brand-magenta/90"
                      }`}>
                        {selectedAvatar ? "PHOTO READY" : "TAP TO UPLOAD"}
                      </div>
                    </div>
                  </div>

                  {/* Quick Avatar Presets */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] text-text-dim text-left">Or choose a verified student avatar:</p>
                    <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedAvatar(preset);
                            setError(null);
                          }}
                          className={`relative h-10 w-10 rounded-full overflow-hidden border-2 transition-transform shrink-0 ${
                            selectedAvatar === preset
                              ? "border-emerald-400 scale-110 shadow-glow-magenta"
                              : "border-white/20 hover:border-white/50 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={preset} alt={`Avatar ${idx + 1}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. REQUIRED WhatsApp Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-emerald-400" />
                      <span>WhatsApp Phone Number</span>
                      <span className="text-brand-magenta font-extrabold">* (Required)</span>
                    </span>
                    <span className="text-[10px] text-text-dim">For chat & offers</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. 08134351762 or +234..."
                      className="w-full h-11 sm:h-12 rounded-2xl bg-white/[0.04] border border-white/15 pl-10 pr-3 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-text-muted">
                    This phone number will be used for 1-click WhatsApp inquiries on your room listings and marketplace sales.
                  </p>
                </div>

                {/* Faculty & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-dim block">
                      Faculty
                    </label>
                    <div className="relative flex items-center">
                      <Building2 className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                      <input
                        type="text"
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        placeholder="Faculty of Science"
                        className="w-full h-11 rounded-2xl bg-white/[0.04] border border-white/15 pl-10 pr-3 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-dim block">
                      Department
                    </label>
                    <div className="relative flex items-center">
                      <BookOpen className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Computer Science"
                        className="w-full h-11 rounded-2xl bg-white/[0.04] border border-white/15 pl-10 pr-3 text-xs text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-dim block">
                    Academic Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full h-11 rounded-2xl bg-[#1C153B] border border-white/15 px-3.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-violet cursor-pointer"
                  >
                    {ACADEMIC_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl} className="bg-[#1C153B] text-white">
                        {lvl} Level
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Profile CTA (Skip removed as requested) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-emerald-400 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-[0_4px_24px_rgba(236,72,153,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving Profile & Entering CampsNest...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Profile & Enter CampsNest 🚀</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 px-6 text-center text-xs text-text-muted">
        <span>© {new Date().getFullYear()} CampsNest. 100% Student Verified Campus Network.</span>
      </footer>

    </div>
  );
}
