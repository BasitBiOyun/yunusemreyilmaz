"use client";

import { CameraControls, Clone, Environment, RoundedBox, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CameraControls as CameraControlsType } from "camera-controls";
import type { Group } from "three";

const ASSET_ROOT = "https://raw.githubusercontent.com/Teetertater/Floorplan2Walkthru/main/public/assets/furniture";

const DESK_URL = `${ASSET_ROOT}/metal_office_desk_1k.gltf/metal_office_desk_1k.gltf`;
const CHAIR_URL = `${ASSET_ROOT}/modern_arm_chair_01_1k.gltf/modern_arm_chair_01_1k.gltf`;
const SHELF_URL = `${ASSET_ROOT}/wooden_display_shelves_01_1k.gltf/wooden_display_shelves_01_1k.gltf`;

const VIEWS = {
  room: { p: [5.9, 3.45, 7.4], t: [0.15, 1.45, -1.15] },
  monitor: { p: [0.05, 2.15, 1.05], t: [0.05, 2.15, -1.62] },
  teaching: { p: [-3.0, 2.9, 0.1], t: [-3.0, 2.85, -3.88] },
  translation: { p: [-0.9, 2.48, 0.62], t: [-0.82, 1.34, -0.46] },
  projects: { p: [3.6, 2.65, 0.2], t: [3.55, 2.3, -3.45] },
  media: { p: [1.82, 2.0, 0.65], t: [1.92, 1.47, -0.82] },
  about: { p: [-4.15, 2.75, 0.6], t: [-4.12, 2.7, -3.82] },
} as const;

type ViewName = keyof typeof VIEWS;

export function ImmersiveRoom() {
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<ViewName>("room");
  const [hovered, setHovered] = useState<string | null>(null);

  const go = (next: ViewName) => {
    if (!entered) return;
    setView(next);
  };

  return (
    <main className="immersive-shell">
      <Canvas
        shadows
        dpr={[1, 1.65]}
        camera={{ position: VIEWS.room.p, fov: 42, near: 0.1, far: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene view={view} entered={entered} go={go} setHovered={setHovered} />
      </Canvas>

      <AnimatePresence>
        {!entered ? (
          <motion.section
            className="immersive-entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="immersive-entry-copy">
              <p>YUNUS EMRE YILMAZ</p>
              <h1>Language <em>Room</em></h1>
              <span>English teacher · translator · builder</span>
              <button onClick={() => setEntered(true)}>Enter the room <b>↗</b></button>
            </div>
            <small>Explore the objects. Every object opens a different part of the work.</small>
          </motion.section>
        ) : null}
      </AnimatePresence>

      {entered && view === "room" ? (
        <div className="immersive-hud">
          <div className="immersive-brand"><b>YY</b><span>Language Room<small>Move through the workspace.</small></span></div>
          <button onClick={() => setEntered(false)}>Exit</button>
        </div>
      ) : null}

      {entered && view !== "room" ? (
        <button className="immersive-back" onClick={() => setView("room")}>← Back to room</button>
      ) : null}

      <AnimatePresence mode="wait">
        {entered && view !== "room" ? <FocusLayer key={view} view={view} go={go} /> : null}
      </AnimatePresence>

      {entered && view === "room" && hovered ? (
        <motion.div className="object-hint" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{hovered}</motion.div>
      ) : null}

      <div className="asset-credit">Selected CC0 furniture · Poly Haven</div>
    </main>
  );
}

function Scene({ view, entered, go, setHovered }: {
  view: ViewName;
  entered: boolean;
  go: (view: ViewName) => void;
  setHovered: (label: string | null) => void;
}) {
  const controls = useRef<CameraControlsType | null>(null);

  useEffect(() => {
    const target = VIEWS[view];
    controls.current?.setLookAt(...target.p, ...target.t, true);
  }, [view, entered]);

  return (
    <>
      <color attach="background" args={["#11130f"]} />
      <fog attach="fog" args={["#171913", 10, 23]} />
      <CameraControls ref={controls} makeDefault enabled={false} smoothTime={0.92} />
      <Environment preset="apartment" environmentIntensity={0.55} />
      <ambientLight intensity={0.32} color="#fff4df" />
      <directionalLight castShadow position={[4.5, 7, 4]} intensity={2.2} color="#ffd8a4" shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-1.7, 2.45, -0.1]} intensity={10} distance={4.5} color="#ff9f58" />
      <pointLight position={[0.1, 2.2, -1.45]} intensity={5.5} distance={3.5} color="#80d8d0" />
      <pointLight position={[3.7, 2.4, -3.2]} intensity={4.5} distance={3.2} color="#ffd7a3" />

      <RoomArchitecture />
      <Furniture />
      <DeskCluster go={go} setHovered={setHovered} />
      <WallObjects go={go} setHovered={setHovered} />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.28} luminanceThreshold={1.0} mipmapBlur />
        <Noise opacity={0.018} />
        <Vignette eskil={false} offset={0.16} darkness={0.58} />
      </EffectComposer>
    </>
  );
}

