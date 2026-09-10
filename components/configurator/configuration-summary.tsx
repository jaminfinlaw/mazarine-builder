import { useState } from "react";
import { getConfigSummaryText } from "@/lib/configuration";
import { useConfigurationStore } from "./configuration-store";

export function ConfigurationSummary({
  onClose,
}: {
  onClose: () => void;
}) {
  const config = useConfigurationStore((state) => state.config);
  const resetConfig = useConfigurationStore((state) => state.resetConfig);
  const [copied, setCopied] = useState(false);

  const handleCopyShare = async () => {
    const encoded = btoa(JSON.stringify(config));
    const shareUrl = `${window.location.origin}${window.location.pathname}?config=${encodeURIComponent(encoded)}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    resetConfig();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-slate-200/15 bg-[#0d2134] shadow-[0_30px_80px_rgba(2,6,23,0.72)]">
        <div className="flex items-center justify-between border-b border-slate-200/10 px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28rem] text-sky-300">Configuration Summary</p>
            <h3 className="mt-1 text-2xl font-semibold text-white">Custom Dock Box</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200/15 bg-slate-900/40 px-3 py-1 text-sm text-slate-200 transition hover:border-sky-300/40 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-2xl border border-slate-200/10 bg-slate-900/40 p-4 text-sm text-slate-200">
            {getConfigSummaryText(config)}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Model", config.model],
              ["Front sign", config.frontSign],
              ["Rear sign", config.rearSign],
              ["Interior artwork", config.interiorArtwork],
              ["Storage system", config.storageSystem],
              ["Acrylic dividers", config.acrylicDividers],
              ["Logo mode", config.logoMode],
              ["Logo text", config.logoText || "—"],
              ["Font", config.selectedFont],
              ["LED color", config.ledColor],
              ["Lid", config.lidOpen ? "Open" : "Closed"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200/10 bg-slate-950/30 p-3">
                <div className="text-[10px] uppercase tracking-[0.22rem] text-slate-400">{label}</div>
                <div className="mt-1 font-medium text-white">{String(value)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200/10 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCopyShare}
            className="rounded-full border border-sky-300/40 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-100 transition hover:bg-sky-500/15"
          >
            {copied ? "URL copied" : "Copy share URL"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-slate-200/15 bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-200/30 hover:text-white"
          >
            Reset configuration
          </button>
        </div>
      </div>
    </div>
  );
}
