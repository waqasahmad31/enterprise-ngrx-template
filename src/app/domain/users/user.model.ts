export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAtIso: string;
}

export type UserCreate = Omit<User, 'id' | 'createdAtIso'>;
export type UserUpdate = Partial<UserCreate>;
