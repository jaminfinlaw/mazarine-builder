export type Vec3 = readonly [number, number, number];

export interface CadTransform {
  readonly position: Vec3;
  readonly rotation: Vec3;
  readonly scale: Vec3;
}

export const shellMaterial = {
  color: "#e8e1d7",
  metalness: 0.04,
  roughness: 0.82,
} as const;

export const cadTransforms = {
  body: { position: [0.26, -0.2, 0.08], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
  lid: {
    hingePivot: [0.12, 0.45, -0.48],
    relativePivotOffset: [0, 0.02, 0.36],
    closedRotation: [0, 0, 0],
    openRotation: [-1.96, 0, 0],
    mesh: { position: [0.12, 0.44, -0.12], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
  },
  insideCover: { position: [0.06, -0.065, 0.06], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
  avcInsert: { position: [0.0, -0.18, 0.08], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
} as const;

export const cadAssemblyNotes = {
  hingeAxis: "x",
  openAngleRadians: -1.96,
  bodyMeshExclusion: "body.glb contains only one mesh node (geometry_0); no safe isolated square submesh is available to hide.",
};
