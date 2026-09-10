export type SignType = "none" | "aluminum" | "acrylic";
export type InteriorArtworkType = "none" | "etched" | "backlit";
export type StorageSystemType = "six-piece" | "four-baskets" | "two-drawers";
export type DividerType = "none" | "clear" | "etched";
export type LogoMode = "none" | "text" | "upload";

export const fontOptions = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Trebuchet MS, sans-serif", label: "Trebuchet" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Tahoma, sans-serif", label: "Tahoma" },
] as const;

export interface DockBoxConfig {
  model: string;
  frontSign: SignType;
  rearSign: SignType;
  interiorArtwork: InteriorArtworkType;
  storageSystem: StorageSystemType;
  acrylicDividers: DividerType;
  logoMode: LogoMode;
  logoText: string;
  selectedFont: string;
  uploadedLogo: string;
  ledColor: string;
  lidOpen: boolean;
}

export const defaultConfig: DockBoxConfig = {
  model: "dock-box-standard",
  frontSign: "acrylic",
  rearSign: "aluminum",
  interiorArtwork: "backlit",
  storageSystem: "six-piece",
  acrylicDividers: "clear",
  logoMode: "text",
  logoText: "AURORA",
  selectedFont: fontOptions[0].value,
  uploadedLogo: "",
  ledColor: "#74d7ff",
  lidOpen: false,
};

export function readConfigFromUrl(): Partial<DockBoxConfig> | null {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const rawConfig = params.get("config");

  if (!rawConfig) {
    return null;
  }

  try {
    const decoded = atob(rawConfig);
    return JSON.parse(decoded) as Partial<DockBoxConfig>;
  } catch {
    return null;
  }
}

export function writeConfigToUrl(config: DockBoxConfig) {
  if (typeof window === "undefined") {
    return;
  }

  const state = btoa(JSON.stringify(config));
  const nextUrl = `${window.location.pathname}?config=${encodeURIComponent(state)}`;
  window.history.replaceState({}, "", nextUrl);
}

export function getConfigSummaryText(config: DockBoxConfig): string {
  return [
    `Model: ${config.model}`,
    `Front sign: ${config.frontSign}`,
    `Rear sign: ${config.rearSign}`,
    `Interior artwork: ${config.interiorArtwork}`,
    `Storage: ${config.storageSystem}`,
    `Dividers: ${config.acrylicDividers}`,
    `Logo: ${config.logoMode === "text" ? config.logoText : "Uploaded logo"}`,
    `LED: ${config.ledColor}`,
    `Lid: ${config.lidOpen ? "Open" : "Closed"}`,
  ].join(" | ");
}
