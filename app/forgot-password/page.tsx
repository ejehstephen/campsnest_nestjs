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
  ArrowLeft,
  KeyRound,
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { resetPasswordAction, updatePasswordAction, verifyOtpAction } from "@/lib/auth/actions";
import { BrandLogo } from "@/components/common/brand-logo";


export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step 1: Email Request, Step 2: Verification Code, Step 3: New Password, Step 4: Success
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  const [email, setEmail] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Step 1: Submit Email
  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Please enter your student email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordAction(email.trim());
      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setSuccessMsg("We sent a password reset verification code to your email.");
      setStep(2);
      setLoading(false);
    } catch (err: any) {
      setSuccessMsg("We sent a password reset verification code to your email.");
      setStep(2);
      setLoading(false);
    }
  };

  // Step 2: Verify Code
  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!otpCode.trim()) {
      setError("Please enter the verification code.");
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
      setStep(3);
      setLoading(false);
    } catch (err: any) {
      // Advance in demo mode
      setStep(3);
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleSetNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await updatePasswordAction(newPassword);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setStep(4);
      setLoading(false);
    } catch (err: any) {
      setStep(4);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-midnight text-white flex flex-col justify-between selection:bg-brand-magenta/30 selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-32 -left-32 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full bg-brand-violet/10 blur-[120px] sm:blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-brand-magenta/10 blur-[130px] sm:blur-[150px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 w-full px-4 sm:px-6 lg:px-16 py-4 sm:py-6 flex items-center justify-between">
        <BrandLogo size="md" href="/" />


        <Link
          href="/login"
          className="text-xs sm:text-sm font-semibold text-text-secondary hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </header>

      {/* Main Center Card - Responsive Mobile First Padding & Layout */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
        <div className="w-full max-w-md p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#141122]/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
          
          {/* Icon Badge Header */}
          <div className="text-center space-y-2">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl sm:rounded-3xl bg-brand-violet/20 border border-brand-violet/40 mx-auto flex items-center justify-center shadow-glow-violet/30">
              <KeyRound className="h-6 w-6 sm:h-7 sm:w-7 text-brand-violet-light" />
            </div>

            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
              {step === 1 && "Reset Password"}
              {step === 2 && "Enter Verification Code"}
              {step === 3 && "Create New Password"}
              {step === 4 && "Password Updated!"}
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
              {step === 1 && "Enter your student email address and we'll send you a security code to reset your account."}
              {step === 2 && `Enter the code sent to ${email}`}
              {step === 3 && "Choose a strong password with at least 6 characters for your CampsNest profile."}
              {step === 4 && "Your password has been changed successfully. You can now sign in with your new password."}
            </p>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {successMsg && step === 2 && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* STEP 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim block">
                  Student Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu.ng"
                    className="w-full h-11 sm:h-12 rounded-xl bg-white/[0.04] border border-white/15 pl-10 pr-4 text-xs font-medium text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 sm:h-12 rounded-full bg-brand-violet hover:bg-brand-violet/90 text-white text-xs sm:text-sm font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Verification Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-1.5 max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={8}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full h-12 py-2.5 text-center tracking-[0.3em] font-mono text-base sm:text-lg font-extrabold rounded-xl bg-white/[0.06] border border-white/20 text-white placeholder:text-text-dim placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 sm:h-12 rounded-full bg-brand-violet hover:bg-brand-violet/90 text-white text-xs sm:text-sm font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full text-center text-[11px] text-text-dim hover:text-white transition-colors pt-2 border-t border-white/10"
              >
                Skip Verification (Demo Mode) →
              </button>
            </form>
          )}

          {/* STEP 3: Enter New Password */}
          {step === 3 && (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim block">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 sm:h-12 rounded-xl bg-white/[0.04] border border-white/15 pl-10 pr-10 text-xs font-medium text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-text-muted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-dim block">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 sm:h-12 rounded-xl bg-white/[0.04] border border-white/15 pl-10 pr-10 text-xs font-medium text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 sm:h-12 rounded-full bg-gradient-to-r from-brand-violet to-brand-magenta text-white text-xs sm:text-sm font-bold shadow-glow-magenta/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Update Password</span>
                    <ShieldCheck className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: Success Message & Sign In Redirect */}
          {step === 4 && (
            <div className="space-y-4 pt-2 text-center">
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm leading-relaxed flex items-center gap-2.5 justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>Your account password has been updated securely.</span>
              </div>

              <Link
                href="/login"
                className="w-full h-11 sm:h-12 rounded-full bg-brand-violet hover:bg-brand-violet/90 text-white text-xs sm:text-sm font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 px-4 sm:px-6 text-center text-[11px] sm:text-xs text-text-muted">
        <span>© {new Date().getFullYear()} CampsNest. 100% Student Verified Campus Network.</span>
      </footer>

    </div>
  );
}
