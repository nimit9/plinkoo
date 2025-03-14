import { IUser } from '@repo/common/types';
import { create } from 'zustand';
import { getStoredUser, setStoredUser } from '../utils/storage';

export interface AuthState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  isAuthenticated: false,
  setUser: (user) => {
    setStoredUser(user);
    set({ user });
  },
}));

export const getAuthState = () => {
  const state = useAuthStore.getState();
  return { user: state.user };
};
