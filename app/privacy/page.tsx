"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  Database, 
  UserCheck, 
  Mail, 
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = React.useState("collection");

  const lastUpdated = "September 25, 2026";

  const sections = [
    { id: "overview", label: "1. Overview & Scope" },
    { id: "collection", label: "2. Information We Collect" },
    { id: "usage", label: "3. How We Use Your Data" },
    { id: "connect-matching", label: "4. Connect & Questionnaire Privacy" },
    { id: "housing-market", label: "5. Housing & Marketplace Data" },
    { id: "data-sharing", label: "6. Data Sharing & Disclosure" },
    { id: "storage-security", label: "7. Media Compression & Security" },
    { id: "your-rights", label: "8. Your Rights & Data Deletion" },
    { id: "contact", label: "9. Contact & Data Protection Officer" },
  ];

  return (
    <AppShell>
      <div className="min-h-screen pb-24 text-slate-100">
        {/* Header Hero */}
        <div className="relative border-b border-white/10 bg-gradient-to-b from-[#1E1035] via-[#0F0B1E] to-[#0A0D14] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to CampsNest
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                NDPR & Campus Privacy Compliant
              </span>
              <span className="text-xs text-slate-400">Last updated: {lastUpdated}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              CampsNest Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              We are dedicated to safeguarding the personal data of university students, landlords, and campus creators using the CampsNest superapp ecosystem across Nigerian universities.
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Table of Contents Sticky Sidebar */}
            <aside className="md:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#121622]/80 backdrop-blur-xl p-4 shadow-xl">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                  Table of Contents
                </h2>
                <nav className="space-y-1">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={() => setActiveSection(sec.id)}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                        activeSection === sec.id
                          ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      }`}
                    >
                      <span>{sec.label}</span>
                      <ChevronRight className="h-3 w-3 opacity-60" />
                    </a>
                  ))}
                </nav>

                <div className="mt-6 pt-4 border-t border-white/10 px-2 text-xs text-slate-400">
                  <p className="font-semibold text-white mb-1">Need Data Assistance?</p>
                  <p className="text-[11px] mb-2 text-slate-400 leading-relaxed">
                    Request an export or delete your profile data at any time.
                  </p>
                  <a
                    href="mailto:privacy@campsnest.com"
                    className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-xs font-medium"
                  >
                    <Mail className="h-3.5 w-3.5" /> privacy@campsnest.com
                  </a>
                </div>
              </div>
            </aside>

            {/* Document Body */}
            <main className="md:col-span-8 space-y-10 text-sm leading-relaxed text-slate-300">
              
              {/* 1. Overview */}
              <section id="overview" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  1. Overview & Scope
                </h2>
                <p className="mb-3">
                  CampsNest (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the CampsNest 2.0 web and mobile application designed specifically for higher education students, accredited agents, and campus verified vendors.
                </p>
                <p>
                  This Privacy Policy applies to all services provided under the CampsNest platform, including student housing discovery, peer-to-peer campus marketplace, and our Connect roommate & dating lifestyle affinity matching engine.
                </p>
              </section>

              {/* 2. Information We Collect */}
              <section id="collection" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-400" />
                  2. Information We Collect
                </h2>
                <p className="mb-3">To deliver authentic and safe campus services, we collect:</p>
                <ul className="space-y-2 list-disc list-inside text-slate-300">
                  <li><strong className="text-white">Account & Profile Information:</strong> Name, institutional university email (e.g., @fuwukari.edu.ng) or personal email, phone number, gender, academic level (e.g., 300L), department, faculty, and student identification documents.</li>
                  <li><strong className="text-white">Connect Matching Preferences:</strong> Answers to the 10-step lifestyle questionnaire (sleep habits, quiet study hours, cleanliness standards, social habits, musical tastes, and dating preferences).</li>
                  <li><strong className="text-white">Housing Listings & Inspection Requests:</strong> Property photos, video walkthroughs, physical addresses, rental pricing, and scheduled inspection appointment timestamps.</li>
                  <li><strong className="text-white">Marketplace Transactions:</strong> Item photos, descriptions, asking prices, condition ratings, and campus meetup zones.</li>
                  <li><strong className="text-white">Communications:</strong> In-app messages, safety reports, and support requests.</li>
                </ul>
              </section>

              {/* 3. How We Use Your Data */}
              <section id="usage" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-400" />
                  3. How We Use Your Data
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-1 shrink-0" />
                    <p><strong className="text-white">Campus Identity Verification:</strong> Preventing scammers and ghost listings by verifying legitimate student and landlord identities.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-1 shrink-0" />
                    <p><strong className="text-white">Affinity Calculation:</strong> Computing privacy-preserving compatibility scores for potential roommates and dating connections.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-1 shrink-0" />
                    <p><strong className="text-white">Inspection Safeguarding:</strong> Notifying landlords and students of approved physical inspection appointments without exposing private residential phone numbers until verified.</p>
                  </div>
                </div>
              </section>

              {/* 4. Connect & Questionnaire Privacy */}
              <section id="connect-matching" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-pink-400" />
                  4. Connect & Questionnaire Privacy
                </h2>
                <p className="mb-3">
                  Your safety and privacy in Connect are our highest priority:
                </p>
                <div className="rounded-xl bg-purple-950/30 border border-purple-500/20 p-4 mb-3 space-y-2 text-xs">
                  <p className="text-purple-200 font-semibold">🔒 Zero Automatic Phone Number Exposure</p>
                  <p className="text-slate-300 leading-relaxed">
                    Your WhatsApp or private phone number is never shown publicly to match candidates. All initial interactions occur strictly through CampsNest In-App Chat.
                  </p>
                </div>
                <p className="text-xs text-slate-400">
                  Questionnaire answers are utilized strictly to calculate match percentages (e.g. 92% Match) and display non-sensitive preference tags (e.g. &quot;Night Owl 🌙&quot;, &quot;Quiet Studies 📚&quot;).
                </p>
              </section>

              {/* 5. Housing & Marketplace Data */}
              <section id="housing-market" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-400" />
                  5. Housing & Marketplace Data
                </h2>
                <p className="mb-2">
                  When you publish an accommodation or marketplace listing:
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-300">
                  <li>Listing details (title, price, photos, campus zone) are public to verified students.</li>
                  <li>Precise lodge room numbers are kept confidential until an inspection is formally booked.</li>
                  <li>Marketplace items are automatically labeled with student seller verification status.</li>
                </ul>
              </section>

              {/* 6. Data Sharing */}
              <section id="data-sharing" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-400" />
                  6. Data Sharing & Disclosure
                </h2>
                <p className="mb-2 font-medium text-white">We NEVER sell your personal data to third-party advertisers or data brokers.</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Data is only shared with infrastructure service providers (e.g., Supabase for encrypted cloud storage, transactional email providers for OTP verification) under strict non-disclosure obligations, or when required by Nigerian law enforcement in verified anti-fraud investigations.
                </p>
              </section>

              {/* 7. Media Compression & Security */}
              <section id="storage-security" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  7. Media Compression & Storage Security
                </h2>
                <p className="mb-3 text-xs leading-relaxed">
                  All user-uploaded accommodation photos, marketplace products, and profile avatars undergo client-side WebP compression to minimize student mobile data consumption and server storage footprint. All data in transit and at rest is secured via TLS 1.3 encryption.
                </p>
              </section>

              {/* 8. Your Rights */}
              <section id="your-rights" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-400" />
                  8. Your Rights & Data Deletion
                </h2>
                <p className="mb-3 text-xs">Under Nigerian Data Protection Regulation (NDPR), you have the right to:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="font-semibold text-white">Right of Access & Rectification</p>
                    <p className="text-slate-400 mt-1">Review and modify your profile details at any time in Edit Profile.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="font-semibold text-white">Right to Erasure (Be Forgotten)</p>
                    <p className="text-slate-400 mt-1">Request complete deletion of your account, questionnaires, and listings.</p>
                  </div>
                </div>
              </section>

              {/* 9. Contact */}
              <section id="contact" className="scroll-mt-24 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-[#17102C] to-[#121622] p-6">
                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-400" />
                  9. Contact & Data Protection Officer
                </h2>
                <p className="text-xs text-slate-300 mb-3">
                  If you have inquiries, privacy feedback, or wish to exercise your data rights:
                </p>
                <div className="text-xs space-y-1 text-slate-300">
                  <p><strong className="text-white">Email:</strong> privacy@campsnest.com</p>
                  <p><strong className="text-white">Campus Desk:</strong> Federal University Wukari / Partner Universities Hub</p>
                  <p><strong className="text-white">Operational Support:</strong> support@campsnest.com</p>
                </div>
              </section>

            </main>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
