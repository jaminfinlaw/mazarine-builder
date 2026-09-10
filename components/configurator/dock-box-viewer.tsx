import { ContactShadows, Environment, Line, OrbitControls, Text, useProgress } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { CameraControls, type CameraPreset, cameraPresets } from "./camera-controls";
import { DockBoxModel } from "./dock-box-model";
import { useConfigurationStore } from "./configuration-store";
import { cadTransforms } from "@/lib/cad-transforms";

const subscribeToDebugMode = () => () => {};

function useDebugMode() {
  return useSyncExternalStore(
    subscribeToDebugMode,
    () => new URLSearchParams(window.location.search).get("debug") === "1",
    () => false,
  );
}

function DebugOverlay({
  enabled,
  lidOpen,
}: {
  enabled: boolean;
  lidOpen: boolean;
}) {
  const { camera } = useThree();
  const boxes = useMemo(
    () => [
      { name: "body", size: [1.907, 0.866, 0.787], pos: cadTransforms.body.position, color: "#7dd3fc" },
      { name: "lid", size: [1.909, 0.162, 0.791], pos: cadTransforms.lid.mesh.position, color: "#a7f3d0" },
      { name: "inside cover", size: [0.355, 0.828, 0.315], pos: cadTransforms.insideCover.position, color: "#f9a8d4" },
      { name: "AVC insert", size: [0.304, 0.768, 0.112], pos: cadTransforms.avcInsert.position, color: "#fcd34d" },
    ],
    [],
  );

  if (!enabled) return null;

  return (
    <>
      <axesHelper args={[2.4]} />
      <Line points={[[-0.95, cadTransforms.lid.hingePivot[1], cadTransforms.lid.hingePivot[2]], [0.95, cadTransforms.lid.hingePivot[1], cadTransforms.lid.hingePivot[2]]]} color="#fb7185" lineWidth={2} />
      <mesh position={cadTransforms.lid.hingePivot}><sphereGeometry args={[0.045, 12, 12]} /><meshBasicMaterial color="#fb7185" /></mesh>
      <Text position={[0, cadTransforms.lid.hingePivot[1] + 0.1, cadTransforms.lid.hingePivot[2]]} fontSize={0.07} color="#fb7185" anchorX="center">hinge axis</Text>
      {boxes.map((box) => (
        <group key={box.name} position={box.pos as [number, number, number]}>
          <mesh>
            <boxGeometry args={box.size as [number, number, number]} />
            <meshBasicMaterial wireframe color={box.color} transparent opacity={0.8} />
          </mesh>
          <Text position={[0, box.size[1] / 2 + 0.18, 0]} fontSize={0.09} color={box.color} anchorX="center" anchorY="middle">
            {box.name}
          </Text>
          <mesh><sphereGeometry args={[0.025, 8, 8]} /><meshBasicMaterial color={box.color} /></mesh>
        </group>
      ))}
      <Text position={[0, 1.5, 0]} fontSize={0.12} color="#f8fafc" anchorX="center" anchorY="middle">
        {`Cam: ${camera.position.toArray().map((v) => v.toFixed(2)).join(", ")} | lid ${lidOpen ? "open" : "closed"}`}
      </Text>
    </>
  );
}

function ModelLoader() {
  const { active, errors, item, loaded, progress, total } = useProgress();
  const displayProgress = total > 0 ? Math.round(progress) : 0;
  const label = errors.length > 0
    ? "Model failed to load"
    : active
      ? item ? `Loading ${item.split("/").pop()}` : "Loading model"
      : "Preparing viewer";

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/80 px-8 text-slate-200">
      <div className="text-sm font-medium uppercase tracking-[0.28rem]">{label}</div>
      <div className="h-1.5 w-full max-w-64 overflow-hidden rounded-full bg-slate-700">
        <div className="h-full bg-sky-300 transition-[width] duration-200" style={{ width: `${displayProgress}%` }} />
      </div>
      <div className="text-xs tabular-nums text-slate-400">{errors.length > 0 ? "Refresh to try again." : `${loaded} of ${total || 4} assets · ${displayProgress}%`}</div>
    </div>
  );
}

export function DockBoxViewer({ cameraPreset }: { cameraPreset: CameraPreset }) {
  const [isReady, setIsReady] = useState(false);
  const debugMode = useDebugMode();
  const { active, errors } = useProgress();
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
        <color attach="background" args={["#0a1b2b"]} />
        <fog attach="fog" args={["#0a1b2b", 9, 22]} />

        <ambientLight intensity={0.8} />
        <hemisphereLight args={["#edf6ff", "#1e293b", 0.6]} />
        <directionalLight
          castShadow
          position={[5.5, 7.5, 6]}
          intensity={1.7}
          shadow-mapSize-width={1536}
          shadow-mapSize-height={1536}
          shadow-bias={-0.0001}
        />
        <spotLight position={[0, 7.5, 3.5]} intensity={1.15} angle={0.35} penumbra={0.6} color="#f5f8ff" />

        <CameraControls preset={cameraPreset} controlsRef={controlsRef} />
        <Suspense fallback={null}>
          <DockBoxModel config={config} />
        </Suspense>
        <DebugOverlay enabled={debugMode} lidOpen={config.lidOpen} />
        <Environment preset="city" />
        <ContactShadows position={[0, -1.9, 0]} scale={12} blur={2.2} opacity={0.8} far={10} />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={2.8}
          maxDistance={9}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 0.18, 0]}
          rotateSpeed={0.75}
        />
      </Canvas>

      {debugMode && (
        <div className="absolute left-3 top-3 z-10 max-w-[260px] rounded-2xl border border-sky-300/30 bg-slate-950/70 p-3 text-[10px] uppercase tracking-[0.16rem] text-sky-100 backdrop-blur-sm">
          <div className="mb-1 font-semibold text-sky-200">CAD Debug</div>
          <div>Body: 1.9 x 0.86 x 0.79</div>
          <div>Lid hinge: rear x-axis</div>
          <div>Front face: +z</div>
        </div>
      )}

      {(!isReady || active || errors.length > 0) && <ModelLoader />}
    </div>
  );
}
