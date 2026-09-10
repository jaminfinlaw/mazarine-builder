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
import { cadTransforms } from "@/lib/cad-transforms";

const bodyColor = "#e8e1d7";
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
  transform: [number, number, number];
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
    <group position={transform} scale={[1, 1, 1]}>
      <primitive object={cloned} />
    </group>
  );
}

export function DockBoxModel({ config }: { config: DockBoxConfig }) {
  const lidRotation = config.lidOpen ? -1.08 : 0;
  const [logoTexture, setLogoTexture] = useState<Texture | null>(null);

  useEffect(() => {
    // Cleanup: always clear texture when logo URL changes
    const cleanup = () => {
      setLogoTexture(null);
    };

    // Only load if we have a URL
    if (config.uploadedLogo) {
      const loader = new TextureLoader();
      loader.load(
        config.uploadedLogo,
        (texture) => setLogoTexture(texture),
        undefined,
        () => setLogoTexture(null),
      );
    }

    return cleanup;
  }, [config.uploadedLogo]);

  const storageCount =
    config.storageSystem === "six-piece"
      ? 6
      : config.storageSystem === "four-baskets"
        ? 4
        : 2;

  const dividerPositions = useMemo(
    () =>
      config.acrylicDividers === "none"
        ? []
        : [-0.8, 0, 0.8].map((x) => ({ x })),
    [config.acrylicDividers],
  );

  const frontSignMaterial =
    config.frontSign === "aluminum"
      ? { color: "#dfe4eb", metalness: 1, roughness: 0.28 }
      : config.frontSign === "acrylic"
        ? { color: "#dfeaf5", metalness: 0.05, roughness: 0.18, transparent: true, opacity: 0.8 }
        : null;

  const rearSignMaterial =
    config.rearSign === "aluminum"
      ? { color: "#dfe4eb", metalness: 1, roughness: 0.28 }
      : config.rearSign === "acrylic"
        ? { color: "#dfeaf5", metalness: 0.05, roughness: 0.18, transparent: true, opacity: 0.8 }
        : null;

  return (
    <group position={[0, -0.1, 0]} rotation={[0, 0, 0]} scale={[0.92, 0.92, 0.92]}>
      <CadMesh
        file="/models/body.glb"
        transform={cadTransforms.body.position}
        colorOverride={bodyColor}
        metalness={0.08}
        roughness={0.88}
      />

      <group position={[0.12, 0.46, 0.72]}>
        <group rotation={[lidRotation, 0, 0]}>
          <CadMesh
            file="/models/lid.glb"
            transform={cadTransforms.lid.position}
            colorOverride="#e5e0d8"
            metalness={0.08}
            roughness={0.82}
          />
        </group>
      </group>

      <CadMesh
        file="/models/inside_cover.glb"
        transform={cadTransforms.insideCover.position}
        colorOverride="#dfe3ea"
        metalness={0.12}
        roughness={0.7}
      />

      <CadMesh
        file="/models/avc_insert.glb"
        transform={cadTransforms.avcInsert.position}
        colorOverride="#1f2937"
        metalness={0.2}
        roughness={0.8}
      />

      <mesh position={[0, 0.32, 0.12]} castShadow>
        <boxGeometry args={[1.7, 0.56, 0.08]} />
        <meshStandardMaterial
          color={config.interiorArtwork === "none" ? blackInterior : "#eef4ff"}
          emissive={config.interiorArtwork === "backlit" ? config.ledColor : "#000000"}
          emissiveIntensity={config.interiorArtwork === "backlit" ? 0.8 : 0}
          metalness={0.32}
          roughness={0.38}
        />
      </mesh>

      {Array.from({ length: storageCount }).map((_, index) => {
        const total = Math.max(storageCount, 2);
        const x = -0.68 + (index / (total - 1)) * 1.36;
        return (
          <group key={`${config.storageSystem}-${index}`} position={[x, -0.06, 0.05]}>
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
              opacity={config.acrylicDividers === "etched" ? 0.75 : 0.9}
              emissive={config.acrylicDividers === "etched" ? config.ledColor : "#000000"}
              emissiveIntensity={config.acrylicDividers === "etched" ? 0.6 : 0}
              metalness={0.05}
              roughness={0.08}
            />
          </mesh>
        </group>
      ))}

      {frontSignMaterial && (
        <group position={[0, 0.1, 0.95]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.36, 0.06]} />
            <meshPhysicalMaterial
              color={frontSignMaterial.color}
              metalness={frontSignMaterial.metalness}
              roughness={frontSignMaterial.roughness}
              transparent={frontSignMaterial.transparent}
              opacity={frontSignMaterial.opacity ?? 1}
              emissive={config.frontSign === "acrylic" ? config.ledColor : "#000000"}
              emissiveIntensity={config.frontSign === "acrylic" ? 0.9 : 0}
            />
          </mesh>
          <Text
            position={[0, 0.03, 0.05]}
            fontSize={0.18}
            color={config.frontSign === "acrylic" ? "#ffffff" : "#0f172a"}
            anchorX="center"
            anchorY="middle"
            maxWidth={1.4}
            outlineWidth={0.02}
            outlineColor={config.frontSign === "acrylic" ? "#0f172a" : "#e2e8f0"}
            font={config.selectedFont}
          >
            {config.logoMode === "text" ? config.logoText || "AURORA" : "CUSTOM"}
          </Text>
        </group>
      )}

      {rearSignMaterial && (
        <group position={[0, 0.1, -0.95]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.36, 0.06]} />
            <meshPhysicalMaterial
              color={rearSignMaterial.color}
              metalness={rearSignMaterial.metalness}
              roughness={rearSignMaterial.roughness}
              transparent={rearSignMaterial.transparent}
              opacity={rearSignMaterial.opacity ?? 1}
              emissive={config.rearSign === "acrylic" ? config.ledColor : "#000000"}
              emissiveIntensity={config.rearSign === "acrylic" ? 0.9 : 0}
            />
          </mesh>
          <Text
            position={[0, 0.03, 0.05]}
            fontSize={0.17}
            color={config.rearSign === "acrylic" ? "#ffffff" : "#0f172a"}
            anchorX="center"
            anchorY="middle"
            maxWidth={1.4}
            outlineWidth={0.02}
            outlineColor={config.rearSign === "acrylic" ? "#0f172a" : "#e2e8f0"}
            font={config.selectedFont}
          >
            {config.logoMode === "text" ? config.logoText || "AURORA" : "CUSTOM"}
          </Text>
        </group>
      )}

      {config.logoMode === "upload" && config.uploadedLogo && (
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

      {config.acrylicDividers !== "none" && (
        <mesh position={[0, 0.2, 0.08]}>
          <boxGeometry args={[0.05, 0.72, 1.0]} />
          <meshStandardMaterial
            color="#eaf2ff"
            emissive={config.ledColor}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}
