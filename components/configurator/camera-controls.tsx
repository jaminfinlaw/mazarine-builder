import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import type { MutableRefObject } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type CameraPreset = "front" | "right" | "back" | "left" | "interior";

export const cameraPresets: Record<
  CameraPreset,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  front: { position: [0, 1.15, 4.75], target: [0, 0.15, 0] },
  right: { position: [4.75, 1.15, 0], target: [0, 0.15, 0] },
  back: { position: [0, 1.2, -4.75], target: [0, 0.15, 0] },
  left: { position: [-4.75, 1.15, 0], target: [0, 0.15, 0] },
  interior: { position: [0, 1.45, 2.5], target: [0, 0.18, 0] },
};

export function CameraControls({
  preset,
  controlsRef,
}: {
  preset: CameraPreset;
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    const target = cameraPresets[preset];
    camera.position.set(...target.position);

    if (controlsRef.current) {
      controlsRef.current.target.set(...target.target);
      controlsRef.current.update();
      return;
    }

    camera.lookAt(target.target[0], target.target[1], target.target[2]);
  }, [camera, controlsRef, preset]);

  return null;
}
