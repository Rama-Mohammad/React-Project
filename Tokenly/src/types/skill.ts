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