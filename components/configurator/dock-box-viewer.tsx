import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { CameraControls, type CameraPreset, cameraPresets } from "./camera-controls";
import { DockBoxModel } from "./dock-box-model";
import { useConfigurationStore } from "./configuration-store";

export function DockBoxViewer({ cameraPreset }: { cameraPreset: CameraPreset }) {
  const [isReady, setIsReady] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const config = useConfigurationStore((state) => state.config);

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-[2rem] border border-slate-200/15 bg-[#091d2e] shadow-[0_30px_60px_rgba(2,6,23,0.55)] md:h-[760px]">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: cameraPresets.front.position, fov: 32 }}
        onCreated={() => setIsReady(true)}
      >
        <color attach="background" args={["#091d2e"]} />
        <fog attach="fog" args={["#091d2e", 9, 19]} />
        <ambientLight intensity={0.95} />
        <directionalLight
          castShadow
          position={[6, 8, 5]}
          intensity={1.8}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight position={[0, 7, 4]} intensity={1.3} angle={0.45} penumbra={0.7} />

        <CameraControls preset={cameraPreset} controlsRef={controlsRef} />
        <DockBoxModel config={config} />
        <Environment preset="city" />
        <ContactShadows position={[0, -2.4, 0]} scale={12} blur={2.5} opacity={0.75} far={9} />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={4.5}
          maxDistance={10.5}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 0.7, 0]}
          rotateSpeed={0.75}
        />
      </Canvas>

      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 text-sm font-medium tracking-[0.28rem] text-slate-200 uppercase">
          Loading model
        </div>
      )}
    </div>
  );
}
