import { ConfiguratorSection } from "./configurator-section";
import { useConfigurationStore } from "./configuration-store";

const presetColors = ["#74d7ff", "#8fe38b", "#facc15", "#fca5a5", "#d8b4fe", "#f9fafb"];

export function LedColorPicker() {
  const ledColor = useConfigurationStore((state) => state.config.ledColor);
  const setField = useConfigurationStore((state) => state.setField);

  return (
    <ConfiguratorSection title="LED Light Color" description="Live illumination">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-2xl border border-slate-200/15 bg-slate-950/40 p-1">
            <input
              aria-label="LED Color picker"
              type="color"
              value={ledColor}
              onChange={(event) => setField("ledColor", event.target.value)}
            />
          </div>
          <div className="rounded-full border border-slate-200/10 bg-slate-950/20 px-3 py-2 text-sm font-medium text-slate-200">
            {ledColor.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setField("ledColor", color)}
              className={`h-9 rounded-full border-2 transition ${
                ledColor === color ? "border-white" : "border-slate-200/20"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select LED color ${color}`}
            />
          ))}
        </div>
      </div>
    </ConfiguratorSection>
  );
}
