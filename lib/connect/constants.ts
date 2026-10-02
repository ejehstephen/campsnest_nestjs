export interface QuestionOption {
  id: string;
  emoji: string;
  title: string;
  description: string;
  tag: string;
  matchStat?: string;
}

export interface QuestionData {
  step: number;
  totalSteps: number;
  key: string;
  category: string;
  title: string;
  subtitle: string;
  whyAsk: string;
  impactLabel: string;
  impactWeight: string;
  options: QuestionOption[];
}

export interface CompatibilityRadar {
  livingHabits: number;
  musicVibe: number;
  sleepSchedule: number;
  socialEnergy: number;
  communication: number;
}

export interface ConnectMatchProfile {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  avatar: string;
  school: string;
  dept: string;
  level: string;
  bio: string;
  intent: "roommate" | "dating" | "both" | "study";
  matchPercent: number;
  whatsapp: string;
  phone: string;
  verified: boolean;
  location: string;
  interests: string[];
  vibeTags: { icon: string; label: string }[];
  radarBreakdown: CompatibilityRadar;
  icebreaker: string;
  genderPreference?: "male" | "female" | "any";
  datingPrompt?: string;
  budget?: string;
}

export const CONNECT_QUESTIONS: QuestionData[] = [
  {
    step: 1,
    totalSteps: 10,
    key: "intent",
    category: "PRIMARY INTENT & MATCH GOAL",
    title: "What are you primarily looking to find on CampsNest?",
    subtitle: "Select your main connection goal so our AI calibrates the right candidate pool for you.",
    whyAsk: "Defining your objective upfront ensures you only match with students looking for the exact same dynamic — whether that's sharing rent, finding romance, or exam prep.",
    impactLabel: "Algorithm Targeting",
    impactWeight: "Critical 100%",
    options: [
      {
        id: "roommate",
        emoji: "🏡",
        title: "Hostel / Apartment Roommate",
        description: "Co-lease or share a self-contain/room with zero agent drama.",
        tag: "Roommate Match",
        matchStat: "54% of students"
      },
      {
        id: "dating",
        emoji: "💖",
        title: "Campus Dating & Romance",
        description: "Looking for genuine connection, romantic sparks & campus dates.",
        tag: "Campus Romance",
        matchStat: "28% of students"
      },
      {
        id: "both",
        emoji: "✨",
        title: "Both (Roommate & Campus Dating)",
        description: "Open to exploring compatible roomies and romantic campus connections.",
        tag: "Dual Match",
        matchStat: "12% of students"
      },
      {
        id: "study",
        emoji: "📚",
        title: "Study & Accountability Partner",
        description: "Exam prep, coding sprints, library partner & project synergy.",
        tag: "Study Buddy",
        matchStat: "6% of students"
      }
    ]
  },
  {
    step: 2,
    totalSteps: 10,
    key: "sleep_schedule",
    category: "CIRCADIAN RHYTHM & SLEEP",
    title: "What is your authentic sleep & night schedule?",
    subtitle: "Matching sleep windows prevents 80% of late-night roommate and partner friction.",
    whyAsk: "Night owls and early birds living together without clear boundaries often disturb each other's sleep cycles with alarms or late lights.",
    impactLabel: "Sleep Rhythm Alignment",
    impactWeight: "High 90%",
    options: [
      {
        id: "night_owl",
        emoji: "🦉",
        title: "Night Owl (1:00 AM - 4:00 AM)",
        description: "Peak creativity and energy after midnight when the hostel goes quiet.",
        tag: "Night Owl"
      },
      {
        id: "early_bird",
        emoji: "🌅",
        title: "Early Riser (5:00 AM - 7:00 AM)",
        description: "Early morning workouts, devotions & first to 8:00 AM lectures.",
        tag: "Early Bird"
      },
      {
        id: "standard",
        emoji: "⏰",
        title: "Standard Schedule (11:00 PM - 7:00 AM)",
        description: "Balanced routine, regular bedtime & steady daily rhythm.",
        tag: "Balanced Sleeper"
      },
      {
        id: "flexible",
        emoji: "💤",
        title: "Flexible / Heavy Sleeper",
        description: "Can sleep through noise and adapt to any schedule easily.",
        tag: "Flexible Sleeper"
      }
    ]
  },
  {
    step: 3,
    totalSteps: 10,
    key: "study_noise",
    category: "FOCUS & NOISE TOLERANCE",
    title: "How do you prefer your study & living space atmosphere?",
    subtitle: "Calibrates noise levels and focus habits during academic semesters.",
    whyAsk: "Some students need pin-drop silence to retain complex concepts, while others thrive with soft background music or collaborative talking.",
    impactLabel: "Study Environment Fit",
    impactWeight: "High 85%",
    options: [
      {
        id: "silent",
        emoji: "🤫",
        title: "Pin-Drop Silence Zone",
        description: "Total quiet sanctuary for deep reading, solving past questions & coding.",
        tag: "Quiet Zone"
      },
      {
        id: "lofi",
        emoji: "🎧",
        title: "Soft Lo-Fi / Headphones Vibe",
        description: "Low ambient beats, chill focus tracks & minimal disruptive noise.",
        tag: "Lo-Fi Focus"
      },
      {
        id: "collaborative",
        emoji: "🗣️",
        title: "Lively & Collaborative",
        description: "Group discussions, explaining topics aloud & active study banter.",
        tag: "Collaborative"
      },
      {
        id: "buzz",
        emoji: "☕",
        title: "Ambient Campus Bustle",
        description: "Thrives in common rooms, campus cafeteria & upbeat atmospheres.",
        tag: "Social Energy"
      }
    ]
  },
  {
    step: 4,
    totalSteps: 10,
    key: "cleanliness",
    category: "HYGIENE & CHORES PHILOSOPHY",
    title: "How do you approach cleanliness and hostel chores?",
    subtitle: "Cleanliness mismatch is the #1 reason campus flatmates part ways.",
    whyAsk: "Establishing whether dishes are washed immediately or left for a weekend reset prevents chore resentment.",
    impactLabel: "Living Standards Harmony",
    impactWeight: "Crucial 95%",
    options: [
      {
        id: "neat_freak",
        emoji: "✨",
        title: "Spotless / Neat Freak",
        description: "Daily sweeping, sparkling bathroom & zero dishes in the sink.",
        tag: "Spotless Neat"
      },
      {
        id: "regular",
        emoji: "🧹",
        title: "Organized & Consistent",
        description: "Shared cleaning roster, washed dishes promptly & tidy living room.",
        tag: "Consistent Clean"
      },
      {
        id: "weekend",
        emoji: "🧺",
        title: "Weekend Reset Routine",
        description: "Busy with lectures weekdays; full deep clean on Saturday mornings.",
        tag: "Weekend Reset"
      },
      {
        id: "chill",
        emoji: "🛋️",
        title: "Chill & Relaxed Attitude",
        description: "Not stressed by minor clutter, cleans when necessary.",
        tag: "Laid-back"
      }
    ]
  },
  {
    step: 5,
    totalSteps: 10,
    key: "guests",
    category: "VISITORS & SOCIAL ACCESS",
    title: "What is your stance on visitors, friends & dates over?",
    subtitle: "Defines boundaries for visitors, sleepovers and hosting.",
    whyAsk: "Aligning on whether friends or romantic partners can stay over keeps personal privacy and security intact.",
    impactLabel: "Hostel Privacy Index",
    impactWeight: "High 88%",
    options: [
      {
        id: "hub",
        emoji: "🎉",
        title: "Social Hub / Friends Welcome",
        description: "Coursemates, friends & group chillouts frequently welcome.",
        tag: "Open Social Hub"
      },
      {
        id: "dates",
        emoji: "💖",
        title: "Dates & Partners Welcome",
        description: "Romantic partner visits and sleepovers fine with mutual heads-up.",
        tag: "Date Friendly"
      },
      {
        id: "quiet_guests",
        emoji: "👥",
        title: "Occasional Quiet Day Guests",
        description: "Daytime study partners fine, but quiet nights and no random parties.",
        tag: "Moderate Guests"
      },
      {
        id: "private",
        emoji: "🔒",
        title: "Private Sanctuary",
        description: "Strictly minimal to no outside guests; hostel is for personal rest.",
        tag: "Strict Privacy"
      }
    ]
  },
  {
    step: 6,
    totalSteps: 10,
    key: "music_vibe",
    category: "MUSIC & SOUNDTRACK TASTE",
    title: "What genre dominates your daily campus playlist?",
    subtitle: "Shared musical taste builds instant bonding and great energy.",
    whyAsk: "Music sets the tone for cooking, studying, getting ready for classes and hosting campus dates.",
    impactLabel: "Audio Chemistry",
    impactWeight: "Medium 75%",
    options: [
      {
        id: "afrobeats",
        emoji: "🔥",
        title: "Afrobeats, Amapiano & Asake",
        description: "Burna Boy, Rema, Shallipopi & energetic weekend vibes.",
        tag: "Afrobeats & Drill"
      },
      {
        id: "rnb_soul",
        emoji: "🌙",
        title: "R&B, Soul & Chill Lo-Fi",
        description: "SZA, Brent Faiyaz, Drake, Tems & midnight study sessions.",
        tag: "R&B & Soul"
      },
      {
        id: "hiphop_drill",
        emoji: "🎙️",
        title: "Hip-Hop, Trap & US Drill",
        description: "Travis Scott, Gunna, J. Cole, Kendrick & gym motivation.",
        tag: "Hip-Hop & Trap"
      },
      {
        id: "gospel_acoustic",
        emoji: "🕊️",
        title: "Gospel, Acoustic & Classical",
        description: "Moses Bliss, Elevation Worship, acoustic guitars & peace.",
        tag: "Gospel & Peace"
      }
    ]
  },
  {
    step: 7,
    totalSteps: 10,
    key: "food_habits",
    category: "KITCHEN & MEAL CULTURE",
    title: "How do you handle cooking, groceries & meals?",
    subtitle: "Clarifies food sharing, private cooking, and dining routines.",
    whyAsk: "Sharing cooking gas and groceries saves money for roommates, while dating matches bond over cooking together.",
    impactLabel: "Kitchen Compatibility",
    impactWeight: "Medium 70%",
    options: [
      {
        id: "share_cook",
        emoji: "🍲",
        title: "Love Cooking & Sharing Meals",
        description: "Pot of Jollof, egusi & shared cooking duty to save costs.",
        tag: "Shared Cooking"
      },
      {
        id: "quick_snack",
        emoji: "🍜",
        title: "Quick Indomie, Eggs & Snacks",
        description: "Fast 10-minute meals, bread, tea and midnight noodles.",
        tag: "Fast Bites"
      },
      {
        id: "cafeteria",
        emoji: "🍔",
        title: "Campus Cafeteria & Fast Food",
        description: "Rarely cook; prefer buying hot meals from campus eateries.",
        tag: "Foodie & Cafeteria"
      },
      {
        id: "cook_solo",
        emoji: "🍳",
        title: "Cook Solo & Separate Groceries",
        description: "Prepare my own specific meals with dedicated food items.",
        tag: "Independent Cook"
      }
    ]
  },
  {
    step: 8,
    totalSteps: 10,
    key: "weekend_vibe",
    category: "WEEKEND & CAMPUS LIFE",
    title: "What is your ideal Friday / Saturday evening?",
    subtitle: "Calibrates weekend social frequency and lifestyle overlap.",
    whyAsk: "Whether you want to chill in pajamas or attend campus events determines your weekend energy.",
    impactLabel: "Social Chemistry",
    impactWeight: "High 88%",
    options: [
      {
        id: "movie_night",
        emoji: "🎬",
        title: "Cozy Movie & Anime Marathon",
        description: "Netflix, Indomie popcorn & bingeing shows with roomie/date.",
        tag: "Cozy Movie Night"
      },
      {
        id: "events_party",
        emoji: "🥳",
        title: "Campus Hangouts & Parties",
        description: "Clubbing, SU events, meeting new students & social energy.",
        tag: "Party & Outings"
      },
      {
        id: "skill_grind",
        emoji: "💻",
        title: "Tech & Skill Building Sprint",
        description: "Side projects, design sprints, portfolio work & reading.",
        tag: "Skill Grind"
      },
      {
        id: "church_recharge",
        emoji: "🕊️",
        title: "Rest, Fellowship & Reset",
        description: "Campus fellowship, peaceful recharge & prepping for the week.",
        tag: "Quiet Recharge"
      }
    ]
  },
  {
    step: 9,
    totalSteps: 10,
    key: "dating_style",
    category: "ROMANCE & DATING PHILOSOPHY",
    title: "If looking for a campus date, what is your vibe style?",
    subtitle: "For romantic matches: defines what makes you feel connected.",
    whyAsk: "Ensures romantic compatibility aligns on communication frequency, date expectations, and mutual emotional maturity.",
    impactLabel: "Romance Resonance",
    impactWeight: "Crucial 92%",
    options: [
      {
        id: "deep_talks",
        emoji: "☕",
        title: "Deep Conversations & Coffee Walks",
        description: "Walking campus roads, late-night calls & sharing life goals.",
        tag: "Deep Talks"
      },
      {
        id: "adventurous",
        emoji: "🍿",
        title: "Spontaneous Dates & Fun Outings",
        description: "Trying new eateries in town, photo shoots & spontaneous fun.",
        tag: "Spontaneous Fun"
      },
      {
        id: "serious_partner",
        emoji: "💍",
        title: "Meaningful Long-Term Partner",
        description: "Monogamous, supportive, emotionally secure power couple.",
        tag: "Serious Romance"
      },
      {
        id: "easygoing",
        emoji: "✨",
        title: "Easygoing / Vibe First",
        description: "Start as great friends, zero pressure & see where chemistry goes.",
        tag: "Chill Chemistry"
      }
    ]
  },
  {
    step: 10,
    totalSteps: 10,
    key: "location_preference",
    category: "CAMPUS PROXIMITY & BUDGET",
    title: "What is your target housing location & budget range?",
    subtitle: "Connects you with matches in your target neighborhood or walking radius.",
    whyAsk: "Ensures that potential roommates are aligned on neighborhood choices, security preferences and rent split capabilities.",
    impactLabel: "Geographic Alignment",
    impactWeight: "High 85%",
    options: [
      {
        id: "close_gate",
        emoji: "🚶‍♂️",
        title: "Walking Distance to Gate (3-6 mins)",
        description: "Greenfield Estate, Annex Library front (₦180k - ₦280k/yr).",
        tag: "Gate Walking"
      },
      {
        id: "lowcost",
        emoji: "🏡",
        title: "Federal Lowcost / Greenfield",
        description: "Spacious compound, stable water & security (₦150k - ₦240k/yr).",
        tag: "Residential Estate"
      },
      {
        id: "annex_town",
        emoji: "📍",
        title: "Wukari Town / Market District",
        description: "Cheaper rent, vibrant town access (₦100k - ₦180k/yr).",
        tag: "Town Living"
      },
      {
        id: "any_safe",
        emoji: "⚡",
        title: "Any Verified Compound with Light/Water",
        description: "Prioritizing borehole water & power over strict location.",
        tag: "Utilities Priority"
      }
    ]
  }
];

export const INITIAL_MATCH_PROFILES: ConnectMatchProfile[] = [];

