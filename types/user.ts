export interface UserProfile {
  id?: string;
  full_name?: string;
  education_level: string;
  interests: string[];
  career_goal?: string;
  created_at?: string;
}

export interface UserSkill {
  id?: string;
  user_id?: string;
  skill_name: string;
  proficiency_level?: string;
  created_at?: string;
}

export interface CareerDiscoveryInput {
  name?: string;
  education: string;
  skills: string[];
  interests: string[];
  goal?: string;
}
