# Language Room — Design Direction

## Art direction

Premium stylized realism: a warm study / creative workspace with believable depth, materials and lighting, but without chasing photorealism. The room should feel authored and personal rather than like a generic 3D template.

The visual tension is warm physical space versus cool digital screen light. Wood, paper, dark green, muted plaster and brass/warm light belong to the room. Mint/cyan is reserved for the digital layer and interactive states.

## Typography

Use a characterful editorial serif for large identity statements and a clean contemporary sans for navigation and interface text. Avoid generic dashboard typography and avoid putting every piece of information inside rounded cards.

## Motion

Motion must explain space. The most important animation is the camera move from room view to monitor view. Secondary motion includes restrained pointer parallax, screen glow, particles/dust, UI transitions and subtle object feedback. Avoid constant floating/bouncing that makes the room feel like a demo scene.

## UI inside the monitor

The monitor has its own bespoke interface. It is not Windows, macOS or a copy of a desktop operating system. It should feel like a personal creative workstation: editorial composition, strong typography, thin dividers, dense but readable information and subtle technical details.

## 3D rules

- Real 3D geometry or GLB assets for furniture and important physical objects.
- Do not recreate furniture with flat CSS illustrations.
- Keep the monitor custom-built so the screen dimensions and camera alignment remain deterministic.
- Prefer coherent asset families over mixing unrelated visual styles.
- Use physically plausible shadows and restrained post-processing.
- Keep scene scale consistent and keep interactive targets obvious through composition, light and cursor feedback rather than floating labels everywhere.

## Quality bar

Every change should be judged against three questions: does it deepen the feeling of being inside a room, does it make the visitor understand the work faster, and does it look intentionally designed rather than AI-generated or template-derived?
