import Image from "next/image";
import { useRef } from "react";

import { fontOptions } from "@/lib/configuration";
import { ConfiguratorSection } from "./configurator-section";
import { useConfigurationStore } from "./configuration-store";

const logoModes = [
  { value: "none", label: "No logo or text" },
  { value: "text", label: "Boat name / logo text" },
  { value: "upload", label: "Upload logo image" },
] as const;

export function LogoConfigurator() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const logoMode = useConfigurationStore((state) => state.config.logoMode);
  const logoText = useConfigurationStore((state) => state.config.logoText);
  const selectedFont = useConfigurationStore((state) => state.config.selectedFont);
  const uploadedLogo = useConfigurationStore((state) => state.config.uploadedLogo);
  const setField = useConfigurationStore((state) => state.setField);

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setField("uploadedLogo", String(reader.result ?? ""));
      setField("logoMode", "upload");
    };
    reader.readAsDataURL(file);
  };

  return (
    <ConfiguratorSection title="Logo / Name" description="Branding and signage">
      <div className="space-y-4">
        <div className="grid gap-2">
          {logoModes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => setField("logoMode", mode.value)}
              className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
                logoMode === mode.value
                  ? "border-sky-300/70 bg-sky-500/10 text-sky-100"
                  : "border-slate-200/10 bg-slate-950/20 text-slate-300 hover:border-slate-200/20 hover:text-white"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {logoMode === "text" && (
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-[0.18rem] text-slate-400">
              Boat name / logo text
            </label>
            <input
              value={logoText}
              onChange={(event) => setField("logoText", event.target.value.toUpperCase())}
              className="w-full rounded-2xl border border-slate-200/10 bg-slate-950/30 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-sky-300/50"
              placeholder="AURORA"
            />

            <label className="block text-xs uppercase tracking-[0.18rem] text-slate-400">CNC-ready font</label>
            <select
              value={selectedFont}
              onChange={(event) => setField("selectedFont", event.target.value)}
              className="w-full rounded-2xl border border-slate-200/10 bg-slate-950/30 px-3 py-2 text-sm text-white outline-none focus:border-sky-300/50"
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {logoMode === "upload" && (
          <div className="space-y-3">
            <input
              ref={inputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.svg"
              onChange={onUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full rounded-2xl border border-dashed border-sky-300/40 bg-sky-500/5 px-3 py-3 text-sm font-medium text-sky-100 hover:bg-sky-500/10"
            >
              Upload PNG, JPG, JPEG, or SVG
            </button>

            {uploadedLogo && (
              <div className="overflow-hidden rounded-2xl border border-slate-200/10 bg-slate-950/20 p-3">
                <div className="mb-2 text-[10px] uppercase tracking-[0.2rem] text-slate-400">Processed black / white preview</div>
                <div className="relative mx-auto h-28 w-full max-w-[220px] overflow-hidden rounded-xl bg-white p-2">
                  <Image
                    src={uploadedLogo}
                    alt="Uploaded logo preview"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ConfiguratorSection>
  );
}
