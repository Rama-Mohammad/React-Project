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

export type AuthMode = "signin" | "signup" | "reset" | "newpassword";

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

export type UseAuthResult = {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: string;
  successMessage: string;
  isAuthenticated: boolean;
  isPasswordRecovery: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: { username?: string; full_name?: string }
  ) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (newPassword: string) => Promise<boolean>;
  deleteAccount: (userId: string) => Promise<boolean>;
};
