"use client";

import { useEffect, useMemo, useState } from "react";

import { readConfigFromUrl } from "@/lib/configuration";
import { useConfigurationStore } from "./configuration-store";
import { ConfigurationSummary } from "./configuration-summary";
import { MobileStickyCTA } from "./mobile-sticky-cta";
import { SimplifiedConfigurator } from "./simplified-configurator";
import { ViewPresetButtons } from "./view-preset-buttons";
import type { CameraPreset } from "./camera-controls";

export function ConfiguratorPanel({
  selectedPreset,
  onPresetChange,
}: {
  selectedPreset: CameraPreset;
  onPresetChange: (preset: CameraPreset) => void;
}) {
  const [showSummary, setShowSummary] = useState(false);
  const config = useConfigurationStore((state) => state.config);
  const applyConfig = useConfigurationStore((state) => state.applyConfig);
  const resetConfig = useConfigurationStore((state) => state.resetConfig);
  const updateConfig = useConfigurationStore((state) => state.updateConfig);

  useEffect(() => {
    const urlConfig = readConfigFromUrl();
    if (urlConfig) {
      applyConfig(urlConfig);
    }
  }, [applyConfig]);

  const summaryTitle = useMemo(
    () => [
      "MAZARINE",
      "CUSTOM DOCK BOX BUILDER",
    ].join(" "),
    [],
  );

  const handlePresetChange = (preset: CameraPreset) => {
    onPresetChange(preset);
    if (preset === "interior") {
      updateConfig((current) => ({ ...current, lidOpen: true }));
    }
  };

  return (
    <aside className="config-panel h-full overflow-y-auto bg-[#081a2a]/85 p-4 md:w-[420px] md:border-l md:border-slate-200/10 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.32rem] text-sky-300">MAZARINE</div>
          <h1 className="mt-1 text-xl font-semibold text-white">Custom Dock Box Builder</h1>
        </div>
        <button
          type="button"
          onClick={resetConfig}
          className="rounded-full border border-slate-200/10 bg-slate-900/30 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16rem] text-slate-200 transition hover:border-slate-200/25 hover:text-white"
        >
          Reset
        </button>
      </div>

      <div className="mb-4 rounded-[1.5rem] border border-slate-200/10 bg-[#0d2337]/70 p-3 md:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.22rem] text-slate-400">Angles</div>
        </div>
        <ViewPresetButtons value={selectedPreset} onChange={handlePresetChange} />
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-slate-200/10 bg-[#0d2337]/70 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="text-[10px] uppercase tracking-[0.2rem] text-slate-400">View</div>
            <button
              type="button"
              onClick={() => updateConfig((current) => ({ ...current, lidOpen: !current.lidOpen }))}
              className="rounded-full border border-sky-300/30 bg-sky-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18rem] text-sky-100"
            >
              {config.lidOpen ? "Close lid" : "Open lid"}
            </button>
          </div>
          <ViewPresetButtons value={selectedPreset} onChange={handlePresetChange} />
        </div>

        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2rem] text-slate-400">
          <span>{summaryTitle}</span>
          <button
            type="button"
            onClick={() => setShowSummary(true)}
            className="text-sky-300 transition hover:text-sky-200"
          >
            summary
          </button>
        </div>

        <div className="space-y-4">
          <SimplifiedConfigurator />
        </div>
      </div>

      {showSummary && <ConfigurationSummary onClose={() => setShowSummary(false)} />}
      <MobileStickyCTA onRequestSummary={() => setShowSummary(true)} />
    </aside>
  );
}
