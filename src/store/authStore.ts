import create from "zustand";

interface IAuth {
  token: string | null;
}

export const useAuth = create<IAuth>()((set) => ({
  token: null,
  login: async () => {},
  logout: () => {},
}));
