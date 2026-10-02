"use client";

import * as React from "react";
import { 
  X, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Zap, 
  ShieldCheck, 
  Lightbulb, 
  Users, 
  Moon, 
  Headphones, 
  Lock, 
  Heart, 
  Building2, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { CONNECT_QUESTIONS, QuestionData } from "@/lib/connect/constants";
import { saveQuestionnaireAnswersAction } from "@/lib/connect/actions";
import { useAuth } from "@/lib/auth/auth-provider";

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (answers: Record<string, string>) => void;
}

export function QuestionnaireModal({ isOpen, onClose, onCompleted }: QuestionnaireModalProps) {
  const { profile } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({
    intent: "both",
    sleep_schedule: "night_owl",
    study_noise: "lofi",
    cleanliness: "neat_freak",
    guests: "dates",
    music_vibe: "afrobeats",
    food_habits: "share_cook",
    weekend_vibe: "movie_night",
    dating_style: "deep_talks",
    location_preference: "close_gate"
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCalibrated, setIsCalibrated] = React.useState(false);

  // Load existing answers from localStorage if available
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("campsnest_questionnaire_answers");
        if (saved) {
          setAnswers((prev) => ({ ...prev, ...JSON.parse(saved) }));
        }
      } catch (e) {
        console.warn("Could not load questionnaire answers:", e);
      }
    }
  }, []);

  if (!isOpen) return null;

  const currentQuestion = CONNECT_QUESTIONS[currentStepIndex];
  const selectedOptionId = answers[currentQuestion.key] || currentQuestion.options[0].id;
  const progressPercent = Math.round(((currentStepIndex + 1) / CONNECT_QUESTIONS.length) * 100);

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.key]: optionId
    }));
  };

  const handleNext = () => {
    if (currentStepIndex < CONNECT_QUESTIONS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);

    // Save to LocalStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("campsnest_questionnaire_answers", JSON.stringify(answers));
        localStorage.setItem("campsnest_vibe_calibrated", "true");
      } catch (e) {
        console.warn("Could not write to localStorage:", e);
      }
    }

    // Sync to Supabase
    try {
      await saveQuestionnaireAnswersAction({
        userId: profile?.id,
        answers,
        primaryIntent: answers.intent
      });
    } catch (e) {
      console.warn("Sync error:", e);
    }

    // Show calibration success screen
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCalibrated(true);
      if (onCompleted) {
        onCompleted(answers);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-[32px] sm:rounded-[36px] bg-[#120E24] border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden text-white mb-0 sm:mb-auto">
        
        {/* Top Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#8B5CF6]/20 via-[#EC4899]/20 to-transparent blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-10 px-5 sm:px-8 pt-5 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30 uppercase tracking-wider">
                  QUESTION {currentStepIndex + 1} OF {CONNECT_QUESTIONS.length}
                </span>
                <span className="text-text-dim text-xs">•</span>
                <span className="text-xs font-bold text-[#FFB0CD]">
                  {currentQuestion.category}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-white">
                Lifestyle, Vibe & Compatibility Calibration
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="relative z-10 px-5 sm:px-8 pt-3 pb-1 space-y-1.5 bg-white/[0.01]">
          <div className="flex items-center justify-between text-[11px] font-bold text-text-dim">
            <span>Progress: {progressPercent}% Calibrated</span>
            <span className="text-brand-magenta-light">{CONNECT_QUESTIONS.length - currentStepIndex - 1} questions remaining</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-emerald-400 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Calibration Success Screen */}
        {isCalibrated ? (
          <div className="relative z-10 flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-emerald-400 flex items-center justify-center text-4xl shadow-glow-magenta/50 animate-bounce">
              ✨
            </div>
            
            <div className="space-y-2 max-w-md">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                CALIBRATION COMPLETE
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                Vibe Radar Unlocked! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Your 10-point living & dating chemistry profile is now active. We've calculated match affinity scores with verified Federal University Wukari candidates.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#9D74FF] hover:to-[#F472B6] text-white text-xs sm:text-sm font-bold shadow-[0_4px_24px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              Explore My Match Candidates 🚀
            </button>
          </div>
        ) : (
          /* Main Question Body & Dynamic Sidebar */
          <div className="relative z-10 flex-1 overflow-y-auto p-5 sm:p-8 no-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT 8 COLUMNS: Question & 4 Interactive Choices */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Question Headline */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] font-extrabold text-brand-magenta tracking-wider uppercase">
                  <Zap className="h-3.5 w-3.5 text-brand-magenta" />
                  <span>{currentQuestion.category}</span>
                </div>

                <h1 className="text-lg sm:text-2xl font-heading font-extrabold text-white tracking-tight leading-snug">
                  {currentQuestion.title}
                </h1>

                <p className="text-xs text-text-muted leading-relaxed font-normal">
                  {currentQuestion.subtitle}
                </p>
              </div>

              {/* 4 Interactive Choice Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 group relative select-none ${
                        isSelected
                          ? "bg-[#211A3E] border-[#EC4899] ring-2 ring-[#EC4899]/50 shadow-[0_4px_20px_rgba(236,72,153,0.25)] scale-[1.01]"
                          : "bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="h-10 w-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-xl shrink-0">
                          {opt.emoji}
                        </div>

                        <div className="shrink-0">
                          {isSelected ? (
                            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white shadow-md">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="h-5 w-5 rounded-full border border-white/20" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xs sm:text-sm font-bold text-white">
                          {opt.title}
                        </h3>
                        <p className="text-[11px] text-text-muted leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      {opt.matchStat && (
                        <div className="pt-1 text-[10px] font-semibold text-[#FFB0CD]">
                          🔥 {opt.matchStat}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT 4 COLUMNS: Why We Ask This & Live Vibe Traits */}
            <div className="hidden lg:block lg:col-span-4 space-y-4">
              
              {/* Why We Ask Card */}
              <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-brand-violet-light" />
                  <h3 className="text-xs font-heading font-extrabold text-white uppercase tracking-wider">
                    Why We Ask This
                  </h3>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {currentQuestion.whyAsk}
                </p>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-text-dim">{currentQuestion.impactLabel}</span>
                    <span className="text-brand-magenta-light">{currentQuestion.impactWeight}</span>
                  </div>
                </div>
              </div>

              {/* Zero Judgment Privacy Note */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Zero-Judgment Privacy</span>
                </div>
                <p className="text-[10px] text-text-dim leading-relaxed">
                  Your individual responses remain strictly confidential. Only aggregated synergy percentages and match tags are displayed on your profile.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Bottom Navigation Footer */}
        {!isCalibrated && (
          <div className="relative z-10 px-5 sm:px-8 py-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-emerald-400 text-white text-xs sm:text-sm font-bold shadow-[0_4px_20px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Calibrating Vibe Radar...</span>
                  </>
                ) : currentStepIndex === CONNECT_QUESTIONS.length - 1 ? (
                  <>
                    <span>Finish & Calculate Matches ✨</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Next Question</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
