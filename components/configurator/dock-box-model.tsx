import { Text, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import {
  type Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Texture,
  TextureLoader,
} from "three";

import type { DockBoxConfig } from "@/lib/configuration";
import { cadTransforms, shellMaterial, type CadTransform } from "@/lib/cad-transforms";

const hardwareColor = "#dfe4eb";
const blackInterior = "#111827";

function CadMesh({
  file,
  transform,
  colorOverride,
  metalness,
  roughness,
}: {
  file: string;
  transform: CadTransform;
  colorOverride?: string;
  metalness?: number;
  roughness?: number;
}) {
  const { scene } = useGLTF(file);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((child) => {
      const mesh = child as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const material = mesh.material;
        const typedMaterial =
          material instanceof MeshStandardMaterial ||
          material instanceof MeshPhysicalMaterial ||
          material instanceof MeshBasicMaterial
            ? material
            : null;

        if (colorOverride && typedMaterial && "color" in typedMaterial) {
          typedMaterial.color.set(colorOverride);
        }

        if (typedMaterial && "metalness" in typedMaterial) {
          typedMaterial.metalness = metalness ?? typedMaterial.metalness ?? 0.2;
        }

        if (typedMaterial && "roughness" in typedMaterial) {
          typedMaterial.roughness = roughness ?? typedMaterial.roughness ?? 0.8;
        }
      }
    });
  }, [cloned, colorOverride, metalness, roughness]);

  return (
    <group position={transform.position} rotation={transform.rotation} scale={transform.scale}>
      <primitive object={cloned} />
    </group>
  );
}

