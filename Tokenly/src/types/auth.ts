export type AuthProvider = 'email';

export type AuthUser = {
  id: string;
  email: string;
  provider: AuthProvider;
  created_at: string;
  last_sign_in_at?: string;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: AuthUser;
};

export type AuthMode = "signin" | "signup" | "reset";

export interface VisualPanelProps {
  mode: AuthMode;
}

export interface SignInFormProps {
  onSubmit: (email: string, password: string) => Promise<boolean>;
  onSwitchToSignUp: () => void;
  onSwitchToReset: () => void;
  loading: boolean;
  error: string;
  successMessage: string;
}

export interface SignUpFormProps {
  onSubmit: (email: string, password: string, username: string, fullName: string) => Promise<boolean>;
  onSwitchToSignIn: () => void;
  loading: boolean;
  error: string;
  successMessage: string;
}

export interface ResetPasswordFormProps {
  onSubmit: (email: string) => Promise<boolean>;
  onSwitchToSignIn: () => void;
  loading: boolean;
  error: string;
  successMessage: string;
}
