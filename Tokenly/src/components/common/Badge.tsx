import type { BadgeProps } from "../../types/common";

export default function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