function RoomArchitecture() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.09, 0]}><boxGeometry args={[11.2, 0.18, 9.3]} /><meshStandardMaterial color="#6d5445" roughness={0.84} /></mesh>
      <mesh receiveShadow position={[0, 3.05, -4.18]}><boxGeometry args={[11.2, 6.1, 0.18]} /><meshStandardMaterial color="#b9aa94" roughness={0.94} /></mesh>
      <mesh receiveShadow position={[-5.5, 3.05, 0]}><boxGeometry args={[0.18, 6.1, 8.5]} /><meshStandardMaterial color="#9f927f" roughness={0.94} /></mesh>
      <mesh receiveShadow position={[5.5, 3.05, 0]}><boxGeometry args={[0.18, 6.1, 8.5]} /><meshStandardMaterial color="#aa9c88" roughness={0.94} /></mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.15, 0.025, 1.05]} receiveShadow>
        <planeGeometry args={[5.3, 3.15]} />
        <meshStandardMaterial color="#343b35" roughness={0.9} />
      </mesh>

      <group position={[2.2, 3.55, -4.05]}>
        <mesh><boxGeometry args={[2.2, 2.15, 0.09]} /><meshStandardMaterial color="#272821" roughness={0.65} /></mesh>
        <mesh position={[0, 0, 0.055]}><planeGeometry args={[2.0, 1.95]} /><meshStandardMaterial color="#ccb990" roughness={0.82} /></mesh>
      </group>

      <mesh position={[-0.2, 5.22, -3.98]}><boxGeometry args={[5.5, 0.07, 0.12]} /><meshStandardMaterial color="#6a4d36" roughness={0.5} /></mesh>
    </group>
  );
}

function Furniture() {
  const desk = useGLTF(DESK_URL);
  const chair = useGLTF(CHAIR_URL);
  const shelf = useGLTF(SHELF_URL);

  return (
    <group>
      <group position={[0, 0.02, -0.85]} rotation={[0, Math.PI, 0]} scale={1.08}>
        <Clone object={desk.scene} castShadow receiveShadow />
      </group>
      <group position={[0.05, 0.02, 1.28]} rotation={[0, Math.PI, 0]} scale={1.02}>
        <Clone object={chair.scene} castShadow receiveShadow />
      </group>
      <group position={[3.65, 0, -3.92]} rotation={[0, -Math.PI / 2, 0]} scale={1.2}>
        <Clone object={shelf.scene} castShadow receiveShadow />
      </group>
    </group>
  );
}

