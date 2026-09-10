import { create } from "zustand";
import { persist } from "zustand/middleware";

import { defaultConfig, migrateConfig, type DockBoxConfig } from "@/lib/configuration";

interface ConfigurationState {
  config: DockBoxConfig;
  applyConfig: (config: unknown) => void;
  updateConfig: (update: (config: DockBoxConfig) => DockBoxConfig) => void;
  resetConfig: () => void;
}

export const useConfigurationStore = create<ConfigurationState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      applyConfig: (config) => set({ config: migrateConfig(config) }),
      updateConfig: (update) => set((state) => ({ config: update(state.config) })),
      resetConfig: () => set({ config: defaultConfig }),
    }),
    {
      name: "mazarine-custom-config",
      partialize: (state) => ({ config: state.config }),
      merge: (persisted, current) => ({
        ...current,
        config: migrateConfig((persisted as { config?: unknown }).config),
      }),
    },
  ),
);
