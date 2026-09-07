"use client";

import {
  CameraControls,
  CameraControlsImpl,
  ContactShadows,
  Environment,
  Html,
  RoundedBox,
  Sparkles,
  useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { RoomView } from "@/components/LanguageRoom";
import { MonitorUI } from "@/components/room/MonitorUI";
import { roomAssets } from "@/components/room/assets";

const ROOM_CAMERA = {
  position: [5.25, 3.65, 7.4] as const,
  target: [0, 1.75, -1.35] as const,
};

const MONITOR_CAMERA = {
  position: [0, 2.42, 1.24] as const,
  target: [0, 2.42, -1.32] as const,
};

export function RoomScene({
  active,
  view,
  section,
  onSectionChange,
  onFocusMonitor,
}: {
  active: boolean;
  view: RoomView;
  section: string;
  onSectionChange: (section: string) => void;
  onFocusMonitor: (section?: string) => void;
}) {
  const controls = useRef<CameraControlsImpl>(null);

  useEffect(() => {
    const camera = view === "monitor" ? MONITOR_CAMERA : ROOM_CAMERA;
    controls.current?.setLookAt(
      ...camera.position,
      ...camera.target,
      true,
    );
  }, [active, view]);

  return (
    <>
      <color attach="background" args={["#090b0a"]} />
      <fog attach="fog" args={["#13110e", 9, 21]} />

      <CameraControls
        ref={controls}
        makeDefault
        enabled={false}
        smoothTime={0.7}
        draggingSmoothTime={0.12}
      />

      <ambientLight intensity={0.52} color="#e9dfce" />
      <directionalLight
        castShadow
        position={[4.5, 7.5, 5.8]}
        intensity={1.75}
        color="#f3e7d2"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={22}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <pointLight position={[-2.35, 2.55, -0.15]} intensity={24} distance={5.2} decay={2} color="#ffad63" />
      <pointLight position={[0, 2.45, -0.5]} intensity={9} distance={4.4} decay={2} color="#63cbd7" />

      <Environment preset="apartment" background={false} />

      <ParallaxWorld enabled={active && view === "room"}>
        <RoomArchitecture />
        <DeskSet onFocusMonitor={onFocusMonitor} />
        <Monitor
          focused={view === "monitor"}
          section={section}
          onSectionChange={onSectionChange}
          onFocus={() => onFocusMonitor(section)}
        />
        <WallBoard onClick={() => onFocusMonitor("teaching")} />
        <AboutFrame onClick={() => onFocusMonitor("about")} />
        <Notebook onClick={() => onFocusMonitor("translation")} />
        <CreatorCamera onClick={() => onFocusMonitor("projects")} />
        <Microphone onClick={() => onFocusMonitor("media")} />
        <Phone onClick={() => onFocusMonitor("media")} />

        <Suspense fallback={null}>
          <AssetModel url={roomAssets.chairDesk} position={[1.72, 0.04, 0.12]} rotation={[0, -0.38, 0]} scale={1.12} />
          <AssetModel url={roomAssets.bookcaseOpen} position={[3.62, 0.02, -3.58]} rotation={[0, -Math.PI / 2, 0]} scale={1.38} />
          <AssetModel url={roomAssets.books} position={[3.48, 2.25, -3.15]} rotation={[0, -Math.PI / 2, 0]} scale={1.2} />
          <AssetModel url={roomAssets.keyboard} position={[0, 1.43, -0.37]} rotation={[0, 0, 0]} scale={1.02} />
          <AssetModel url={roomAssets.mouse} position={[0.88, 1.43, -0.39]} rotation={[0, -0.18, 0]} scale={1.05} />
        </Suspense>

        <Sparkles count={34} scale={[10, 5.5, 8]} position={[0, 2.8, 0]} size={0.9} speed={0.08} opacity={0.18} color="#edd6ae" />
      </ParallaxWorld>

      <ContactShadows
        position={[0, 0.012, 0]}
        opacity={0.42}
        scale={14}
        blur={2.6}
        far={5.5}
        resolution={512}
        color="#070604"
      />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.52} luminanceThreshold={1.05} luminanceSmoothing={0.7} mipmapBlur />
        <Noise opacity={0.018} />
        <Vignette eskil={false} offset={0.13} darkness={0.72} />
      </EffectComposer>
    </>
  );
}

