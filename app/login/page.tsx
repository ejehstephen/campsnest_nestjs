"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { signInAction } from "@/lib/auth/actions";
import { BrandLogo } from "@/components/common/brand-logo";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("password", password);

      const res = await signInAction(formData);

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      // Success -> Redirect to Home Feed
      router.push("/home");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-midnight text-white flex flex-col justify-between selection:bg-brand-magenta/30 selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-brand-violet/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] rounded-full bg-brand-magenta/10 blur-[150px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 w-full px-6 lg:px-16 py-6 flex items-center justify-between">
        <BrandLogo size="md" href="/" />


        <Link
          href="/signup"
          className="text-xs sm:text-sm font-semibold text-text-secondary hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <span>Need an account?</span>
          <span className="text-brand-violet-light font-bold hover:underline">Sign Up</span>
        </Link>
      </header>

      {/* Main Form Center Card */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#141122] border border-white/10 shadow-2xl space-y-6">
          
          {/* Header Title */}
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Sign in to manage housing, marketplace deals, and roommate matches.
            </p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary block">
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
                  className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-4 text-xs font-medium text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary block">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-brand-violet-light hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 pl-10 pr-11 text-xs font-medium text-white placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="h-4 w-4 rounded bg-white/[0.06] border-white/20 accent-brand-violet cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-text-muted cursor-pointer select-none">
                Keep me signed in on this device
              </label>
            </div>

            {/* Submit CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-brand-violet hover:bg-brand-violet/90 text-white text-xs sm:text-sm font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to CampsNest</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Switcher (For local preview / testing) */}
          {/* <div className="pt-4 border-t border-white/10 text-center">
            <Link
              href="/home"
              className="text-[11px] font-semibold text-text-dim hover:text-white flex items-center justify-center gap-1 transition-colors"
            >
              <span>Preview Demo Student Hub →</span>
            </Link>
          </div> */}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 px-6 text-center text-xs text-text-muted">
        <span>© {new Date().getFullYear()} CampsNest. 100% Student Verified Campus Network.</span>
      </footer>

    </div>
  );
}
