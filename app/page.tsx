"use client";

import { useState } from "react";

import { ConfiguratorPanel } from "@/components/configurator/configurator-panel";
import { DockBoxViewer } from "@/components/configurator/dock-box-viewer";
import type { CameraPreset } from "@/components/configurator/camera-controls";

export default function Home() {
  const [selectedPreset, setSelectedPreset] = useState<CameraPreset>("front");

  return (
    <main className="min-h-screen bg-[#071726] text-white">
      <div className="mx-auto w-full max-w-[1600px] px-3 py-3 md:px-5 md:py-5">
        <header className="mb-3 flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200/10 bg-[#0c1d2d]/70 px-4 py-3 backdrop-blur-sm md:px-6">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.36rem] text-sky-300">MAZARINE</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-[0.22rem] text-slate-300">
              Custom Dock Box Builder
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-4 lg:flex-row">
          <section className="min-w-0 flex-1">
            <DockBoxViewer cameraPreset={selectedPreset} />
          </section>

          <ConfiguratorPanel
            selectedPreset={selectedPreset}
            onPresetChange={setSelectedPreset}
          />
        </div>
      </div>
    </main>
  );
}
