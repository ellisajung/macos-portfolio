import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type WindowKey = keyof typeof WINDOW_CONFIG;

type WindowState = {
  windows: {
    [K in WindowKey]: {
      isOpen: boolean;
      zIndex: number;
      data: unknown;
    };
  };
  nextZIndex: number;
  openWindow: (windowKey: WindowKey, data?: unknown) => void;
  closeWindow: (windowKey: WindowKey) => void;
  focusWindow: (windowKey: WindowKey) => void;
};

const useWindowStore = create<WindowState>()(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey: WindowKey, data?: unknown) =>
      set((state) => {
        const win = state.windows[windowKey];

        win.isOpen = true;
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        state.nextZIndex++;
      }),

    closeWindow: (windowKey: WindowKey) =>
      set((state) => {
        const win = state.windows[windowKey];

        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
      }),

    focusWindow: (windowKey: WindowKey) =>
      set((state) => {
        const win = state.windows[windowKey];

        win.zIndex = state.nextZIndex++;
      })
  }))
);

export default useWindowStore;
