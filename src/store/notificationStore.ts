import create from "zustand";

export enum NotificationType {
  Success = "success",
  Error = "error",
}

interface INotificationState {
  isShown: boolean;
  message: string | null;
  type: NotificationType | null;
  showNotification: (message: string, type: NotificationType) => void;
  dismissNotification: () => void;
}

export const useNotification = create<INotificationState>()((set) => ({
  isShown: false,
  message: null,
  type: null,
  showNotification: (message: string, type: NotificationType) => {
    set({ isShown: true, message: message, type: type });
  },
  dismissNotification: () => set({ isShown: false, message: null, type: null }),
}));
