# Portfolio Credentials, Light Theme, and Academic Projects Design

**Date:** 2026-08-14
**Status:** Approved visual direction; awaiting written-spec review
**Selected concept:** [Editorial credential-led design](https://p.superdesign.dev/draft/dcef2559-8f59-435c-98df-23e36497dc13)

## Purpose

Update Jezreel Ramos's single-page portfolio so its visual default is light mode, visitors can switch to a fully authored dark mode, credentials use the supplied badge and certificate evidence, current projects use the supplied screenshots and stronger descriptions, and four additional academic projects receive a distinct editorial section.

The page must remain evidence-led, accessible, and easy for recruiters to scan. The existing JZRL terminal identity, command palette, GitHub integration, project explorer, and responsive structure remain part of the product.

## Approved visual direction

The selected design is the editorial credential-led concept:

- Credentials appear as wide, single-column evidence panels rather than a dense two-column card grid.
- A credential's badge and certificate preview are visible at the same time. The certificate preview is not replaced by a document icon or text-only button.
- Certificate-only credentials use the full evidence width rather than reserving an empty badge column.
- The current/featured project explorer remains focused on the strongest projects.
- “Other Academic Projects” is a separate section with alternating screenshot-and-description rows.
- Light mode is the default. The navigation includes a compact sun/moon toggle for dark mode.

The canvas draft's overall composition is authoritative, but the implementation strengthens one original requirement: every certificate panel must contain a real preview of the supplied PDF/image. The canvas's text-only “View Certificate” area is insufficient on its own.

## Theme architecture

### Theme behavior

- The initial theme is light when no saved preference exists, regardless of operating-system preference.
- Selecting dark or light mode persists the explicit choice in `localStorage`.
- The root `html` element receives or removes the `dark` class before React renders to avoid a theme flash.
- The theme toggle exposes an accessible label that describes the action: “Switch to dark mode” or “Switch to light mode.”
- The toggle remains visible in desktop navigation and in the mobile navigation controls.

### Theme tokens

Tailwind semantic colors must resolve through CSS custom properties so the same component classes work in both modes. Light and dark modes define page, panel, secondary panel, border, main text, muted text, subtle text, primary, accent, amber, green, and rose tokens.

Light mode uses cool off-white page backgrounds, white panels, slate typography, and restrained blue/violet accents. Dark mode restores the portfolio's existing Tokyo Night-inspired near-black surfaces and lighter cyan/violet accents.

The hero terminal remains dark in light mode as a deliberate focal element. All other surfaces, overlays, project cards, credential panels, floating links, charts, form fields, and command-palette states must have explicit light and dark styling.

## Credential content model

Each credential record supports:

- `title`
- `issuer`
- exact `issued` date where the source provides one
- optional `credentialId`
- optional external verification `url`
- optional `badge` image
- required `certificate` PDF/image for all supplied credentials
- `certificatePreview` image used for a fast, consistent inline preview
- evidence-grounded `description`
- concise `skills`

Public filenames must be URL-safe: lowercase ASCII slugs with hyphens and no smart quotes, ampersands, repeated spaces, or parentheses. Source originals in the user-provided folders remain untouched.

## Credential presentation

Each wide credential panel contains:

1. An evidence area.
   - Credentials with a badge show the badge in a fixed side rail and the certificate preview in the dominant adjacent pane.
   - Credentials without a badge show the certificate preview across the full panel width.
   - The preview preserves the certificate's landscape/portrait aspect ratio inside a neutral frame.
   - Clicking the preview opens the original PDF/image in a new tab.
2. A title and issuer/date row.
3. An evidence-grounded description.
4. Skill tags.
5. Optional credential ID and external “Verify official record” link.

The section displays two wide credential panels per page to retain the selected editorial scale and avoid loading every certificate at once. Pagination scrolls back to the section heading and remains keyboard accessible.

Certificate preview images are derived from the supplied first pages. They are presentation assets only; the original PDF remains the linked source of truth.

## Credential metadata corrections

Descriptions must not claim topics that are absent from the supplied evidence.

- **Introduction to Modern AI — Cisco Networking Academy:** issued June 18, 2026. Describe AI/ML basics, photo classification and computer vision concepts, machine translation limitations, LLM fundamentals, prompting, chatbot use cases, multi-agent collaboration, tool-using LLMs, and multimodal prompting.
- **Apply AI: Update Your Resume — Cisco Networking Academy:** issued June 19, 2026. Describe redacting private information before using public AI tools; selecting workflows that balance privacy, accuracy, and speed; extracting accomplishments from source documents; writing evidence-based resume bullets; combining LLM self-checks with human validation; organizing ATS-friendly skills; producing styled PDFs; and tailoring resumes to job requirements.
- **Data Science Essentials with Python — Cisco Networking Academy:** issued June 16, 2026. Describe importing Python libraries and CSV data into DataFrames; using `eval()`, `query()`, and `groupby()`; left-merging DataFrames; selecting columns, handling missing values, and converting data types; plotting with Matplotlib; readable bar/scatter/line charts; fitting and interpreting basic linear models; and forming and testing hypotheses.
- **Data Analytics Essentials — Cisco Networking Academy:** issued June 9, 2026. Describe the analytics process, data characteristics and acquisition, transformation, basic statistics and preparation, hands-on work with Excel/SQL/Tableau, and portfolio evaluation.
- **AI-Powered Future: Mastering Prompt Engineering in Generative AI — DICT Region V:** attended September 6, 2025. Display course code `DICTR5:2025-W-MPEG-1` and control number `2025-IBWEB1146` in the credential metadata.
- **4-hour Webinar on Data Privacy Awareness — DICT Region XI:** attended September 10, 2025; hosted by the Davao del Sur Provincial Office.
- **Java Software Engineering I — CodeChum:** issued December 9, 2025; CMSC 309 Software Engineering 1, A.Y. 2025–2026, BSCS3A; score 400/431.
- **Are your s3crets safe? Fortifying Your Arsenal Against AWS Bucket Breaches — GC Bitbarkada:** completed October 1, 2025. Do not claim AWS Secrets Manager, IAM, environment isolation, or DevSecOps topics that the certificate does not state.
- **Integrated OS – Be More Digi-TALINO — Integrated Office Solutions, Inc.:** participated September 5, 2025. Topics stated by the certificate are productivity apps, digital communication, smart research, and data safety/security.
- **AI-Driven Software Development: From Wireframe to App – with a Focus on Security and Assurance — Computer Science Society Organization:** participated December 3, 2025 at Laguna State Polytechnic University, Santa Cruz Campus.
- **Hour of Code — AI Ready ASEAN Programme:** participated August 25, 2025 in three hours of Zoom training. Implemented by Break the Fake Movement with the ASEAN Foundation, supported by Google.org and DICT Aurora.

## Current and featured projects

The existing keyboard-operable vertical explorer remains the presentation for current/featured projects. Its project set excludes the four new “Other Academic Projects.”

Supplied project screenshots are used for:

- OSCA-AgeSense
- Findify Mobile
- Findify Web
- Educational RMS
- 404 DreamTeam / PropertyAI
- SBCC Management System

SBCC uses the public-site screenshot as its primary image. The supplied admin screenshot is not displayed in this change because adding a multi-image gallery would expand the project explorer beyond the requested scope.

Descriptions stay concrete and identify the problem, audience, major features, and verified stack. Existing source/demo links and live GitHub metadata remain intact.

## Other Academic Projects

A new `OtherAcademicProjects` section appears immediately after the featured project explorer and before the broader GitHub repository section.

Desktop rows alternate screenshot placement left and right. Mobile rows stack screenshot above copy. Every row includes:

- screenshot
- category label
- project title
- concise description
- technology tags

### VogueVista

A fashion e-commerce webpage created with HTML, CSS, and JavaScript. The screenshot supports product navigation, service highlights, promotional pricing, and a responsive product grid. Avoid claiming backend commerce, authentication, or real payment processing.

### ResumeAnalyzerTkinter

A Python desktop application built with Tkinter to compare resumes with job requirements using NLP and datasets. The screenshot supports resume upload, job-title/industry inputs, match scoring, profile matching, requirement analysis, keyword analysis, visualizations, and dataset management.

### Jez_OS

A web-based operating-system simulation built with JavaScript and Vue. The screenshot supports a desktop interface with terminal, file tools, notes, settings, system utilities, browser, store, diagnostics, and basic games. Avoid claiming unverified implementation details such as resizable windows unless confirmed by source code.

### YouGames

A browser game collection built with HTML, CSS, and JavaScript. The screenshot supports searchable game cards and titles including Tic-Tac-Toe, Snake, Tile Twister, Fruit Catch, Minesweeper, and Classic Snake, with difficulty labels.

## Component boundaries

- `useTheme`: owns the current theme, persistence, root-class synchronization, and toggle action.
- `ThemeToggle`: renders the accessible sun/moon control and receives theme state/action.
- `CredentialEvidence`: renders badge and certificate preview combinations without owning pagination or metadata.
- `Certifications`: owns credential pagination and composes editorial evidence panels.
- `OtherAcademicProjects`: renders the alternating four-project section from configuration data.
- Project and credential configuration remain data-driven; presentation components do not contain project-specific branching.

These components remain small enough to understand independently and match the repository's existing component organization.

## Asset flow

1. Supplied source files remain in `portfolio-credentials/` and `project-images/`.
2. URL-safe public copies live under `public/credentials/` and `public/project-images/`.
3. Credential configuration references the public badge, preview, certificate, and verification URLs.
4. Project configuration references public screenshot URLs.
5. Vite copies public assets unchanged into the production build.

Missing preview assets must degrade to a labeled certificate link without breaking the rest of the card. Missing project screenshots must preserve readable project copy and alt text. Broken source/demo/verification URLs remain hidden when their corresponding configuration value is absent.

## Accessibility and responsive behavior

- Theme toggle, pagination, project tabs, certificate previews, verification links, and project links are keyboard reachable.
- Focus styles meet contrast requirements in both themes.
- Certificate preview alt text names the exact credential.
- Badges use credential-specific alt text rather than generic “badge.”
- Decorative icons remain hidden from assistive technology.
- Wide evidence panels collapse to a vertical mobile layout without horizontal scrolling.
- Alternating academic rows become a consistent screenshot-first stack on mobile.
- Existing reduced-motion behavior remains intact.

## Testing and verification

Automated tests cover:

- light is the default without stored state
- a stored dark preference is restored
- theme toggle changes the root class and persisted value
- theme toggle accessible labels update
- a Cisco credential displays both badge and certificate preview
- a certificate-only credential displays its preview without an empty badge rail
- certificate preview links point to the supplied public certificate
- credential pagination uses the editorial page size
- the four academic projects render in their dedicated section
- academic projects are absent from the featured explorer configuration
- supplied project screenshots render with specific alt text
- corrected certificate issuers, dates, and titles are present in configuration

Verification includes the full Vitest suite, a production Vite build, a scan for broken local asset references, and browser checks at desktop and mobile widths in both themes.

## Out of scope

- A new route or separate credential detail page
- Server-side theme persistence
- Editing the content of supplied certificates or badges
- Adding unprovided project repository/demo links
- Refactoring unrelated GitHub data-fetching or command-palette behavior
