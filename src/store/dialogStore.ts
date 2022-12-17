import create from "zustand";

export interface IDialog {
  title: string;
  subTitle: string;
  mainActionTitle: string;
  sideActionTitle?: string;
  onMainActionClick?: () => void;
  onSideActionClick?: () => void;
  onDismiss?: () => void;
}

interface IDialogState {
  isDialogShown: boolean;
  dialog: IDialog | null;
  showDialog: () => void;
  dismissDialog: () => void;
  setDialog: (dialog: IDialog) => void;
}

export const useDialog = create<IDialogState>()((set) => ({
  isDialogShown: false,
  dialog: null,
  showDialog: () => set({ isDialogShown: true }),
  dismissDialog: () => set({ isDialogShown: false }),
  setDialog: (dialog) => set({ dialog: dialog }),
}));