function ParallaxWorld({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ pointer }, delta) => {
    if (!group.current) return;
    const targetY = enabled ? pointer.x * 0.012 : 0;
    const targetX = enabled ? -pointer.y * 0.007 : 0;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
  });

  return <group ref={group}>{children}</group>;
}

function RoomArchitecture() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.12, 0]}>
        <boxGeometry args={[10.4, 0.24, 8.4]} />
        <meshStandardMaterial color="#665044" roughness={0.88} />
      </mesh>
      <mesh receiveShadow position={[0, 3, -4.08]}>
        <boxGeometry args={[10.4, 6, 0.18]} />
        <meshStandardMaterial color="#c9c0b1" roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[-5.12, 3, 0]}>
        <boxGeometry args={[0.18, 6, 8.3]} />
        <meshStandardMaterial color="#a9a093" roughness={0.96} />
      </mesh>
      <mesh receiveShadow position={[5.12, 3, 0]}>
        <boxGeometry args={[0.18, 6, 8.3]} />
        <meshStandardMaterial color="#b8afa1" roughness={0.96} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.018, -0.1]}>
        <planeGeometry args={[9.5, 7.7]} />
        <meshStandardMaterial color="#755b4c" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.15, 0.034, 1.38]} receiveShadow>
        <planeGeometry args={[4.8, 2.45]} />
        <meshStandardMaterial color="#343b35" roughness={0.82} />
      </mesh>
      <mesh position={[0, 5.66, -4]}>
        <boxGeometry args={[10.1, 0.16, 0.12]} />
        <meshStandardMaterial color="#ede4d8" roughness={0.72} />
      </mesh>
    </group>
  );
}

function DeskSet({ onFocusMonitor }: { onFocusMonitor: (section?: string) => void }) {
  return (
    <group>
      <RoundedBox args={[5.25, 0.2, 2.06]} radius={0.09} smoothness={5} position={[0, 1.32, -1.05]} castShadow receiveShadow>
        <meshStandardMaterial color="#5a3527" roughness={0.56} metalness={0.03} />
      </RoundedBox>
      {[-2.25, 2.25].map((x) => (
        <RoundedBox key={x} args={[0.22, 1.32, 0.28]} radius={0.05} smoothness={3} position={[x, 0.65, -1.45]} castShadow>
          <meshStandardMaterial color="#3d251d" roughness={0.63} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.22, 1.32, 0.28]} radius={0.05} smoothness={3} position={[-2.25, 0.65, -0.55]} castShadow>
        <meshStandardMaterial color="#3d251d" roughness={0.63} />
      </RoundedBox>
      <RoundedBox args={[0.22, 1.32, 0.28]} radius={0.05} smoothness={3} position={[2.25, 0.65, -0.55]} castShadow>
        <meshStandardMaterial color="#3d251d" roughness={0.63} />
      </RoundedBox>
      <mesh
        position={[0, 1.36, -1.1]}
        rotation={[-Math.PI / 2, 0, 0]}
        onDoubleClick={(event) => {
          event.stopPropagation();
          onFocusMonitor("overview");
        }}
      >
        <planeGeometry args={[5, 1.9]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <DeskLamp />
    </group>
  );
}

function DeskLamp() {
  return (
    <group position={[-2.05, 1.42, -0.72]} rotation={[0, 0.18, 0]}>
      <mesh castShadow position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.08, 32]} />
        <meshStandardMaterial color="#202824" roughness={0.35} metalness={0.42} />
      </mesh>
      <mesh castShadow position={[0.05, 0.62, 0]} rotation={[0, 0, -0.18]}>
        <cylinderGeometry args={[0.045, 0.055, 1.2, 16]} />
        <meshStandardMaterial color="#27302b" roughness={0.35} metalness={0.45} />
      </mesh>
      <mesh castShadow position={[0.18, 1.25, 0.04]} rotation={[0.1, 0, 0.28]}>
        <coneGeometry args={[0.34, 0.55, 32, 1, true]} />
        <meshStandardMaterial color="#344039" roughness={0.42} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0.26, 1.15, 0.2]} intensity={14} distance={2.7} decay={2} color="#ffb56e" />
    </group>
  );
}

