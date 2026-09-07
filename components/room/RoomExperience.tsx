"use client";

import { Canvas } from "@react-three/fiber";

export function RoomExperience() {
  return (
    <main className="language-room-shell">
      <Canvas camera={{ position: [4.8, 3.2, 6.6], fov: 42 }}>
        <color attach="background" args={["#090b0a"]} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} />
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#7f6650" />
        </mesh>
      </Canvas>
    </main>
  );
}
