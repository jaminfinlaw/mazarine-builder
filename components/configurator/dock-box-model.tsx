import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from "three";

const assemblyAsset = "/models/mazarine-assembly.glb";

export function DockBoxModel() {
  const { scene } = useGLTF(assemblyAsset);
  const assembly = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    assembly.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const material = mesh.material;
      if (material instanceof MeshStandardMaterial || material instanceof MeshPhysicalMaterial) {
        material.color.set("#e8e1d7");
        material.metalness = 0.04;
        material.roughness = 0.82;
      }
    });
  }, [assembly]);

  return <primitive object={assembly} scale={0.001} />;
}

useGLTF.preload(assemblyAsset);
