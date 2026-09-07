export type RoomSection = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  link?: { label: string; href: string };
};

export const roomSections: RoomSection[] = [
  {
    id: "teaching",
    label: "Teaching",
    eyebrow: "English Teacher",
    title: "Teaching, exam preparation and language learning",
    description:
      "A workspace for classroom practice, YDT/YDS preparation, reading, vocabulary and project-based language learning.",
    bullets: [
      "English teaching and exam preparation",
      "Original reading, vocabulary and worksheet materials",
      "Language-learning projects and classroom resources",
    ],
  },
  {
    id: "translation",
    label: "Translation",
    eyebrow: "Translator / Language Work",
    title: "Translation, editing and localization",
    description:
      "English–Turkish language work with an emphasis on natural phrasing, terminology consistency and context-aware localization.",
    bullets: [
      "EN ↔ TR translation",
      "Editing and proofreading",
      "Terminology and localization workflows",
    ],
  },
  {
    id: "squadindex",
    label: "Squad Index",
    eyebrow: "Product in development",
    title: "A football data and intelligence platform",
    description:
      "Squad Index is being developed as a football data platform combining structured datasets, normalization, analytics and player-value intelligence.",
    bullets: [
      "Football data normalization and canonical entities",
      "Player, club and competition intelligence",
      "Analytics, valuation and news-oriented product layers",
    ],
  },
  {
    id: "reflect",
    label: "Reflect & Shoot",
    eyebrow: "Creative Project",
    title: "Reflect and Shoot",
    description:
      "A creative competition and storytelling project built around reflection, visual expression and short-form filmmaking.",
    bullets: [
      "Creative storytelling",
      "Short-film and visual production",
      "Competition and community format",
    ],
    link: { label: "Visit reflectandshoot.com", href: "https://reflectandshoot.com" },
  },
  {
    id: "youtube",
    label: "YouTube",
    eyebrow: "Media",
    title: "Long-form ideas, football and education",
    description:
      "A video channel for analysis, commentary and projects. Featured videos and series will live here once the channel feed is connected.",
    bullets: ["Video essays and analysis", "Football content", "Education and project updates"],
  },
  {
    id: "x",
    label: "X / Twitter",
    eyebrow: "Short-form publishing",
    title: "Notes, analysis and ongoing work",
    description:
      "A live stream of shorter ideas, football analysis, project notes and public work. Selected posts can be embedded here later.",
    bullets: ["Football analysis", "Project notes", "Short-form commentary"],
  },
  {
    id: "library",
    label: "Library",
    eyebrow: "Resources",
    title: "Books, materials and useful resources",
    description:
      "A growing shelf for teaching materials, articles, reading lists, downloadable resources and selected work.",
    bullets: ["Teaching resources", "Reading lists", "Articles and downloadable material"],
  },
  {
    id: "about",
    label: "About",
    eyebrow: "Profile",
    title: "Teacher, translator and builder",
    description:
      "A multidisciplinary profile combining English teaching, language work, digital products, football analysis and creative projects.",
    bullets: ["English teaching", "Translation and language work", "Digital products and media projects"],
  },
];

export const sectionById = Object.fromEntries(
  roomSections.map((section) => [section.id, section]),
) as Record<string, RoomSection>;
