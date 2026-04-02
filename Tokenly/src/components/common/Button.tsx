import { type ButtonHTMLAttributes, type PropsWithChildren } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: Variant;
  fullWidth?: boolean;
}

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60";

const variantClass: Record<Variant, string> = {
  primary:
    "border border-transparent bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 text-white hover:brightness-105",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  ghost:
    "border border-white/60 bg-white/75 text-slate-700 backdrop-blur hover:bg-white",
  danger:
    "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100",
};

export default function Button({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  ...props
}: Props) {
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClass} ${variantClass[variant]} ${widthClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
