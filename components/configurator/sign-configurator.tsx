import { ConfiguratorSection } from "./configurator-section";
import { useConfigurationStore } from "./configuration-store";

const signOptions = [
  { value: "none", label: "None" },
  { value: "aluminum", label: "Aluminum" },
  { value: "acrylic", label: "Transparent Acrylic" },
] as const;

export function SignConfigurator({
  title,
  keyName,
}: {
  title: string;
  keyName: "frontSign" | "rearSign";
}) {
  const value = useConfigurationStore((state) => state.config[keyName]);
  const setField = useConfigurationStore((state) => state.setField);

  return (
    <ConfiguratorSection title={title} description="Front LED sign selection">
      <div className="grid gap-2">
        {signOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setField(keyName, option.value)}
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
