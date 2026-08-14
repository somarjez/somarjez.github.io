# Jezreel Ramos Portfolio Design System

## Product and audience

This is a single-page portfolio for recruiters, hiring managers, collaborators, and technical peers. The first scan must establish Jezreel as a Data Analyst, Web Developer, Project Management practitioner, and AI/ML builder, then support those claims with project screenshots, GitHub evidence, badges, and certificates.

## Design direction

- Preserve the established terminal/developer identity: JZRL terminal-tile logo, mono details, command palette, terminal hero, precise evidence-led copy.
- Default to light mode. Use a cool off-white page, white evidence cards, navy/slate typography, and restrained blue/violet accents.
- Keep the hero terminal intentionally dark in light mode so it remains the visual anchor.
- Provide a compact sun/moon toggle in the fixed navigation. Dark mode must be a fully authored theme, not a filter or inversion.
- Avoid decorative glass, gradient text, generic template styling, and excess motion.

## Color tokens

### Light mode

- Page: `#f0f4f8`
- Panel: `#ffffff`
- Panel secondary: `#f5f7fa`
- Line: `#dde3ee`
- Strong line: `#c8d2e3`
- Main text: `#1e293b`
- Muted text: `#64748b`
- Subtle text: `#94a3b8`
- Primary blue: `#1976d2`
- Primary hover: `#1565c0`
- Accent violet: `#7c3aed`
- Amber: `#b45309`
- Green: `#15803d`
- Rose: `#be123c`

### Dark mode

- Page: `#0a0e14`
- Panel: `#0d1117`
- Panel secondary: `#11161f`
- Line: `#1f2937`
- Strong line: `#334155`
- Main text: `#f1f5f9`
- Muted text: `#94a3b8`
- Subtle text: `#64748b`
- Primary blue: `#7dcfff`
- Primary hover: `#9bdcff`
- Accent violet: `#bb9af7`
- Amber: `#e0af68`
- Green: `#9ece6a`
- Rose: `#f7768e`

All body text and controls must meet WCAG AA contrast in both themes.

## Typography

- Display: Space Grotesk, then Inter, sans-serif.
- Body: Inter, system-ui, sans-serif.
- Technical metadata: JetBrains Mono, monospace.
- Section headings: 30–36px, bold, compact tracking.
- Card titles: 18–22px, bold.
- Body copy: 14–16px, 1.6 line height, maximum readable width around 65 characters.

## Layout and spacing

- Maximum content width: 72rem (`max-w-6xl`).
- Horizontal gutter: 1.25rem; increase naturally on wider screens.
- Section padding: 4rem mobile, 6rem desktop.
- Use an 8px spacing rhythm.
- Cards use 12–16px radii, 1px borders, and subtle elevation.
- Desktop credential grid: two columns, four credentials per page.
- Mobile credential cards stack badge above certificate preview and metadata.

## Components

### Navigation and theme toggle

- Fixed translucent navigation with JZRL logo, section links, command-palette button, and a compact icon-only theme toggle.
- The toggle has an explicit accessible label (`Switch to dark mode` / `Switch to light mode`) and a visible focus ring.
- Light is the initial default when no preference has been stored. A user selection persists in `localStorage`.

### Credential card

- The visual evidence area appears first.
- When a badge exists, show the square badge and the landscape certificate preview at the same time, side by side.
- The certificate preview is always an actual preview, never only a document icon. The whole preview links to the source PDF/image in a new tab.
- Credentials without badges use the full card width for the certificate preview.
- Under the evidence: title, issuer, exact issued date, optional credential ID, grounded description, skill tags, and optional external verification link.
- Use four cards per page to keep certificate previews large enough to read.

### Current projects

- Preserve the existing keyboard-operable vertical project explorer for the strongest/current projects.
- Use supplied screenshots as wide, top-aligned previews.
- Keep concrete descriptions, tech tags, source links, demos, live star counts, and thesis status.

### Other Academic Projects

- New section immediately after current/featured projects.
- Four responsive screenshot cards for VogueVista, ResumeAnalyzerTkinter, Jez_OS, and YouGames.
- Desktop: two-column grid. Mobile: one column.
- Each card includes screenshot, project name, category, concise description grounded in the supplied screenshot/user notes, and technology tags.
- These projects are not mixed into the current-project explorer.

## Content requirements

- Credential titles, issuers, dates, and descriptions must match the supplied PDFs/images.
- Correct the AWS credential to GC Bitbarkada, October 1, 2025, and its exact bucket-breach title.
- Correct Integrated OS to Integrated Office Solutions, Inc., September 5, 2025, and describe only the stated digital-literacy topics.
- Correct the AI-Driven Software Development seminar to the Computer Science Society Organization at LSPU Santa Cruz, December 3, 2025, including its security-and-assurance focus.
- Retain all supplied credential PDFs/images and project screenshots under public assets with URL-safe filenames.

## Motion and accessibility

- Keep reveal transitions concise and purposeful.
- Disable non-essential motion under `prefers-reduced-motion: reduce`.
- All project tabs, pagination, theme controls, certificate links, and navigation must be keyboard accessible.
- Decorative artwork is hidden from assistive technology; evidence images use specific alt text.
- Mobile layouts must not require horizontal scrolling.
