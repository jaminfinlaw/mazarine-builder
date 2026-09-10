import { Text, useTexture } from "@react-three/drei";
import { useMemo } from "react";
import type { DockBoxConfig } from "@/lib/configuration";

const bodyColor = "#f5f1ea";
const hardwareColor = "#dfe4eb";
const blackInterior = "#111827";

export function DockBoxModel({ config }: { config: DockBoxConfig }) {
  const lidRotation = config.lidOpen ? -1.15 : 0;
  const logoTexture = useTexture(config.uploadedLogo || "");

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
        : [-0.9, 0, 0.9].map((x) => ({ x })),
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
    <group position={[0, -0.15, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[3.25, 1.6, 2.15]} />
        <meshPhysicalMaterial
          color={bodyColor}
          metalness={0.12}
          roughness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.35}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 1.15, 0]}>
        <boxGeometry args={[3.35, 0.18, 2.25]} />
        <meshStandardMaterial color={bodyColor} metalness={0.3} roughness={0.4} />
      </mesh>

      <group position={[0, 1.18, 0]} rotation={[lidRotation, 0, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
          <boxGeometry args={[3.25, 0.14, 2.15]} />
          <meshStandardMaterial color={bodyColor} metalness={0.18} roughness={0.42} />
        </mesh>
      </group>

      <mesh position={[0, -0.76, 0]} receiveShadow>
        <boxGeometry args={[3.1, 0.1, 2.06]} />
        <meshStandardMaterial color="#d8e0ea" metalness={0.7} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.38, 0.1]} castShadow>
        <boxGeometry args={[2.62, 1.05, 0.08]} />
        <meshStandardMaterial
          color={config.interiorArtwork === "none" ? blackInterior : "#e9edf5"}
          emissive={config.interiorArtwork === "backlit" ? config.ledColor : "#000000"}
          emissiveIntensity={config.interiorArtwork === "backlit" ? 0.9 : 0}
          metalness={0.22}
          roughness={0.35}
        />
      </mesh>

      {Array.from({ length: storageCount }).map((_, index) => {
        const total = Math.max(storageCount, 2);
        const x = -1.15 + (index / (total - 1)) * 2.3;
        return (
          <group key={`${config.storageSystem}-${index}`} position={[x, -0.1, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.78, 0.58, 1.38]} />
              <meshStandardMaterial color={blackInterior} metalness={0.4} roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      {dividerPositions.map((divider, index) => (
        <group key={`divider-${index}`} position={[divider.x, 0.32, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.04, 1.12, 1.6]} />
            <meshPhysicalMaterial
              color="#edf5ff"
              transparent
              opacity={config.acrylicDividers === "etched" ? 0.75 : 0.9}
              emissive={config.acrylicDividers === "etched" ? config.ledColor : "#000000"}
              emissiveIntensity={config.acrylicDividers === "etched" ? 0.7 : 0}
              metalness={0.05}
              roughness={0.08}
            />
          </mesh>
        </group>
      ))}

      {frontSignMaterial && (
        <group position={[0, 0.17, 1.09]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.3, 0.5, 0.08]} />
            <meshPhysicalMaterial
              color={frontSignMaterial.color}
              metalness={frontSignMaterial.metalness}
              roughness={frontSignMaterial.roughness}
              transparent={frontSignMaterial.transparent}
              opacity={frontSignMaterial.opacity ?? 1}
              emissive={config.frontSign === "acrylic" ? config.ledColor : "#000000"}
              emissiveIntensity={config.frontSign === "acrylic" ? 0.95 : 0}
            />
          </mesh>
          <Text
            position={[0, 0.02, 0.06]}
            fontSize={0.22}
            color={config.frontSign === "acrylic" ? "#ffffff" : "#0f172a"}
            anchorX="center"
            anchorY="middle"
            maxWidth={2.1}
            outlineWidth={0.02}
            outlineColor={config.frontSign === "acrylic" ? "#0f172a" : "#e2e8f0"}
            font={config.selectedFont}
          >
            {config.logoMode === "text" ? config.logoText || "AURORA" : "CUSTOM"}
          </Text>
        </group>
      )}

      {rearSignMaterial && (
        <group position={[0, 0.17, -1.09]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.3, 0.5, 0.08]} />
            <meshPhysicalMaterial
              color={rearSignMaterial.color}
              metalness={rearSignMaterial.metalness}
              roughness={rearSignMaterial.roughness}
              transparent={rearSignMaterial.transparent}
              opacity={rearSignMaterial.opacity ?? 1}
              emissive={config.rearSign === "acrylic" ? config.ledColor : "#000000"}
              emissiveIntensity={config.rearSign === "acrylic" ? 0.95 : 0}
            />
          </mesh>
          <Text
            position={[0, 0.02, 0.06]}
            fontSize={0.21}
            color={config.rearSign === "acrylic" ? "#ffffff" : "#0f172a"}
            anchorX="center"
            anchorY="middle"
            maxWidth={2.1}
            outlineWidth={0.02}
            outlineColor={config.rearSign === "acrylic" ? "#0f172a" : "#e2e8f0"}
            font={config.selectedFont}
          >
            {config.logoMode === "text" ? config.logoText || "AURORA" : "CUSTOM"}
          </Text>
        </group>
      )}

      {config.logoMode === "upload" && config.uploadedLogo && (
        <group position={[0, 0.18, 1.12]}>
          <mesh>
            <planeGeometry args={[1.45, 0.6]} />
            <meshStandardMaterial map={logoTexture} color="#ffffff" />
          </mesh>
        </group>
      )}

      {Array.from({ length: 6 }).map((_, index) => {
        const x = -1.05 + (index % 3) * 1.05;
        const y = index < 3 ? 0.9 : 0.3;
        const z = index % 2 === 0 ? 0.8 : -0.8;
        return (
          <mesh key={`hardware-${index}`} position={[x, y, z]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
            <meshStandardMaterial color={hardwareColor} metalness={1} roughness={0.22} />
          </mesh>
        );
      })}

      {config.acrylicDividers !== "none" && (
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.06, 1.1, 1.45]} />
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
