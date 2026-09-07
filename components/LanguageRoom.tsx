"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { roomSections, sectionById } from "@/data/content";

const objects = [
  { id: "teaching", className: "whiteboard", label: "Teaching" },
  { id: "translation", className: "notebook", label: "Translation" },
  { id: "squadindex", className: "laptop", label: "Squad Index" },
  { id: "reflect", className: "camera", label: "Reflect & Shoot" },
  { id: "youtube", className: "microphone", label: "YouTube" },
  { id: "x", className: "phone", label: "X / Twitter" },
  { id: "library", className: "bookshelf", label: "Library" },
  { id: "about", className: "frame", label: "About" },
] as const;

export function LanguageRoom() {
  const [entered, setEntered] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeSection = useMemo(() => (activeId ? sectionById[activeId] : null), [activeId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="site-shell">
      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.section
            key="intro"
            className="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            <div className="intro-grain" />
            <motion.div
              className="intro-card"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.55 }}
            >
              <p className="eyebrow">Language Room</p>
              <h1>Yunus Emre Yılmaz</h1>
              <p className="intro-role">English Teacher · Translator · Builder</p>
              <p className="intro-copy">
                Teaching, language work, football data, media and creative projects gathered in one working room.
              </p>
              <button className="enter-button" onClick={() => setEntered(true)}>
                Enter the room
                <span aria-hidden="true">↗</span>
              </button>
            </motion.div>
            <div className="intro-footer">A personal workspace, not a conventional portfolio.</div>
          </motion.section>
        ) : (
          <motion.section
            key="room"
            className="room-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <header className="room-header">
              <div>
                <span className="room-kicker">Yunus Emre Yılmaz</span>
                <strong>Language Room</strong>
              </div>
              <button className="reset-button" onClick={() => setEntered(false)}>
                Exit room
              </button>
            </header>

            <div className="room-stage-wrap">
              <motion.div
                className="room-stage"
                initial={{ scale: 1.025, y: 8 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              >
                <div className="room-light" />
                <div className="wall-shadow" />
                <div className="floor" />
                <div className="desk" />
                <div className="desk-edge" />
                <div className="lamp">
                  <span className="lamp-head" />
                  <span className="lamp-neck" />
                  <span className="lamp-base" />
                  <span className="lamp-glow" />
                </div>

                {objects.map((object, index) => (
                  <motion.button
                    key={object.id}
                    className={`room-object ${object.className}`}
                    onClick={() => setActiveId(object.id)}
                    aria-label={`Open ${object.label}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.045 }}
                    whileHover={{ y: -4, scale: 1.025 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    <span className="object-art" aria-hidden="true" />
                    <span className="object-label">{object.label}</span>
                  </motion.button>
                ))}

                <div className="room-note note-one">teach · translate · build</div>
                <div className="room-note note-two">ideas in progress</div>
                <div className="rug" />
              </motion.div>
            </div>

            <div className="mobile-sections" aria-label="Portfolio sections">
              {roomSections.map((section) => (
                <button key={section.id} onClick={() => setActiveId(section.id)}>
                  <span>{section.eyebrow}</span>
                  <strong>{section.label}</strong>
                </button>
              ))}
            </div>

            <p className="room-hint">Select an object in the room to explore the work behind it.</p>

            <AnimatePresence>
              {activeSection ? (
                <motion.div
                  className="panel-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onMouseDown={(event) => {
                    if (event.currentTarget === event.target) setActiveId(null);
                  }}
                >
                  <motion.aside
                    className="detail-panel"
                    initial={{ x: 48, opacity: 0, scale: 0.98 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 48, opacity: 0, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  >
                    <button className="panel-close" onClick={() => setActiveId(null)} aria-label="Close panel">
                      ×
                    </button>
                    <p className="panel-eyebrow">{activeSection.eyebrow}</p>
                    <h2>{activeSection.title}</h2>
                    <p className="panel-description">{activeSection.description}</p>
                    <div className="panel-rule" />
                    <ul>
                      {activeSection.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    {activeSection.link ? (
                      <a href={activeSection.link.href} target="_blank" rel="noreferrer" className="panel-link">
                        {activeSection.link.label} <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="panel-coming">More detailed content will be added here.</span>
                    )}
                  </motion.aside>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
