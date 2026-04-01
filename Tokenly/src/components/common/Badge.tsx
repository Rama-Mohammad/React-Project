import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export default function Badge({ tone = 'neutral', children }: Props) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
