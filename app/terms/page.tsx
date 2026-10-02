"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Scale, 
  ShieldAlert, 
  Home, 
  ShoppingBag, 
  Heart, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  ArrowLeft,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = React.useState("acceptance");

  const lastUpdated = "September 25, 2026";

  const sections = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "eligibility", label: "2. Eligibility & Accounts" },
    { id: "housing-terms", label: "3. Housing & Inspections" },
    { id: "marketplace-terms", label: "4. Marketplace Guidelines" },
    { id: "connect-rules", label: "5. Connect & Social Conduct" },
    { id: "prohibited", label: "6. Prohibited Activities" },
    { id: "fees-payments", label: "7. Fees & Safety Escrows" },
    { id: "liability", label: "8. Disclaimer & Liability" },
    { id: "termination", label: "9. Termination & Law" },
  ];

  return (
    <AppShell>
      <div className="min-h-screen pb-24 text-slate-100">
        {/* Header Hero */}
        <div className="relative border-b border-white/10 bg-gradient-to-b from-[#18112C] via-[#0F0B1E] to-[#0A0D14] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to CampsNest
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                <Scale className="h-3.5 w-3.5" />
                Community Safety & Legal Terms
              </span>
              <span className="text-xs text-slate-400">Last updated: {lastUpdated}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              CampsNest Terms of Service
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              These terms govern your access to and use of CampsNest 2.0. By accessing any part of our student housing, marketplace, or matchmaking services, you agree to comply with these rules.
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
                          ? "bg-pink-600/20 text-pink-300 border border-pink-500/30 font-semibold"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      }`}
                    >
                      <span>{sec.label}</span>
                      <ChevronRight className="h-3 w-3 opacity-60" />
                    </a>
                  ))}
                </nav>

                <div className="mt-6 pt-4 border-t border-white/10 px-2 text-xs text-slate-400">
                  <p className="font-semibold text-white mb-1">Safety First 🛡️</p>
                  <p className="text-[11px] mb-2 text-slate-400 leading-relaxed">
                    Never send rent or gadget payments to any individual without physical verification.
                  </p>
                  <a
                    href="mailto:safety@campsnest.com"
                    className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 text-xs font-medium"
                  >
                    <HelpCircle className="h-3.5 w-3.5" /> Report a Violation
                  </a>
                </div>
              </div>
            </aside>

            {/* Document Body */}
            <main className="md:col-span-8 space-y-10 text-sm leading-relaxed text-slate-300">
              
              {/* 1. Acceptance */}
              <section id="acceptance" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-purple-400" />
                  1. Acceptance of Terms
                </h2>
                <p className="mb-3">
                  By registering an account, browsing listings, booking accommodation inspections, listing items for sale, or submitting Connect lifestyle questionnaires on CampsNest 2.0, you confirm that you have read, understood, and agreed to be bound by these Terms of Service.
                </p>
                <p className="text-xs text-slate-400">
                  If you do not agree with any part of these terms, you must immediately discontinue use of the platform.
                </p>
              </section>

              {/* 2. Eligibility & Accounts */}
              <section id="eligibility" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-purple-400" />
                  2. Eligibility & Account Security
                </h2>
                <ul className="space-y-2 list-disc list-inside text-slate-300 text-xs sm:text-sm">
                  <li><strong className="text-white">Student Status & Age:</strong> You must be at least 16 years of age and an enrolled university student, staff member, or accredited property host.</li>
                  <li><strong className="text-white">Accurate Information:</strong> You agree to provide true, accurate, current academic credentials during signup. Impersonation of another student or administrator results in immediate permanent ban.</li>
                  <li><strong className="text-white">Credentials:</strong> You are solely responsible for maintaining the confidentiality of your account password and OTP codes.</li>
                </ul>
              </section>

              {/* 3. Housing Terms */}
              <section id="housing-terms" className="scroll-mt-24 rounded-2xl border border-purple-500/20 bg-[#17102A]/40 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Home className="h-5 w-5 text-purple-400" />
                  3. Housing & Accommodation Guidelines
                </h2>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                    <p className="font-bold flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                      CRITICAL ANTI-SCAM WARNING FOR STUDENTS:
                    </p>
                    <p className="text-xs text-amber-300/90 leading-relaxed">
                      NEVER transfer full rent money, caution deposit, or agency fees to any landlord or agent before you have physically inspected the apartment in person and verified genuine lodge ownership.
                    </p>
                  </div>
                  <ul className="space-y-2 list-disc list-inside text-slate-300">
                    <li><strong className="text-white">Authentic Listings:</strong> Hosts and agents must only post true, un-doctored photos and accurate video tours of the actual vacant room.</li>
                    <li><strong className="text-white">Inspection Bookings:</strong> Scheduled inspections must occur during reasonable daylight hours (9:00 AM – 6:00 PM).</li>
                  </ul>
                </div>
              </section>

              {/* 4. Marketplace Guidelines */}
              <section id="marketplace-terms" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-emerald-400" />
                  4. Peer-to-Peer Marketplace Guidelines
                </h2>
                <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm text-slate-300">
                  <li><strong className="text-white">Accurate Condition Grading:</strong> Items must be honestly graded according to our standards (&quot;Brand New in Box&quot;, &quot;Like New&quot;, &quot;Gently Used&quot;, or &quot;Fairly Used&quot;).</li>
                  <li><strong className="text-white">Designated Safe Meetup Zones:</strong> All physical exchanges must take place in high-visibility campus areas (e.g., University Library Quad, North Gate Shuttle Park, Faculty Complex).</li>
                  <li><strong className="text-white">Payment on Handover:</strong> Buyers should test gadgets, electronics, and appliances thoroughly on the spot before making final payment to the seller.</li>
                </ul>
              </section>

              {/* 5. Connect & Social Conduct */}
              <section id="connect-rules" className="scroll-mt-24 rounded-2xl border border-pink-500/20 bg-[#1E0F28]/40 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-400" />
                  5. Connect & Social Conduct Rules
                </h2>
                <div className="space-y-3 text-xs sm:text-sm">
                  <p className="text-pink-200">
                    CampsNest Connect is built to foster healthy, safe campus friendships, study partners, roommates, and dating connections.
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-slate-300">
                    <li><strong className="text-white">Zero Tolerance for Harassment:</strong> Bullying, sexually explicit uninvited messages, hate speech, or stalking will trigger an immediate permanent ban and university disciplinary reporting.</li>
                    <li><strong className="text-white">Privacy Protection:</strong> You may not screenshot, republish, or distribute other students&apos; questionnaire answers or photos outside the platform.</li>
                    <li><strong className="text-white">Consensual Communication:</strong> Both parties must agree before moving conversations outside CampsNest In-App Chat.</li>
                  </ul>
                </div>
              </section>

              {/* 6. Prohibited Activities */}
              <section id="prohibited" className="scroll-mt-24 rounded-2xl border border-rose-500/20 bg-[#1F1015]/40 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-400" />
                  6. Prohibited Items & Activities
                </h2>
                <p className="text-xs mb-2">The following are strictly forbidden on CampsNest:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-200">
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/20">❌ Stolen gadgets or counterfeit goods</div>
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/20">❌ Illicit substances, narcotics, or weapons</div>
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/20">❌ Examination malpractice material or leakages</div>
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/20">❌ Advance-fee fraud, Ponzi schemes, or phishing</div>
                </div>
              </section>

              {/* 7. Fees & Escrow */}
              <section id="fees-payments" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-400" />
                  7. Fees & Transaction Policies
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mb-2">
                  Browsing listings and completing the Connect matching questionnaire is completely free for all students.
                </p>
                <p className="text-xs text-slate-400">
                  Nominal inspection booking fees (e.g. ₦1,000) serve to deter time-wasting and compensate verified student tour guides and landlords. All fee structures are clearly displayed before confirmation.
                </p>
              </section>

              {/* 8. Disclaimer & Liability */}
              <section id="liability" className="scroll-mt-24 rounded-2xl border border-white/5 bg-[#121622]/50 p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-purple-400" />
                  8. Limitation of Liability
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  CampsNest acts solely as a technology platform connecting students, landlords, and sellers. While we take verification seriously, CampsNest does not own the accommodation properties or marketplace goods listed by third parties. Users are required to practice reasonable vigilance during physical meetings and monetary transactions.
                </p>
              </section>

              {/* 9. Termination & Governing Law */}
              <section id="termination" className="scroll-mt-24 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-[#17102C] to-[#121622] p-6">
                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-purple-400" />
                  9. Termination & Governing Law
                </h2>
                <p className="text-xs text-slate-300 mb-3">
                  These terms are governed by the laws of the Federal Republic of Nigeria. CampsNest reserves the right to suspend or terminate accounts that breach community safety guidelines without prior notice.
                </p>
                <div className="text-xs text-slate-400">
                  <p>Questions regarding our terms? Contact: <span className="text-purple-300 font-semibold">legal@campsnest.com</span></p>
                </div>
              </section>

            </main>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
