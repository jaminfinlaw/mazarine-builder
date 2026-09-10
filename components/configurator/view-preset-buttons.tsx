import type { CameraPreset } from "./camera-controls";

const presetItems: { label: string; value: CameraPreset }[] = [
  { label: "Front", value: "front" },
  { label: "Right", value: "right" },
  { label: "Back", value: "back" },
  { label: "Left", value: "left" },
  { label: "Interior", value: "interior" },
];

export function ViewPresetButtons({
  value,
  onChange,
}: {
  value: CameraPreset;
  onChange: (preset: CameraPreset) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
      {presetItems.map((preset) => (
        <button
          key={preset.value}
          type="button"
          onClick={() => onChange(preset.value)}
          className={`rounded-full border px-2 py-2 text-[10px] font-medium uppercase tracking-[0.18rem] transition ${
            value === preset.value
              ? "border-sky-300/80 bg-sky-400/15 text-sky-100"
              : "border-slate-200/10 bg-slate-900/30 text-slate-300 hover:border-slate-200/30 hover:text-white"
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
