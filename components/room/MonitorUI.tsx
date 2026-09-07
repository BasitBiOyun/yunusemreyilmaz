"use client";

import {
  ArrowUpRight,
  AtSign,
  BookOpenText,
  Clapperboard,
  Database,
  GraduationCap,
  Languages,
  Layers3,
  Radio,
  UserRound,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { roomSections } from "@/data/content";

const nav = [
  { id: "overview", label: "Desk", icon: Layers3 },
  { id: "teaching", label: "Teaching", icon: GraduationCap },
  { id: "translation", label: "Translation", icon: Languages },
  { id: "projects", label: "Projects", icon: Database },
  { id: "media", label: "Media", icon: Radio },
  { id: "about", label: "About", icon: UserRound },
] as const;

function findSection(id: string) {
  return roomSections.find((item) => item.id === id);
}

export function MonitorUI({
  focused,
  activeSection,
  onSectionChange,
}: {
  focused: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
}) {
  if (!focused) {
    return (
      <div className="monitor-idle" aria-hidden="true">
        <div className="monitor-idle-grid" />
        <div className="monitor-idle-mark">YY</div>
        <p>LANGUAGE ROOM</p>
        <span>click the screen to enter</span>
      </div>
    );
  }

  return (
    <div className="monitor-os" onPointerDown={(event) => event.stopPropagation()}>
      <aside className="monitor-sidebar">
        <div className="monitor-logo">YY</div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            const selected = activeSection === item.id;
            return (
              <button
                key={item.id}
                className={selected ? "is-active" : ""}
                onClick={() => onSectionChange(item.id)}
                aria-label={item.label}
              >
                <Icon size={19} strokeWidth={1.7} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="monitor-sidebar-foot">
          <i /> online
        </div>
      </aside>

      <section className="monitor-workspace">
        <header className="monitor-topbar">
          <div>
            <span>workspace</span>
            <strong>yunus emre yılmaz</strong>
          </div>
          <div className="monitor-top-status">EN · TR</div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            className="monitor-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <ScreenContent section={activeSection} onSectionChange={onSectionChange} />
          </motion.div>
        </AnimatePresence>
      </section>
      <div className="monitor-glare" />
      <div className="monitor-scanline" />
    </div>
  );
}

function ScreenContent({
  section,
  onSectionChange,
}: {
  section: string;
  onSectionChange: (section: string) => void;
}) {
  if (section === "overview") {
    return (
      <div className="screen-overview">
        <div className="screen-eyebrow">THE WORKING DESK</div>
        <h2>
          Language, teaching,
          <br />data <em>&</em> stories.
        </h2>
        <p className="screen-lead">
          English teacher and translator building educational, football-data and creative projects.
        </p>
        <div className="screen-overview-links">
          <button onClick={() => onSectionChange("teaching")}>
            <span>01</span> Teaching <ArrowUpRight size={17} />
          </button>
          <button onClick={() => onSectionChange("translation")}>
            <span>02</span> Translation <ArrowUpRight size={17} />
          </button>
          <button onClick={() => onSectionChange("projects")}>
            <span>03</span> Projects <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="screen-marquee" aria-hidden="true">
          YDT / YDS · EN ↔ TR · SQUAD INDEX · REFLECT & SHOOT · MEDIA · LANGUAGE LEARNING
        </div>
      </div>
    );
  }

  if (section === "teaching" || section === "translation") {
    const data = findSection(section);
    if (!data) return null;
    return (
      <div className="screen-editorial">
        <div className="screen-section-number">{section === "teaching" ? "01" : "02"}</div>
        <div>
          <div className="screen-eyebrow">{data.eyebrow.toUpperCase()}</div>
          <h2>{data.title}</h2>
          <p>{data.description}</p>
        </div>
        <div className="screen-editorial-list">
          {data.bullets.map((bullet, index) => (
            <div key={bullet}>
              <span>0{index + 1}</span>
              <strong>{bullet}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === "projects") {
    const squad = findSection("squadindex");
    const reflect = findSection("reflect");
    return (
      <div className="screen-projects">
        <div className="screen-eyebrow">SELECTED PROJECTS</div>
        <h2>Things being built.</h2>
        <div className="project-row project-row-squad">
          <div className="project-symbol"><Database size={28} /></div>
          <div>
            <span>FOOTBALL DATA / PRODUCT</span>
            <h3>Squad Index</h3>
            <p>{squad?.description}</p>
          </div>
          <b>IN DEVELOPMENT</b>
        </div>
        <a
          className="project-row project-row-reflect"
          href="https://reflectandshoot.com"
          target="_blank"
          rel="noreferrer"
        >
          <div className="project-symbol"><Clapperboard size={28} /></div>
          <div>
            <span>CREATIVE / FILM</span>
            <h3>Reflect & Shoot</h3>
            <p>{reflect?.description}</p>
          </div>
          <ArrowUpRight size={22} />
        </a>
      </div>
    );
  }

  if (section === "media") {
    return (
      <div className="screen-media">
        <div className="screen-eyebrow">MEDIA DESK</div>
        <h2>Analysis in public.</h2>
        <div className="media-lines">
          <div>
            <Youtube size={30} />
            <span>YOUTUBE</span>
            <strong>Long-form analysis, football and education.</strong>
            <small>Channel link will be connected here.</small>
          </div>
          <div>
            <AtSign size={30} />
            <span>X / TWITTER</span>
            <strong>Football analysis, notes and ongoing work.</strong>
            <small>Profile link will be connected here.</small>
          </div>
        </div>
      </div>
    );
  }

  const about = findSection("about");
  return (
    <div className="screen-about">
      <div className="screen-about-monogram">Y<br />Y</div>
      <div>
        <div className="screen-eyebrow">ABOUT</div>
        <h2>Teacher. Translator. Builder.</h2>
        <p>{about?.description}</p>
        <div className="about-tags">
          <span><GraduationCap size={15} /> English teaching</span>
          <span><Languages size={15} /> EN ↔ TR</span>
          <span><Database size={15} /> Digital products</span>
          <span><BookOpenText size={15} /> Learning resources</span>
        </div>
      </div>
    </div>
  );
}
