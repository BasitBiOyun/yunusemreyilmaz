"use client";

import { CameraControls, RoundedBox } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { CameraControls as CameraControlsType } from "camera-controls";

const ROOM_VIEW = {
  position: [5.1, 3.55, 7.2] as const,
  target: [0, 1.75, -1.25] as const,
};

const MONITOR_VIEW = {
  position: [0, 2.35, 1.12] as const,
  target: [0, 2.35, -1.38] as const,
};

export function RoomExperience() {
  const [entered, setEntered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <main className="language-room-shell">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: ROOM_VIEW.position, fov: 42, near: 0.1, far: 60 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <RoomScene entered={entered} focused={focused} onFocus={() => setFocused(true)} />
      </Canvas>

      {!entered ? (
        <section className="entry-layer">
          <div className="entry-vignette" />
          <div className="entry-copy">
            <p className="entry-kicker">Yunus Emre Yılmaz</p>
            <h1>Language <em>Room</em></h1>
            <p className="entry-role">English teacher · translator · builder</p>
            <button className="entry-button" onClick={() => setEntered(true)}>
              <span>Enter the room</span><span aria-hidden="true">↗</span>
            </button>
          </div>
          <p className="entry-note">A three-dimensional workspace for language, teaching, data and creative work.</p>
        </section>
      ) : null}

      {entered && !focused ? (
        <div className="room-hud">
          <div className="room-hud-brand"><span>YY</span><div><strong>Language Room</strong><small>Start with the computer.</small></div></div>
          <button className="room-exit" onClick={() => setEntered(false)}>Exit</button>
        </div>
      ) : null}

      {entered && focused ? (
        <button className="monitor-back" onClick={() => setFocused(false)}><span aria-hidden="true">←</span> Back to room</button>
      ) : null}
    </main>
  );
}

function RoomScene({ entered, focused, onFocus }: { entered: boolean; focused: boolean; onFocus: () => void }) {
  const controls = useRef<CameraControlsType | null>(null);

  useEffect(() => {
    const view = focused ? MONITOR_VIEW : ROOM_VIEW;
    controls.current?.setLookAt(...view.position, ...view.target, true);
  }, [entered, focused]);

  return (
    <>
      <color attach="background" args={["#0a0c0b"]} />
      <fog attach="fog" args={["#17130f", 9, 19]} />
      <CameraControls ref={controls} makeDefault enabled={false} smoothTime={0.8} />
      <ambientLight intensity={0.68} color="#eadfce" />
      <directionalLight castShadow position={[4.6, 7.5, 5.5]} intensity={2.05} color="#f6e6ca" shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-2.25, 2.5, -0.25]} intensity={17} distance={4.5} decay={2} color="#ffad67" />
      <pointLight position={[0, 2.45, -0.95]} intensity={7} distance={3.8} decay={2} color="#62d4dc" />
      <RoomShell />
      <Desk />
      <Monitor focused={focused} onFocus={onFocus} />
      <DeskLamp />
      <WallBoard />
      <ContactObjects />
    </>
  );
}

function RoomShell() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.1, 0]}><boxGeometry args={[10.4, 0.2, 8.4]} /><meshStandardMaterial color="#6c5141" roughness={0.9} /></mesh>
      <mesh receiveShadow position={[0, 3, -4.05]}><boxGeometry args={[10.4, 6, 0.18]} /><meshStandardMaterial color="#bdb4a5" roughness={0.96} /></mesh>
      <mesh receiveShadow position={[-5.1, 3, 0]}><boxGeometry args={[0.18, 6, 8.2]} /><meshStandardMaterial color="#aaa193" roughness={0.96} /></mesh>
      <mesh receiveShadow position={[5.1, 3, 0]}><boxGeometry args={[0.18, 6, 8.2]} /><meshStandardMaterial color="#b4ab9d" roughness={0.96} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.15, 0.02, 1.25]} receiveShadow><planeGeometry args={[4.8, 2.55]} /><meshStandardMaterial color="#343a35" roughness={0.82} /></mesh>
    </group>
  );
}

function Desk() {
  const legs: [number, number, number][] = [[-2.18, 0.65, -1.42], [2.18, 0.65, -1.42], [-2.18, 0.65, -0.58], [2.18, 0.65, -0.58]];
  return (
    <group>
      <RoundedBox args={[5.15, 0.2, 2.0]} radius={0.08} smoothness={5} position={[0, 1.32, -1.02]} castShadow receiveShadow><meshStandardMaterial color="#593728" roughness={0.55} /></RoundedBox>
      {legs.map((position) => <RoundedBox key={position.join("-")} args={[0.2, 1.3, 0.24]} radius={0.04} smoothness={3} position={position} castShadow><meshStandardMaterial color="#3d261e" roughness={0.64} /></RoundedBox>)}
    </group>
  );
}

