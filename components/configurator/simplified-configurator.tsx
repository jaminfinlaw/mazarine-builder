"use client";

import { useRef, useState } from "react";

import { prepareArtwork } from "@/lib/artwork-preprocessing";
import { fontOptions, type LogoSize } from "@/lib/configuration";
import { useConfigurationStore } from "./configuration-store";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="group border-b border-slate-200/10 py-3 last:border-0 md:py-4">
      <summary className="cursor-pointer list-none text-xs font-semibold tracking-[0.18rem] text-sky-200 marker:hidden">{title}</summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2 text-sm text-slate-200">
      <span>{label}</span>
      <input className="h-4 w-4 accent-sky-300" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function ArtworkUpload({ label, accept, onComplete }: { label: string; accept: string; onComplete: (original: string, cleaned: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [original, setOriginal] = useState<string | null>(null);
  const [cleaned, setCleaned] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = await prepareArtwork(file);
    setOriginal(result.original);
    setCleaned(result.cleaned);
    onComplete(result.original, result.cleaned);
    setMessage(result.requiresBackgroundRemoval ? "Background cleanup requires the pending API integration." : "Artwork cleaned.");
  };

  return (
    <div className="space-y-2">
      <input ref={inputRef} className="hidden" type="file" accept={accept} onChange={handleUpload} />
      <button type="button" onClick={() => inputRef.current?.click()} className="w-full rounded-md border border-dashed border-sky-300/50 bg-sky-500/5 px-3 py-2 text-sm font-medium text-sky-100">
        {label}
      </button>
      {original && <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.12rem] text-slate-400"><div>Original<img className="mt-1 h-16 w-full rounded bg-white object-contain" src={original} alt="Original upload" /></div><div>Cleaned Preview<div className="mt-1 flex h-16 items-center justify-center rounded bg-slate-950/40 text-center normal-case tracking-normal">{cleaned ? <img className="h-full w-full object-contain" src={cleaned} alt="Cleaned artwork" /> : "API required"}</div></div></div>}
      {message && <p className="text-xs text-amber-200">{message}</p>}
    </div>
  );
}

export function SimplifiedConfigurator() {
  const config = useConfigurationStore((state) => state.config);
  const updateConfig = useConfigurationStore((state) => state.updateConfig);
  const artwork = config.logo.uploadedCleaned ?? config.logo.uploadedOriginal;

  return (
    <div className="divide-y divide-slate-200/10 rounded-lg border border-slate-200/10 bg-[#0d2337]/70 px-3">
      <Section title="LOGO">
        <div className="space-y-3">
          <label className="block text-xs text-slate-400">Type Name<input value={config.logo.text} onChange={(event) => updateConfig((current) => ({ ...current, logo: { ...current.logo, mode: "text", text: event.target.value.toUpperCase() } }))} className="mt-1 w-full rounded-md border border-slate-200/10 bg-slate-950/30 px-3 py-2 text-sm text-white" /></label>
          <label className="block text-xs text-slate-400">Select Font<select value={config.logo.font} onChange={(event) => updateConfig((current) => ({ ...current, logo: { ...current.logo, font: event.target.value } }))} className="mt-1 w-full rounded-md border border-slate-200/10 bg-slate-950/30 px-3 py-2 text-sm text-white">{fontOptions.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}</select></label>
          <div><div className="text-xs text-slate-400">Select Size</div><div className="mt-1 grid grid-cols-3 gap-1">{(["small", "medium", "large"] as LogoSize[]).map((size) => <button key={size} type="button" onClick={() => updateConfig((current) => ({ ...current, logo: { ...current.logo, size } }))} className={`rounded-md px-2 py-2 text-xs capitalize ${config.logo.size === size ? "bg-sky-400 text-slate-950" : "bg-slate-950/30 text-slate-300"}`}>{size}</button>)}</div></div>
          <ArtworkUpload label="Upload Logo" accept=".png,.jpg,.jpeg,.svg" onComplete={(uploadedOriginal, uploadedCleaned) => updateConfig((current) => ({ ...current, logo: { ...current.logo, mode: "upload", uploadedOriginal, uploadedCleaned } }))} />
        </div>
      </Section>
      <Section title="SIGNS">
        <Toggle label="Front" checked={config.signs.front} onChange={(front) => updateConfig((current) => ({ ...current, signs: { ...current.signs, front } }))} />
        <Toggle label="Back" checked={config.signs.back} onChange={(back) => updateConfig((current) => ({ ...current, signs: { ...current.signs, back } }))} />
      </Section>
      <Section title="INSIDE ARTWORK">
        <ArtworkUpload label="Upload Artwork" accept=".png,.jpg,.jpeg" onComplete={(uploadedOriginal, uploadedCleaned) => updateConfig((current) => ({ ...current, insideArtwork: { mode: "upload", uploadedOriginal, uploadedCleaned } }))} />
        <label className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-200"><span>Use Sign Art</span><input className="h-4 w-4 accent-sky-300" type="checkbox" checked={config.insideArtwork.mode === "sign-art"} disabled={!config.logo.text && !artwork} onChange={(event) => updateConfig((current) => ({ ...current, insideArtwork: { ...current.insideArtwork, mode: event.target.checked ? "sign-art" : "none" } }))} /></label>
      </Section>
      <Section title="OPTIONS">
        <Toggle label="Storage System" checked={config.options.storageSystem} onChange={(storageSystem) => updateConfig((current) => ({ ...current, options: { ...current.options, storageSystem } }))} />
        <Toggle label="Divider / Cooler Panels" checked={config.options.dividerCoolerPanels} onChange={(dividerCoolerPanels) => updateConfig((current) => ({ ...current, options: { ...current.options, dividerCoolerPanels } }))} />
        <Toggle label="Teak Pop-Up Bar" checked={config.options.teakPopUpBar} onChange={(teakPopUpBar) => updateConfig((current) => ({ ...current, options: { ...current.options, teakPopUpBar } }))} />
      </Section>
    </div>
  );
}