function Monitor({
  focused,
  section,
  onSectionChange,
  onFocus,
}: {
  focused: boolean;
  section: string;
  onSectionChange: (section: string) => void;
  onFocus: () => void;
}) {
  return (
    <group position={[0, 2.4, -1.42]} onClick={(event) => { event.stopPropagation(); onFocus(); }}>
      <InteractiveCursor />
      <RoundedBox args={[2.92, 1.78, 0.17]} radius={0.09} smoothness={6} castShadow>
        <meshStandardMaterial color="#161b19" roughness={0.25} metalness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.091]}>
        <planeGeometry args={[2.63, 1.48]} />
        <meshStandardMaterial color="#061312" emissive="#0b4545" emissiveIntensity={focused ? 0.54 : 0.28} roughness={0.28} />
      </mesh>
      <Html
        transform
        center
        position={[0, 0, 0.102]}
        scale={0.00328}
        style={{ pointerEvents: focused ? "auto" : "none" }}
      >
        <div className="monitor-html-surface">
          <MonitorUI focused={focused} activeSection={section} onSectionChange={onSectionChange} />
        </div>
      </Html>
      <RoundedBox args={[0.15, 0.65, 0.15]} radius={0.035} smoothness={3} position={[0, -1.18, -0.02]} castShadow>
        <meshStandardMaterial color="#222927" metalness={0.46} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[1.15, 0.09, 0.5]} radius={0.05} smoothness={4} position={[0, -1.48, 0.08]} castShadow>
        <meshStandardMaterial color="#1c2321" metalness={0.42} roughness={0.32} />
      </RoundedBox>
      <mesh position={[1.25, -0.79, 0.095]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#76dfc5" emissive="#76dfc5" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function WallBoard({ onClick }: { onClick: () => void }) {
  return (
    <group position={[-2.7, 3.55, -3.94]} onClick={(event) => { event.stopPropagation(); onClick(); }}>
      <InteractiveCursor />
      <RoundedBox args={[3.05, 1.62, 0.12]} radius={0.06} smoothness={4} castShadow>
        <meshStandardMaterial color="#403027" roughness={0.57} />
      </RoundedBox>
      <mesh position={[0, 0, 0.071]}>
        <planeGeometry args={[2.78, 1.35]} />
        <meshStandardMaterial color="#263c35" roughness={0.8} />
      </mesh>
      <Html transform center position={[0, 0, 0.083]} scale={0.0041} style={{ pointerEvents: "none" }}>
        <div className="board-writing">
          <small>LANGUAGE / LEARNING</small>
          <strong>TEACHING</strong>
          <span>YDT · YDS · READING · VOCABULARY</span>
        </div>
      </Html>
    </group>
  );
}

function AboutFrame({ onClick }: { onClick: () => void }) {
  return (
    <group position={[-4.25, 3.15, -3.91]} onClick={(event) => { event.stopPropagation(); onClick(); }}>
      <InteractiveCursor />
      <RoundedBox args={[1.0, 1.42, 0.11]} radius={0.035} smoothness={3} castShadow>
        <meshStandardMaterial color="#39291f" roughness={0.48} />
      </RoundedBox>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[0.82, 1.22]} />
        <meshStandardMaterial color="#d9cdbb" roughness={0.72} />
      </mesh>
      <Html transform center position={[0, 0, 0.078]} scale={0.004} style={{ pointerEvents: "none" }}>
        <div className="frame-monogram"><b>YY</b><span>ABOUT</span></div>
      </Html>
    </group>
  );
}

