import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { MutableRefObject } from "react";

export type CameraPreset = "front" | "right" | "back" | "left" | "interior";

export const cameraPresets: Record<
  CameraPreset,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  front: { position: [0, 1.7, 6.75], target: [0, 0.7, 0] },
  right: { position: [6.2, 1.6, 0.25], target: [0, 0.7, 0] },
  back: { position: [0, 1.7, -6.75], target: [0, 0.7, 0] },
  left: { position: [-6.2, 1.6, -0.25], target: [0, 0.7, 0] },
  interior: { position: [0, 2.1, 3.3], target: [0, 0.8, 0] },
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