function DeskCluster({ go, setHovered }: { go: (view: ViewName) => void; setHovered: (label: string | null) => void }) {
  const hover = (label: string) => ({
    onPointerOver: (e: { stopPropagation: () => void }) => { e.stopPropagation(); document.body.style.cursor = "pointer"; setHovered(label); },
    onPointerOut: () => { document.body.style.cursor = "default"; setHovered(null); },
  });

  return (
    <group>
      <group position={[0, 2.05, -1.55]} onClick={(e) => { e.stopPropagation(); go("monitor"); }} {...hover("Computer · selected work and projects") }>
        <RoundedBox args={[2.58, 1.53, 0.16]} radius={0.07} smoothness={5} castShadow><meshStandardMaterial color="#111412" roughness={0.2} metalness={0.6} /></RoundedBox>
        <mesh position={[0, 0, 0.085]}><planeGeometry args={[2.34, 1.3]} /><meshStandardMaterial color="#091817" emissive="#116b69" emissiveIntensity={0.48} roughness={0.2} /></mesh>
        <RoundedBox args={[0.12, 0.56, 0.12]} radius={0.025} smoothness={3} position={[0, -1.03, -0.02]}><meshStandardMaterial color="#171b19" metalness={0.55} roughness={0.25} /></RoundedBox>
        <RoundedBox args={[0.95, 0.06, 0.38]} radius={0.03} smoothness={3} position={[0, -1.31, 0.06]}><meshStandardMaterial color="#161a18" metalness={0.5} roughness={0.28} /></RoundedBox>
      </group>

      <group position={[-0.85, 1.08, -0.15]} rotation={[-0.11, 0.08, -0.02]} onClick={(e) => { e.stopPropagation(); go("translation"); }} {...hover("Notebook · translation and language work") }>
        <RoundedBox args={[1.58, 0.08, 1.02]} radius={0.04} smoothness={3} castShadow><meshStandardMaterial color="#dfd2bc" roughness={0.86} /></RoundedBox>
        <mesh position={[0, 0.046, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.38, 0.82]} /><meshStandardMaterial color="#eee4d2" roughness={0.95} /></mesh>
      </group>

      <group position={[1.75, 1.18, -0.55]} rotation={[0, -0.35, 0]} onClick={(e) => { e.stopPropagation(); go("media"); }} {...hover("Recorder · YouTube and public work") }>
        <RoundedBox args={[0.58, 0.34, 0.36]} radius={0.06} smoothness={4} castShadow><meshStandardMaterial color="#171b19" roughness={0.26} metalness={0.52} /></RoundedBox>
        <mesh position={[0.18, 0.03, 0.2]}><cylinderGeometry args={[0.1, 0.1, 0.05, 32]} /><meshStandardMaterial color="#28302d" roughness={0.3} metalness={0.55} /></mesh>
      </group>
    </group>
  );
}

function WallObjects({ go, setHovered }: { go: (view: ViewName) => void; setHovered: (label: string | null) => void }) {
  const interactive = (label: string, view: ViewName) => ({
    onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); go(view); },
    onPointerOver: (e: { stopPropagation: () => void }) => { e.stopPropagation(); document.body.style.cursor = "pointer"; setHovered(label); },
    onPointerOut: () => { document.body.style.cursor = "default"; setHovered(null); },
  });

  return (
    <group>
      <group position={[-3.0, 3.0, -4.04]} {...interactive("Teaching board · classroom and MEB work", "teaching") }>
        <RoundedBox args={[3.1, 1.88, 0.12]} radius={0.045} smoothness={4} castShadow><meshStandardMaterial color="#5a3b2b" roughness={0.58} /></RoundedBox>
        <mesh position={[0, 0, 0.07]}><planeGeometry args={[2.84, 1.6]} /><meshStandardMaterial color="#233b32" roughness={0.9} /></mesh>
      </group>

      <group position={[-4.35, 2.72, -4.03]} {...interactive("About · profile and background", "about") }>
        <RoundedBox args={[0.92, 1.22, 0.1]} radius={0.025} smoothness={3}><meshStandardMaterial color="#493326" roughness={0.62} /></RoundedBox>
        <mesh position={[0, 0, 0.06]}><planeGeometry args={[0.76, 1.06]} /><meshStandardMaterial color="#d8c9ae" roughness={0.92} /></mesh>
      </group>

      <group position={[3.55, 2.32, -3.62]} {...interactive("Project shelf · Squad Index and Reflect & Shoot", "projects") }>
        <mesh position={[0, 0.18, 0.32]}><boxGeometry args={[1.25, 0.78, 0.08]} /><meshStandardMaterial color="#1a1c19" roughness={0.5} /></mesh>
      </group>
    </group>
  );
}

