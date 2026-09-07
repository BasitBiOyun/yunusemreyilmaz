"use client";

import { CameraControls, RoundedBox } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { CameraControls as CameraControlsType } from "camera-controls";
import { roomSections } from "@/data/content";

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
  const [section, setSection] = useState("overview");

  return (
    <main className="language-room-shell">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: ROOM_VIEW.position, fov: 42, near: 0.1, far: 60 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <RoomScene
          entered={entered}
          focused={focused}
          onFocus={(next = "overview") => {
            setSection(next);
            setFocused(true);
          }}
        />
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
        <>
          <MonitorOverlay section={section} onSectionChange={setSection} />
          <button className="monitor-back" onClick={() => setFocused(false)}><span aria-hidden="true">←</span> Back to room</button>
        </>
      ) : null}
    </main>
  );
}

function MonitorOverlay({ section, onSectionChange }: { section: string; onSectionChange: (section: string) => void }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const syncScale = () => {
      const widthScale = (window.innerWidth * 0.7) / 800;
      const heightScale = (window.innerHeight * 0.76) / 450;
      setScale(Math.min(widthScale, heightScale));
    };

    syncScale();
    window.addEventListener("resize", syncScale);
    return () => window.removeEventListener("resize", syncScale);
  }, []);

  return (
    <div className="monitor-focus-shell" aria-label="Portfolio computer screen">
      <div className="monitor-focus-position">
        <div className="monitor-focus-scale" style={{ transform: `scale(${scale})` }}>
          <MonitorWorkspace section={section} onSectionChange={onSectionChange} />
        </div>
      </div>
    </div>
  );
}

function RoomScene({ entered, focused, onFocus }: {
  entered: boolean;
  focused: boolean;
  onFocus: (section?: string) => void;
}) {
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
      <Monitor focused={focused} onFocus={() => onFocus("overview")} />
      <DeskLamp />
      <WallBoard onClick={() => onFocus("teaching")} />
      <ContactObjects onFocus={onFocus} />
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
    <group
      position={[0, 2.38, -1.42]}
      onClick={(event) => { event.stopPropagation(); onFocus(); }}
      onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "default"; }}
    >
      <RoundedBox args={[2.92, 1.78, 0.18]} radius={0.09} smoothness={6} castShadow><meshStandardMaterial color="#151a18" roughness={0.25} metalness={0.52} /></RoundedBox>
      <mesh position={[0, 0, 0.095]}><planeGeometry args={[2.62, 1.47]} /><meshStandardMaterial color="#061514" emissive="#0f6568" emissiveIntensity={focused ? 0.75 : 0.38} roughness={0.24} /></mesh>
      <RoundedBox args={[0.15, 0.65, 0.15]} radius={0.035} smoothness={3} position={[0, -1.18, -0.03]} castShadow><meshStandardMaterial color="#222826" metalness={0.5} roughness={0.3} /></RoundedBox>
      <RoundedBox args={[1.14, 0.09, 0.5]} radius={0.05} smoothness={4} position={[0, -1.48, 0.07]} castShadow><meshStandardMaterial color="#1b211f" metalness={0.46} roughness={0.31} /></RoundedBox>
      <mesh position={[1.25, -0.79, 0.1]}><sphereGeometry args={[0.024, 16, 16]} /><meshStandardMaterial color="#78ddc6" emissive="#78ddc6" emissiveIntensity={3} /></mesh>
    </group>
  );
}

function MonitorWorkspace({ section, onSectionChange }: { section: string; onSectionChange: (section: string) => void }) {
  const nav = [
    ["overview", "Desk"], ["teaching", "Teaching"], ["translation", "Translation"], ["projects", "Projects"], ["media", "Media"], ["about", "About"],
  ] as const;

  return (
    <div className="monitor-html-surface">
      <div className="monitor-os">
        <aside className="monitor-sidebar">
          <div className="monitor-logo">YY</div>
          <nav>
            {nav.map(([id, label]) => <button key={id} className={section === id ? "is-active" : ""} onClick={() => onSectionChange(id)}><b>{label.slice(0, 1)}</b><span>{label}</span></button>)}
          </nav>
          <div className="monitor-sidebar-foot"><i /> online</div>
        </aside>
        <section className="monitor-workspace">
          <header className="monitor-topbar"><div><span>workspace</span><strong>yunus emre yılmaz</strong></div><div className="monitor-top-status">EN · TR</div></header>
          <div className="monitor-content"><ScreenContent section={section} onSectionChange={onSectionChange} /></div>
        </section>
        <div className="monitor-glare" /><div className="monitor-scanline" />
      </div>
    </div>
  );
}

