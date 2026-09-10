import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  defaultConfig,
  readConfigFromUrl,
  type DockBoxConfig,
} from "@/lib/configuration";

interface ConfigurationState {
  config: DockBoxConfig;
  setField: <K extends keyof DockBoxConfig>(
    key: K,
    value: DockBoxConfig[K],
  ) => void;
  applyConfig: (config: Partial<DockBoxConfig>) => void;
  resetConfig: () => void;
  hydrate: (config: Partial<DockBoxConfig>) => void;
}

const hydrateConfig = (incoming?: Partial<DockBoxConfig>): DockBoxConfig => ({
  ...defaultConfig,
  ...(readConfigFromUrl() ?? {}),
  ...(incoming ?? {}),
});

export const useConfigurationStore = create<ConfigurationState>()(
  persist(
    (set) => ({
      config: hydrateConfig(),
      setField: (key, value) =>
        set((state) => ({
          config: { ...state.config, [key]: value },
        })),
      applyConfig: (config) =>
        set((state) => ({
          config: { ...state.config, ...config },
        })),
      resetConfig: () =>
        set(() => ({
          config: defaultConfig,
        })),
      hydrate: (config) =>
        set(() => ({
          config: hydrateConfig(config),
        })),
    }),
    {
      name: "mazarine-custom-config",
      partialize: (state) => ({ config: state.config }),
    },
  ),
);
