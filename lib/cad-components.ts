export type CadComponentKey =
  | "body"
  | "lid"
  | "insideCover"
  | "avc"
  | "frontSign"
  | "rearSign"
  | "storageSystem"
  | "dividerCoolerPanels"
  | "teakPopUpBar"
  | "insideArtworkPanel";

export type CadComponentMapEntry = {
  fusionOccurrences: readonly string[];
  glbNodes: readonly string[] | null;
  status: "confirmed-source" | "needs-export-verification";
};

// GLB node names must be populated only after the STEP export is inspected.
export const cadComponents: Record<CadComponentKey, CadComponentMapEntry> = {
  body: { fusionOccurrences: ["3.0"], glbNodes: null, status: "needs-export-verification" },
  lid: { fusionOccurrences: ["royal lid 2.0"], glbNodes: null, status: "needs-export-verification" },
  insideCover: { fusionOccurrences: ["Lid-Modified-12-22-22"], glbNodes: null, status: "needs-export-verification" },
  avc: { fusionOccurrences: ["curent AVC Vent Covers"], glbNodes: null, status: "needs-export-verification" },
  frontSign: { fusionOccurrences: ["sign 2"], glbNodes: null, status: "needs-export-verification" },
  rearSign: { fusionOccurrences: [], glbNodes: null, status: "needs-export-verification" },
  storageSystem: { fusionOccurrences: ["upper 1/4 basket", "upper 1/2 basket", "lower 1/2 basket"], glbNodes: null, status: "confirmed-source" },
  dividerCoolerPanels: { fusionOccurrences: [], glbNodes: null, status: "needs-export-verification" },
  teakPopUpBar: { fusionOccurrences: ["wet bar"], glbNodes: null, status: "confirmed-source" },
  insideArtworkPanel: { fusionOccurrences: ["Lid-Modified-12-22-22"], glbNodes: null, status: "needs-export-verification" },
};