function Notebook({ onClick }: { onClick: () => void }) {
  return (
    <group position={[-1.25, 1.46, -0.43]} rotation={[-Math.PI / 2, 0, -0.05]} onClick={(event) => { event.stopPropagation(); onClick(); }}>
      <InteractiveCursor />
      <RoundedBox args={[1.0, 0.72, 0.045]} radius={0.035} smoothness={3} position={[-0.5, 0, 0]} castShadow>
        <meshStandardMaterial color="#e8dfcd" roughness={0.88} />
      </RoundedBox>
      <RoundedBox args={[1.0, 0.72, 0.045]} radius={0.035} smoothness={3} position={[0.5, 0, 0]} castShadow>
        <meshStandardMaterial color="#eee5d3" roughness={0.88} />
      </RoundedBox>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.025, 0.72, 0.04]} />
        <meshStandardMaterial color="#8d6c50" roughness={0.62} />
      </mesh>
    </group>
  );
}

function CreatorCamera({ onClick }: { onClick: () => void }) {
  return (
    <group position={[1.48, 1.61, -0.93]} rotation={[0, -0.35, 0]} onClick={(event) => { event.stopPropagation(); onClick(); }}>
      <InteractiveCursor />
      <RoundedBox args={[0.72, 0.48, 0.42]} radius={0.08} smoothness={4} castShadow>
        <meshStandardMaterial color="#1b211f" roughness={0.34} metalness={0.46} />
      </RoundedBox>
      <mesh position={[0, 0, 0.29]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.23, 0.2, 32]} />
        <meshStandardMaterial color="#111513" roughness={0.23} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.02, 32]} />
        <meshStandardMaterial color="#244b50" emissive="#1b6b77" emissiveIntensity={0.6} metalness={0.35} roughness={0.12} />
      </mesh>
      <mesh position={[-0.21, 0.3, 0]}>
        <boxGeometry args={[0.22, 0.13, 0.23]} />
        <meshStandardMaterial color="#262c29" metalness={0.38} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Microphone({ onClick }: { onClick: () => void }) {
  return (
    <group position={[2.05, 1.47, -0.35]} onClick={(event) => { event.stopPropagation(); onClick(); }}>
      <InteractiveCursor />
      <mesh castShadow position={[0, 0.47, 0]}>
        <capsuleGeometry args={[0.12, 0.3, 8, 16]} />
        <meshStandardMaterial color="#202725" metalness={0.52} roughness={0.32} />
      </mesh>
      <mesh castShadow position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.34, 12]} />
        <meshStandardMaterial color="#333b37" metalness={0.45} roughness={0.36} />
      </mesh>
      <mesh castShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.05, 24]} />
        <meshStandardMaterial color="#171c1a" metalness={0.46} roughness={0.34} />
      </mesh>
    </group>
  );
}

function Phone({ onClick }: { onClick: () => void }) {
  return (
    <group position={[2.12, 1.46, -1.43]} rotation={[-Math.PI / 2, 0, 0.16]} onClick={(event) => { event.stopPropagation(); onClick(); }}>
      <InteractiveCursor />
      <RoundedBox args={[0.42, 0.78, 0.07]} radius={0.08} smoothness={5} castShadow>
        <meshStandardMaterial color="#111716" metalness={0.4} roughness={0.22} />
      </RoundedBox>
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[0.35, 0.66]} />
        <meshStandardMaterial color="#0a292a" emissive="#166467" emissiveIntensity={0.45} roughness={0.2} />
      </mesh>
    </group>
  );
}

function AssetModel({
  url,
  position,
  rotation,
  scale,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} position={position} rotation={rotation ?? [0, 0, 0]} scale={scale ?? 1} />;
}

function InteractiveCursor() {
  return (
    <mesh
      visible={false}
      onPointerOver={() => { document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "default"; }}
    >
      <boxGeometry args={[0.01, 0.01, 0.01]} />
      <meshBasicMaterial />
    </mesh>
  );
}

Object.values(roomAssets).forEach((url) => useGLTF.preload(url));
