interface Props {
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatsCard({ label, value, hint }: Props) {
  return (
    <article className='card stats-card'>
      <p className='muted'>{label}</p>
      <h3>{value}</h3>
      {hint && <small>{hint}</small>}
    </article>
  );
}