function FocusLayer({ view, go }: { view: Exclude<ViewName, "room">; go: (view: ViewName) => void }) {
  return (
    <motion.section
      className={`immersive-focus immersive-focus-${view}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
    >
      {view === "monitor" ? <MonitorLayer go={go} /> : null}
      {view === "teaching" ? <TeachingLayer /> : null}
      {view === "translation" ? <TranslationLayer /> : null}
      {view === "projects" ? <ProjectsLayer /> : null}
      {view === "media" ? <MediaLayer /> : null}
      {view === "about" ? <AboutLayer /> : null}
    </motion.section>
  );
}

function MonitorLayer({ go }: { go: (view: ViewName) => void }) {
  return (
    <div className="monitor-portal">
      <header><span>YY / WORKSTATION</span><b>22:59 · KONYA</b></header>
      <main>
        <p>SELECTED WORK</p>
        <h2>What is being built,<br />taught and translated.</h2>
        <nav>
          <button onClick={() => go("projects")}><span>01</span><strong>Squad Index + Reflect & Shoot</strong><b>Projects ↗</b></button>
          <button onClick={() => go("teaching")}><span>02</span><strong>English teaching + MEB projects</strong><b>Teaching ↗</b></button>
          <button onClick={() => go("translation")}><span>03</span><strong>EN ↔ TR translation work</strong><b>Translation ↗</b></button>
        </nav>
      </main>
      <footer>YDT · YDS · TOEFL · IELTS · EN ↔ TR · FOOTBALL DATA · FILM</footer>
    </div>
  );
}

function TeachingLayer() {
  return <div className="board-copy"><p>TEACHING</p><h2>English as a working language,<br />not a worksheet.</h2><div><span>11 years · MEB</span><span>YDT / YDS</span><span>TOEFL / IELTS</span><span>Interactive story projects</span></div><small>Selected lesson samples and MEB case studies will live directly on this board.</small></div>;
}

function TranslationLayer() {
  return <div className="paper-copy"><p>EN ↔ TR</p><h2>Translation & language work</h2><span>Natural Turkish, terminology consistency, editing and localization.</span><div>Literary / educational · Web & product · Editing · Proofreading</div></div>;
}

function ProjectsLayer() {
  return <div className="shelf-copy"><p>PROJECT SHELF</p><h2>Two different kinds of making.</h2><a href="#" onClick={(e) => e.preventDefault()}><b>Squad Index</b><span>Football data, valuation and intelligence platform.</span></a><a href="https://reflectandshoot.com" target="_blank" rel="noreferrer"><b>Reflect & Shoot</b><span>Short-film competition and creative platform. ↗</span></a></div>;
}

function MediaLayer() {
  return <div className="media-copy"><p>MEDIA</p><h2>Analysis in public.</h2><div><b>YouTube</b><span>Long-form football, education and project content.</span></div><div><b>X / Twitter</b><span>Short-form analysis and project notes.</span></div></div>;
}

function AboutLayer() {
  return <div className="about-copy"><p>YUNUS EMRE YILMAZ</p><h2>Teacher.<br />Translator.<br />Builder.</h2><span>English teacher, translator and product builder working across education, football data and creative projects.</span></div>;
}

useGLTF.preload(DESK_URL);
useGLTF.preload(CHAIR_URL);
useGLTF.preload(SHELF_URL);
