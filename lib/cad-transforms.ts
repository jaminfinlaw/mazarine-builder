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
  // Each GLB was exported with a different origin. These offsets normalize all
  // real CAD parts around the molded body center at [0, 0, 0].
  body: { position: [1.2457, -1.0186, 0.5073], rotation: [0, 0, 0], scale: [1, 1, 1] },
  lid: {
    hingePivot: [0, 0.44, -0.393],
    relativePivotOffset: [0, 0.091, 0.393],
    closedRotation: [0, 0, 0],
    openRotation: [-1.96, 0, 0],
    mesh: { position: [0.9852, 0.5206, -1.1987], rotation: [0, 0, 0], scale: [1, 1, 1] },
  },
  // These two assets form the upright center AVC assembly in the box.
  insideCover: { position: [-0.6612, -0.5561, 0.3073], rotation: [0, 0, 0], scale: [1, 1, 1] },
  avcInsert: { position: [-0.7717, -0.5854, 0.4314], rotation: [0, 0, 0], scale: [1, 1, 1] },
} as const;

export const cadAssemblyNotes = {
  hingeAxis: "x",
  openAngleRadians: -1.96,
  bodyMeshExclusion: "body.glb contains only one mesh node (geometry_0); no safe isolated square submesh is available to hide.",
};
