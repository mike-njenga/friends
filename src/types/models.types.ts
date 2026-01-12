export type UserRole = 'admin' | 'user';
export  type UUID = string
export interface Profile {
  id: UUID; // UUIDs are strings in JS
  email: string;
  username: string;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface CreateUserProfileInput {
  id: UUID;
  email: string;
  username: string;
  role: UserRole;
  phone?: string | null;
  is_active?: boolean;
}

export interface Friend {
  id: UUID;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFriendInput {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateFriendInput {
  name: string;
  email: string;
  phone: string;
}