function ScreenContent({ section, onSectionChange }: { section: string; onSectionChange: (section: string) => void }) {
  if (section === "overview") {
    return <div className="screen-overview"><div className="screen-eyebrow">THE WORKING DESK</div><h2>Language, teaching,<br />data <em>&</em> stories.</h2><p className="screen-lead">English teacher and translator building educational, football-data and creative projects.</p><div className="screen-overview-links"><button onClick={() => onSectionChange("teaching")}><span>01</span> Teaching <b>↗</b></button><button onClick={() => onSectionChange("translation")}><span>02</span> Translation <b>↗</b></button><button onClick={() => onSectionChange("projects")}><span>03</span> Projects <b>↗</b></button></div><div className="screen-marquee">YDT / YDS · EN ↔ TR · SQUAD INDEX · REFLECT & SHOOT · MEDIA · LANGUAGE LEARNING</div></div>;
  }

  if (section === "teaching" || section === "translation") {
    const data = roomSections.find((item) => item.id === section);
    if (!data) return null;
    return <div className="screen-editorial"><div className="screen-section-number">{section === "teaching" ? "01" : "02"}</div><div><div className="screen-eyebrow">{data.eyebrow.toUpperCase()}</div><h2>{data.title}</h2><p>{data.description}</p></div><div className="screen-editorial-list">{data.bullets.map((bullet, index) => <div key={bullet}><span>0{index + 1}</span><strong>{bullet}</strong></div>)}</div></div>;
  }

  if (section === "projects") {
    const squad = roomSections.find((item) => item.id === "squadindex");
    const reflect = roomSections.find((item) => item.id === "reflect");
    return <div className="screen-projects"><div className="screen-eyebrow">SELECTED PROJECTS</div><h2>Things being built.</h2><div className="project-row project-row-squad"><div className="project-symbol">SI</div><div><span>FOOTBALL DATA / PRODUCT</span><h3>Squad Index</h3><p>{squad?.description}</p></div><b>IN DEVELOPMENT</b></div><a className="project-row project-row-reflect" href="https://reflectandshoot.com" target="_blank" rel="noreferrer"><div className="project-symbol">R&S</div><div><span>CREATIVE / FILM</span><h3>Reflect & Shoot</h3><p>{reflect?.description}</p></div><b>↗</b></a></div>;
  }

  if (section === "media") {
    return <div className="screen-media"><div className="screen-eyebrow">MEDIA DESK</div><h2>Analysis in public.</h2><div className="media-lines"><div><b>▶</b><span>YOUTUBE</span><strong>Long-form analysis, football and education.</strong><small>Channel link will be connected here.</small></div><div><b>@</b><span>X / TWITTER</span><strong>Football analysis, notes and ongoing work.</strong><small>Profile link will be connected here.</small></div></div></div>;
  }

  const about = roomSections.find((item) => item.id === "about");
  return <div className="screen-about"><div className="screen-about-monogram">Y<br />Y</div><div><div className="screen-eyebrow">ABOUT</div><h2>Teacher. Translator. Builder.</h2><p>{about?.description}</p><div className="about-tags"><span>English teaching</span><span>EN ↔ TR</span><span>Digital products</span><span>Learning resources</span></div></div></div>;
}

function DeskLamp() {
  return <group position={[-2.05, 1.42, -0.67]}><mesh castShadow position={[0, 0.04, 0]}><cylinderGeometry args={[0.28, 0.33, 0.08, 28]} /><meshStandardMaterial color="#202724" roughness={0.35} metalness={0.42} /></mesh><mesh castShadow position={[0.06, 0.62, 0]} rotation={[0, 0, -0.18]}><cylinderGeometry args={[0.042, 0.052, 1.2, 16]} /><meshStandardMaterial color="#28312d" roughness={0.35} metalness={0.44} /></mesh><mesh castShadow position={[0.2, 1.24, 0.05]} rotation={[0.12, 0, 0.28]}><coneGeometry args={[0.33, 0.54, 28, 1, true]} /><meshStandardMaterial color="#36413b" roughness={0.42} side={2} /></mesh></group>;
}

function WallBoard({ onClick }: { onClick: () => void }) {
  return <group position={[-2.75, 3.55, -3.92]} onClick={(event) => { event.stopPropagation(); onClick(); }} onPointerOver={() => { document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = "default"; }}><RoundedBox args={[3.1, 1.62, 0.12]} radius={0.05} smoothness={4} castShadow><meshStandardMaterial color="#3f3027" roughness={0.58} /></RoundedBox><mesh position={[0, 0, 0.07]}><planeGeometry args={[2.82, 1.34]} /><meshStandardMaterial color="#263d35" roughness={0.82} /></mesh></group>;
}

function ContactObjects({ onFocus }: { onFocus: (section?: string) => void }) {
  return <group><RoundedBox args={[0.95, 1.36, 0.1]} radius={0.035} smoothness={3} position={[-4.3, 3.15, -3.9]} castShadow onClick={() => onFocus("about")}><meshStandardMaterial color="#49362a" roughness={0.5} /></RoundedBox><RoundedBox args={[1.8, 0.08, 0.72]} radius={0.04} smoothness={3} position={[-0.95, 1.47, -0.46]} rotation={[0, 0.08, 0]} castShadow onClick={() => onFocus("translation")}><meshStandardMaterial color="#dfd5c3" roughness={0.88} /></RoundedBox><RoundedBox args={[0.68, 0.46, 0.4]} radius={0.07} smoothness={4} position={[1.45, 1.63, -0.88]} rotation={[0, -0.34, 0]} castShadow onClick={() => onFocus("projects")}><meshStandardMaterial color="#1b211f" roughness={0.34} metalness={0.46} /></RoundedBox><RoundedBox args={[0.38, 0.72, 0.07]} radius={0.07} smoothness={4} position={[2.02, 1.48, -1.43]} rotation={[0, 0.16, 0]} castShadow onClick={() => onFocus("media")}><meshStandardMaterial color="#111716" roughness={0.25} metalness={0.38} /></RoundedBox></group>;
}