export function DockBoxModel({ config }: { config: DockBoxConfig }) {
  const lidRotation = config.lidOpen ? cadTransforms.lid.openRotation : cadTransforms.lid.closedRotation;
  const [logoTexture, setLogoTexture] = useState<Texture | null>(null);

  useEffect(() => {
    // Cleanup: always clear texture when logo URL changes
    const cleanup = () => {
      setLogoTexture(null);
    };

    // Only load if we have a URL
    const activeLogo = config.logo.uploadedCleaned ?? config.logo.uploadedOriginal;
    if (activeLogo) {
      const loader = new TextureLoader();
      loader.load(
        activeLogo,
        (texture) => setLogoTexture(texture),
        undefined,
        () => setLogoTexture(null),
      );
    }

    return cleanup;
  }, [config.logo.uploadedCleaned, config.logo.uploadedOriginal]);

  const storageCount = config.options.storageSystem ? 6 : 0;

  const dividerPositions = useMemo(
    () =>
      !config.options.dividerCoolerPanels
        ? []
        : [-0.8, 0, 0.8].map((x) => ({ x })),
    [config.options.dividerCoolerPanels],
  );

  const signMaterial = { color: "#dfeaf5", metalness: 0.05, roughness: 0.18, transparent: true, opacity: 0.8 };
  const logoScale = config.logo.size === "small" ? 0.7 : config.logo.size === "large" ? 1.25 : 1;
  const activeLogo = config.logo.uploadedCleaned ?? config.logo.uploadedOriginal;

  return (
    <group position={[0, -0.1, 0]} rotation={[0, 0, 0]} scale={[0.92, 0.92, 0.92]}>
      <CadMesh
        file="/models/body.glb"
        transform={cadTransforms.body}
        colorOverride={shellMaterial.color}
        metalness={shellMaterial.metalness}
        roughness={shellMaterial.roughness}
      />

      <group position={cadTransforms.lid.hingePivot}>
        <group rotation={lidRotation}>
          <group position={[-cadTransforms.lid.hingePivot[0], -cadTransforms.lid.hingePivot[1], -cadTransforms.lid.hingePivot[2]]}>
          <CadMesh
            file="/models/lid.glb"
            transform={cadTransforms.lid.mesh}
            colorOverride={shellMaterial.color}
            metalness={shellMaterial.metalness}
            roughness={shellMaterial.roughness}
          />
          <CadMesh
            file="/models/inside_cover.glb"
            transform={cadTransforms.insideCover}
            colorOverride={shellMaterial.color}
            metalness={shellMaterial.metalness}
            roughness={shellMaterial.roughness}
          />
          <mesh position={[0, 0.32, 0.12]} castShadow>
            <boxGeometry args={[1.7, 0.56, 0.03]} />
            <meshStandardMaterial
              color={config.insideArtwork.mode === "none" ? blackInterior : "#eef4ff"}
              emissive={config.insideArtwork.mode === "none" ? "#000000" : config.ledColor}
              emissiveIntensity={config.insideArtwork.mode === "none" ? 0 : 0.8}
              metalness={0.32}
              roughness={0.38}
            />
          </mesh>
          </group>
        </group>
      </group>

      <CadMesh
        file="/models/avc_insert.glb"
        transform={cadTransforms.avcInsert}
        colorOverride={shellMaterial.color}
        metalness={shellMaterial.metalness}
        roughness={shellMaterial.roughness}
      />

      {Array.from({ length: storageCount }).map((_, index) => {
        const total = Math.max(storageCount, 2);
        const x = -0.68 + (index / (total - 1)) * 1.36;
        return (
          <group key={`storage-${index}`} position={[x, -0.06, 0.05]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.42, 0.48, 0.98]} />
              <meshStandardMaterial color={blackInterior} metalness={0.4} roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      {dividerPositions.map((divider, index) => (
        <group key={`divider-${index}`} position={[divider.x, 0.18, 0.05]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.8, 1.2]} />
            <meshPhysicalMaterial
              color="#edf5ff"
              transparent
              opacity={0.9}
              emissive="#000000"
              emissiveIntensity={0}
              metalness={0.05}
              roughness={0.08}
            />
          </mesh>
        </group>
      ))}

      {config.signs.front && (
        <group position={[0, 0.1, 0.95]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.36, 0.06]} />
            <meshPhysicalMaterial
              {...signMaterial}
              emissive={config.ledColor}
              emissiveIntensity={0.9}
            />
          </mesh>
          <Text
            position={[0, 0.03, 0.05]}
            fontSize={0.18 * logoScale}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.4}
            outlineWidth={0.02}
            outlineColor="#0f172a"
          >
            {config.logo.mode === "text" ? config.logo.text || "MAZARINE" : "CUSTOM"}
          </Text>
        </group>
      )}

      {config.signs.back && (
        <group position={[0, 0.1, -0.95]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.36, 0.06]} />
            <meshPhysicalMaterial
              {...signMaterial}
              emissive={config.ledColor}
              emissiveIntensity={0.9}
            />
          </mesh>
          <Text
            position={[0, 0.03, 0.05]}
            fontSize={0.17 * logoScale}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.4}
            outlineWidth={0.02}
            outlineColor="#0f172a"
          >
            {config.logo.mode === "text" ? config.logo.text || "MAZARINE" : "CUSTOM"}
          </Text>
        </group>
      )}

      {config.logo.mode === "upload" && activeLogo && (
        <group position={[0, 0.16, 1.04]}>
          <mesh>
            <planeGeometry args={[1.1, 0.5]} />
            <meshStandardMaterial map={logoTexture} color="#ffffff" />
          </mesh>
        </group>
      )}

      {Array.from({ length: 6 }).map((_, index) => {
        const x = -0.7 + (index % 3) * 0.7;
        const y = index < 3 ? 0.42 : 0.1;
        const z = index % 2 === 0 ? 0.7 : -0.7;
        return (
          <mesh key={`hardware-${index}`} position={[x, y, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.24, 12]} />
            <meshStandardMaterial color={hardwareColor} metalness={1} roughness={0.2} />
          </mesh>
        );
      })}

      {config.options.teakPopUpBar && (
        <group position={[-0.8, 0.18, 0]}>
          <mesh position={[0.8, 0.65, 0]}><boxGeometry args={[1.4, 0.05, 0.42]} /><meshStandardMaterial color="#8a5a34" roughness={0.65} /></mesh>
        </group>
      )}
    </group>
  );
}
