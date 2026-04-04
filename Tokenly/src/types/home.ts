export type SkillName =
  | "Programming"
  | "Design"
  | "Math & Science"
  | "Languages"
  | "Finance"
  | "Music"
  | "Writing"
  | "Career & Biz"
  | "Photography"
  | "Marketing"
  | "Data Science"
  | "Public Speaking";

export type HomeSkillCardProps = {
  name: SkillName;
  count: number | string;
};

export type StepKey = "01" | "02" | "03" | "04";

export type StepCardProps = {
  step: StepKey;
  title: string;
  description: string;
};

export type TestimonialCardProps = {
  quote: string;
  name: string;
  title: string;
  rating: number;
};
