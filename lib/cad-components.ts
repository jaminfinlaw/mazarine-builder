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
  glbNodes: readonly string[];
  status: "confirmed-source" | "ambiguous-export";
};

// The assembled GLB retains geometry but strips Fusion occurrence names. Its
// mesh nodes are the generic Node1 through Node22 beneath Node0.
export const cadComponents: Record<CadComponentKey, CadComponentMapEntry> = {
  body: { fusionOccurrences: ["3.0"], glbNodes: [], status: "ambiguous-export" },
  lid: { fusionOccurrences: ["royal lid 2.0"], glbNodes: [], status: "ambiguous-export" },
  insideCover: { fusionOccurrences: ["Lid-Modified-12-22-22"], glbNodes: [], status: "ambiguous-export" },
  avc: { fusionOccurrences: ["curent AVC Vent Covers"], glbNodes: [], status: "ambiguous-export" },
  frontSign: { fusionOccurrences: ["sign 2"], glbNodes: [], status: "ambiguous-export" },
  rearSign: { fusionOccurrences: [], glbNodes: [], status: "ambiguous-export" },
  storageSystem: { fusionOccurrences: ["upper 1/4 basket", "upper 1/2 basket", "lower 1/2 basket"], glbNodes: [], status: "ambiguous-export" },
  dividerCoolerPanels: { fusionOccurrences: [], glbNodes: [], status: "ambiguous-export" },
  teakPopUpBar: { fusionOccurrences: ["wet bar"], glbNodes: [], status: "ambiguous-export" },
  insideArtworkPanel: { fusionOccurrences: ["Lid-Modified-12-22-22"], glbNodes: [], status: "ambiguous-export" },
};
