import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";

export interface BadgeProps extends PropsWithChildren {
  tone?: "neutral" | "success" | "warning" | "danger";
}

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "user" | "admin";
}

export interface RatingStarsProps {
  value: number;
}

export type CountUpProps = {
  end: number;
  start: boolean;
};

export type StatCardProps = {
  icon: IconDefinition;
  number: string;
  label: string;
};
