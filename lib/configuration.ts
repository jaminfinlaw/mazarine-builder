export type LogoSize = "small" | "medium" | "large";
export type LogoMode = "text" | "upload";
export type InsideArtworkMode = "upload" | "sign-art" | "none";

export const fontOptions = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Trebuchet MS, sans-serif", label: "Trebuchet" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Tahoma, sans-serif", label: "Tahoma" },
] as const;

export interface DockBoxConfig {
  model: string;
  lidOpen: boolean;
  ledColor: string;
  logo: {
    mode: LogoMode;
    text: string;
    font: string;
    size: LogoSize;
    uploadedOriginal: string | null;
    uploadedCleaned: string | null;
  };
  signs: { front: boolean; back: boolean };
  insideArtwork: {
    mode: InsideArtworkMode;
    uploadedOriginal: string | null;
    uploadedCleaned: string | null;
  };
  options: {
    storageSystem: boolean;
    dividerCoolerPanels: boolean;
    teakPopUpBar: boolean;
  };
}

export const defaultConfig: DockBoxConfig = {
  model: "dock-box-standard",
  lidOpen: false,
  ledColor: "#74d7ff",
  logo: {
    mode: "text",
    text: "AURORA",
    font: fontOptions[0].value,
    size: "medium",
    uploadedOriginal: null,
    uploadedCleaned: null,
  },
  signs: { front: true, back: true },
  insideArtwork: { mode: "sign-art", uploadedOriginal: null, uploadedCleaned: null },
  options: { storageSystem: true, dividerCoolerPanels: true, teakPopUpBar: false },
};

type LegacyConfig = Partial<{
  frontSign: string;
  rearSign: string;
  interiorArtwork: string;
  storageSystem: string;
  acrylicDividers: string;
  logoMode: string;
  logoText: string;
  selectedFont: string;
  uploadedLogo: string;
}>;

export function migrateConfig(value: unknown): DockBoxConfig {
  const incoming = (value && typeof value === "object" ? value : {}) as Partial<DockBoxConfig> & LegacyConfig;
  const logo = (incoming.logo ?? {}) as Partial<DockBoxConfig["logo"]>;
  const signs = (incoming.signs ?? {}) as Partial<DockBoxConfig["signs"]>;
  const insideArtwork = (incoming.insideArtwork ?? {}) as Partial<DockBoxConfig["insideArtwork"]>;
  const options = (incoming.options ?? {}) as Partial<DockBoxConfig["options"]>;

  return {
    ...defaultConfig,
    model: incoming.model ?? defaultConfig.model,
    lidOpen: incoming.lidOpen ?? defaultConfig.lidOpen,
    ledColor: incoming.ledColor ?? defaultConfig.ledColor,
    logo: {
      ...defaultConfig.logo,
      ...logo,
      mode: logo.mode ?? (incoming.logoMode === "upload" ? "upload" : "text"),
      text: logo.text ?? incoming.logoText ?? defaultConfig.logo.text,
      font: logo.font ?? incoming.selectedFont ?? defaultConfig.logo.font,
      uploadedOriginal: logo.uploadedOriginal ?? incoming.uploadedLogo ?? null,
    },
    signs: {
      front: signs.front ?? (incoming.frontSign ? incoming.frontSign !== "none" : defaultConfig.signs.front),
      back: signs.back ?? (incoming.rearSign ? incoming.rearSign !== "none" : defaultConfig.signs.back),
    },
    insideArtwork: {
      ...defaultConfig.insideArtwork,
      ...insideArtwork,
      mode: insideArtwork.mode ?? (incoming.interiorArtwork === "none" ? "none" : defaultConfig.insideArtwork.mode),
    },
    options: {
      storageSystem: options.storageSystem ?? (incoming.storageSystem ? incoming.storageSystem !== "none" : true),
      dividerCoolerPanels: options.dividerCoolerPanels ?? (incoming.acrylicDividers ? incoming.acrylicDividers !== "none" : true),
      teakPopUpBar: options.teakPopUpBar ?? false,
    },
  };
}

export function readConfigFromUrl(): DockBoxConfig | null {
  if (typeof window === "undefined") return null;
  const rawConfig = new URLSearchParams(window.location.search).get("config");
  if (!rawConfig) return null;
  try {
    return migrateConfig(JSON.parse(atob(rawConfig)));
  } catch {
    return null;
  }
}

export function getConfigSummaryText(config: DockBoxConfig): string {
  const signs = [config.signs.front && "Front", config.signs.back && "Back"].filter(Boolean).join(", ") || "None";
  return `Logo: ${config.logo.mode === "text" ? config.logo.text : "Uploaded artwork"} | Signs: ${signs} | Inside art: ${config.insideArtwork.mode}`;
}
