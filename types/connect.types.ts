export interface QuestionnaireQuestion {
  id: string;
  question: string;
  category?: string;
  type: "single" | "multiple" | "range";
  icon?: string;
  options: string[];
  sort_order?: number;
}

export interface ConnectMatch {
  id: string;
  name: string;
  profile_image?: string;
  age: number;
  school: string;
  department?: string;
  gender: string;
  budget?: number;
  compatibility_score: number;
  common_interests: string[];
  bio?: string;
}
