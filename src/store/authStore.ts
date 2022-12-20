import { delay } from "q";
import create from "zustand";

interface IAuth {
  token: string | null;
  isLogging: boolean;
  fetchUser: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<IAuth>()((set) => ({
  token: null,
  isLogging: true,
  fetchUser: async () => {
    // api request with token
    await delay(1000);
    set({ token: "token", isLogging: false });
  },
  login: async (username, password) => {
    set({ isLogging: true });
    // api request

    // if success
    set({ token: "someToken", isLogging: false });

    // if error
    set({ isLogging: false });
  },
  logout: () => {
    set({ token: null });
  },
}));
