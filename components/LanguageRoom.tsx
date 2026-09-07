"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export type RoomView = "room" | "monitor";

const RoomCanvas = dynamic(
  () => import("@/components/room/RoomCanvas").then((module) => module.RoomCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="room-loading" role="status">
        <span className="room-loading-dot" />
        <span>Preparing the room</span>
      </div>
    ),
  },
);

export function LanguageRoom() {
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<RoomView>("room");
  const [section, setSection] = useState("overview");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (view === "monitor") {
        setView("room");
        return;
      }
      if (entered) setEntered(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [entered, view]);

  const focusMonitor = (nextSection = "overview") => {
    setSection(nextSection);
    setView("monitor");
  };

  return (
    <main className="language-room-shell">
      <RoomCanvas
        active={entered}
        view={view}
        section={section}
        onSectionChange={setSection}
        onFocusMonitor={focusMonitor}
        onReturnToRoom={() => setView("room")}
      />

      <AnimatePresence>
        {!entered ? (
          <motion.section
            className="entry-layer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="entry-vignette" />
            <motion.div
              className="entry-copy"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="entry-kicker">Yunus Emre Yılmaz</p>
              <h1>
                Language <em>Room</em>
              </h1>
              <p className="entry-role">English teacher · translator · builder</p>
              <button
                className="entry-button"
                onClick={() => {
                  setEntered(true);
                  setView("room");
                }}
              >
                <span>Enter the room</span>
                <span aria-hidden="true">↗</span>
              </button>
            </motion.div>
            <p className="entry-note">An interactive workspace for teaching, language, data and creative work.</p>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {entered && view === "room" ? (
          <motion.div
            className="room-hud"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.45, duration: 0.45 }}
          >
            <div className="room-hud-brand">
              <span>YY</span>
              <div>
                <strong>Language Room</strong>
                <small>Move the pointer. Select an object.</small>
              </div>
            </div>
            <button className="room-exit" onClick={() => setEntered(false)}>
              Exit
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {entered && view === "monitor" ? (
          <motion.button
            className="monitor-back"
            onClick={() => setView("room")}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ delay: 0.35 }}
          >
            <span aria-hidden="true">←</span> Back to room
          </motion.button>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
