import { type ButtonHTMLAttributes, type PropsWithChildren } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: Variant;
  fullWidth?: boolean;
}

export default function Button({ variant = 'primary', fullWidth, className = '', children, ...props }: Props) {
  return (
    <button className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
