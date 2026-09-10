import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Box3, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Vector3 } from "three";

import type { CadNodeInfo, CadNodeMappings } from "./cad-node-manager";

const assemblyAsset = "/models/mazarine-assembly.glb";

export function DockBoxModel({ mappings, selectedId, onNodes, onSelect }: { mappings: CadNodeMappings; selectedId: string | null; onNodes: (nodes: CadNodeInfo[]) => void; onSelect: (id: string) => void }) {
  const { scene } = useGLTF(assemblyAsset);
  const assembly = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const nodes: CadNodeInfo[] = [];
    assembly.traverse((child) => {
      if (child === assembly) return;
      const id = child.name || child.uuid;
      const bounds = new Box3().setFromObject(child);
      const size = bounds.getSize(new Vector3());
      const position = bounds.getCenter(new Vector3());
      nodes.push({ id, originalName: child.name || "(unnamed)", type: child.type, childCount: child.children.length, parentPath: child.parent?.name || "Scene", size: [size.x, size.y, size.z], position: [position.x, position.y, position.z] });

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
    onNodes(nodes);
  }, [assembly, onNodes]);

  useEffect(() => {
    assembly.traverse((child) => {
      if (child === assembly) return;
      const id = child.name || child.uuid;
      const mapping = mappings[id];
      child.visible = mapping?.defaultVisible ?? true;
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      const material = mesh.material;
      if (material instanceof MeshStandardMaterial || material instanceof MeshPhysicalMaterial) {
        material.emissive.set(id === selectedId ? "#22d3ee" : "#000000");
        material.emissiveIntensity = id === selectedId ? 0.35 : 0;
      }
    });
  }, [assembly, mappings, selectedId]);

  return <primitive object={assembly} scale={0.001} onClick={(event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(event.object.name || event.object.uuid); }} />;
}

useGLTF.preload(assemblyAsset);
