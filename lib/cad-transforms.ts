export type ComponentKey = "body" | "lid" | "insideCover" | "avcInsert";

export interface CadTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export const cadTransforms: Record<ComponentKey, CadTransform> = {
  body: {
    position: [0.26, -0.2, 0.08],
    rotation: [0, Math.PI, 0],
    scale: [1, 1, 1],
  },
  lid: {
    position: [0.12, 0.44, -0.12],
    rotation: [0, Math.PI, 0],
    scale: [1, 1, 1],
  },
  insideCover: {
    position: [0.06, 0.08, 0.1],
    rotation: [0, Math.PI, 0],
    scale: [1, 1, 1],
  },
  avcInsert: {
    position: [0.0, -0.18, 0.08],
    rotation: [0, Math.PI, 0],
    scale: [1, 1, 1],
  },
};

export const cadAssemblyNotes = {
  bodyMaterial: {
    color: "#e8e1d7",
    roughness: 0.88,
    metalness: 0.06,
    clearcoat: 0.35,
    clearcoatRoughness: 0.7,
  },
  measuredBounds: {
    body: { width: 1.9071, height: 0.8661, depth: 0.7866 },
    lid: { width: 1.9086, height: 0.1616, depth: 0.7908 },
    insideCover: { width: 0.3546, height: 0.8281, depth: 0.3154 },
    avcInsert: { width: 0.3038, height: 0.7683, depth: 0.1124 },
  },
  hingeAxis: "x",
  frontFace: "+z",
  preferredCamera: "standing eye level",
  calibrationStatus: "Temporary assembly calibrated from the current MAZARINE GLB geometry; final transforms should be rechecked against the original CAD assembly and STEP references before production release.",
};
