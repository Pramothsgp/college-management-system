
export type Role = 'admin' | 'staff' | 'student' | null;

export interface AuthContextType {
  role: Role;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
}

export interface DecodedJWT {
  id: string;
  role: Role;
  iat?: number;
  exp?: number;
}