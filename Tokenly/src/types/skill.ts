export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillCategory =
  | 'Programming'
  | 'Mathematics'
  | 'Machine Learning'
  | 'Data Science'
  | 'Web Development'
  | 'Algorithms'
  | 'System Design'
  | 'Database'
  | 'Statistics'
  | 'Writing'
  | 'Other';

export type Skill = {
  id: string;
  user_id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description?: string;
  sessions_count: number;
  created_at: string;
};

export type SkillInput = {
  user_id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description?: string;
};

export type SkillUpdateInput = {
  name?: string;
  category?: SkillCategory;
  level?: SkillLevel;
  description?: string;
};

export type UseSkillsResult = {
  skills: Skill[];
  loading: boolean;
  error: string;
  fetchSkillsByUser: (user_id: string) => Promise<void>;
  addSkill: (data: SkillInput) => Promise<boolean>;
  editSkill: (id: string, updates: SkillUpdateInput) => Promise<boolean>;
  removeSkill: (id: string) => Promise<boolean>;
};

