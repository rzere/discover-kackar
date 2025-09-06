export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}