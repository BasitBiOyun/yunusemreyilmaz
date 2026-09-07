"use client";

import { AdaptiveDpr, Preload, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import { Suspense } from "react";
import type { RoomView } from "@/components/LanguageRoom";
import { RoomScene } from "@/components/room/RoomScene";

export function RoomCanvas({
  active,
  view,
  section,
  onSectionChange,
  onFocusMonitor,
  onReturnToRoom: _onReturnToRoom,
}: {
  active: boolean;
  view: RoomView;
  section: string;
  onSectionChange: (section: string) => void;
  onFocusMonitor: (section?: string) => void;
  onReturnToRoom: () => void;
}) {
  return (
    <div className="webgl-stage" aria-hidden={!active}>
      <Canvas
        shadows
        dpr={[1, 1.65]}
        camera={{ position: [5.25, 3.65, 7.4], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        performance={{ min: 0.55 }}
      >
        <Suspense fallback={null}>
          <RoomScene
            active={active}
            view={view}
            section={section}
            onSectionChange={onSectionChange}
            onFocusMonitor={onFocusMonitor}
          />
          <Preload all />
        </Suspense>
        <AdaptiveDpr pixelated={false} />
      </Canvas>
      <SceneLoader />
    </div>
  );
}

function SceneLoader() {
  const { active, progress } = useProgress();

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="scene-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="scene-loader-track">
            <motion.div className="scene-loader-fill" animate={{ width: `${Math.max(progress, 4)}%` }} />
          </div>
          <span>{Math.round(progress)}%</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
