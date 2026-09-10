import { ConfiguratorSection } from "./configurator-section";
import { useConfigurationStore } from "./configuration-store";

const options = [
  { value: "none", label: "None" },
  { value: "etched", label: "Black Etch Into Aluminum" },
  { value: "backlit", label: "Photo Print With Backlighting" },
] as const;

export function InteriorArtworkConfigurator() {
  const value = useConfigurationStore((state) => state.config.interiorArtwork);
  const setField = useConfigurationStore((state) => state.setField);

  return (
    <ConfiguratorSection title="Inside Panel Artwork" description="Interior finish">
      <div className="grid gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setField("interiorArtwork", option.value)}
            className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
              value === option.value
                ? "border-sky-300/70 bg-sky-500/10 text-sky-100"
                : "border-slate-200/10 bg-slate-950/20 text-slate-300 hover:border-slate-200/20 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </ConfiguratorSection>
  );
}