function Monitor({ focused, onFocus }: { focused: boolean; onFocus: () => void }) {
  return (
    <group position={[0, 2.38, -1.42]} onClick={(event) => { event.stopPropagation(); onFocus(); }} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = "default"; }}>
      <RoundedBox args={[2.92, 1.78, 0.18]} radius={0.09} smoothness={6} castShadow><meshStandardMaterial color="#151a18" roughness={0.25} metalness={0.52} /></RoundedBox>
      <mesh position={[0, 0, 0.095]}><planeGeometry args={[2.62, 1.47]} /><meshStandardMaterial color="#061514" emissive="#0f6568" emissiveIntensity={focused ? 0.75 : 0.38} roughness={0.24} /></mesh>
      <RoundedBox args={[0.15, 0.65, 0.15]} radius={0.035} smoothness={3} position={[0, -1.18, -0.03]} castShadow><meshStandardMaterial color="#222826" metalness={0.5} roughness={0.3} /></RoundedBox>
      <RoundedBox args={[1.14, 0.09, 0.5]} radius={0.05} smoothness={4} position={[0, -1.48, 0.07]} castShadow><meshStandardMaterial color="#1b211f" metalness={0.46} roughness={0.31} /></RoundedBox>
      <mesh position={[1.25, -0.79, 0.1]}><sphereGeometry args={[0.024, 16, 16]} /><meshStandardMaterial color="#78ddc6" emissive="#78ddc6" emissiveIntensity={3} /></mesh>
    </group>
  );
}

function DeskLamp() {
  return (
    <group position={[-2.05, 1.42, -0.67]}>
      <mesh castShadow position={[0, 0.04, 0]}><cylinderGeometry args={[0.28, 0.33, 0.08, 28]} /><meshStandardMaterial color="#202724" roughness={0.35} metalness={0.42} /></mesh>
      <mesh castShadow position={[0.06, 0.62, 0]} rotation={[0, 0, -0.18]}><cylinderGeometry args={[0.042, 0.052, 1.2, 16]} /><meshStandardMaterial color="#28312d" roughness={0.35} metalness={0.44} /></mesh>
      <mesh castShadow position={[0.2, 1.24, 0.05]} rotation={[0.12, 0, 0.28]}><coneGeometry args={[0.33, 0.54, 28, 1, true]} /><meshStandardMaterial color="#36413b" roughness={0.42} side={2} /></mesh>
    </group>
  );
}

function WallBoard() {
  return (
    <group position={[-2.75, 3.55, -3.92]}>
      <RoundedBox args={[3.1, 1.62, 0.12]} radius={0.05} smoothness={4} castShadow><meshStandardMaterial color="#3f3027" roughness={0.58} /></RoundedBox>
      <mesh position={[0, 0, 0.07]}><planeGeometry args={[2.82, 1.34]} /><meshStandardMaterial color="#263d35" roughness={0.82} /></mesh>
    </group>
  );
}

function ContactObjects() {
  return (
    <group>
      <RoundedBox args={[0.95, 1.36, 0.1]} radius={0.035} smoothness={3} position={[-4.3, 3.15, -3.9]} castShadow><meshStandardMaterial color="#49362a" roughness={0.5} /></RoundedBox>
      <RoundedBox args={[1.8, 0.08, 0.72]} radius={0.04} smoothness={3} position={[-0.95, 1.47, -0.46]} rotation={[0, 0.08, 0]} castShadow><meshStandardMaterial color="#dfd5c3" roughness={0.88} /></RoundedBox>
      <RoundedBox args={[0.68, 0.46, 0.4]} radius={0.07} smoothness={4} position={[1.45, 1.63, -0.88]} rotation={[0, -0.34, 0]} castShadow><meshStandardMaterial color="#1b211f" roughness={0.34} metalness={0.46} /></RoundedBox>
      <RoundedBox args={[0.38, 0.72, 0.07]} radius={0.07} smoothness={4} position={[2.02, 1.48, -1.43]} rotation={[0, 0.16, 0]} castShadow><meshStandardMaterial color="#111716" roughness={0.25} metalness={0.38} /></RoundedBox>
    </group>
  );
}
