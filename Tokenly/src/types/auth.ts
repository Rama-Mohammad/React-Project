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