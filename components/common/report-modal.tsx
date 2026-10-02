"use client";

import * as React from "react";
import { ShieldAlert, X, CheckCircle2, AlertTriangle, Send } from "lucide-react";

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTitle: string;
  targetType?: "user" | "listing" | "housing" | "message";
}

const REPORT_REASONS = [
  {
    id: "scam",
    title: "Advance Fee Fraud / Payment Scam",
    subtitle: "Host/Seller asking for money before physical inspection or meetup.",
  },
  {
    id: "fake_listing",
    title: "Fake or Misleading Listing",
    subtitle: "Photos, location, or room specs do not match physical lodge.",
  },
  {
    id: "harassment",
    title: "Harassment or Inappropriate Behavior",
    subtitle: "Unwanted harassment, abusive language, or inappropriate content.",
  },
  {
    id: "extortion",
    title: "Unregistered Agent Extortion",
    subtitle: "Host or agent demanding unauthorized additional fees.",
  },
  {
    id: "other",
    title: "Other Safety Concern",
    subtitle: "Any other issue violating student safety rules.",
  },
];

export function ReportModal({
  isOpen,
  onClose,
  targetTitle,
  targetType = "listing",
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = React.useState<string>("scam");
  const [details, setDetails] = React.useState<string>("");
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Modal Container */}
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#141029] border border-white/20 p-5 sm:p-6 space-y-5 shadow-2xl overflow-hidden text-white relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-extrabold text-white">
                Report {targetType === "user" ? "User" : targetType === "housing" ? "Lodge" : "Listing"}
              </h3>
              <p className="text-xs text-text-dim truncate max-w-[240px]">
                Target: <strong className="text-white">{targetTitle}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          /* Confirmation State */
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <div className="h-14 w-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-white">Report Submitted!</h4>
            <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
              Thank you for helping keep CampsNest safe. Our campus moderation team is reviewing this report.
            </p>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Select Reason for Report:
              </label>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedReason === reason.id
                        ? "bg-rose-500/15 border-rose-500/50 text-white"
                        : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-text-secondary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="report_reason"
                      checked={selectedReason === reason.id}
                      onChange={() => setSelectedReason(reason.id)}
                      className="mt-1 accent-rose-500 shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-bold text-white">{reason.title}</div>
                      <div className="text-[11px] text-text-dim leading-snug">{reason.subtitle}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Additional Incident Details (Optional):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe what happened or paste any relevant text..."
                className="w-full rounded-2xl bg-white/[0.04] border border-white/15 p-3 text-xs text-white placeholder:text-text-dim outline-none focus:border-rose-500 transition-all resize-none"
              />
            </div>

            {/* Safety Reminder Box */}
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>CampsNest Rule: Never pay rent or deposit before physical inspection!</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-95 text-xs font-extrabold text-white shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
