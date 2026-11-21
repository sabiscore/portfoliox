#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const read = (file) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');
const failures = [];

function requireContract(condition, message) {
  if (!condition) failures.push(message);
}

const layout = read('app/layout.tsx');
const gradient = read('components/GradientMeshMotion.tsx');
const globalStyles = read('app/globals.css');
const telemetry = read('components/Liveactivitybar.tsx');
const blogWidget = read('components/BlogProgressWidget.tsx');
const navbar = read('components/Navbar.tsx');
const hero = read('components/HeroSection.tsx');
const identityCard = read('components/IdentityCard.tsx');
const identityMotion = read('components/IdentityCardMotion.tsx');
const identityStyles = read('components/identityCardStyles.ts');
const copyEmail = read('components/CopyEmail.tsx');
const portraitShader = read('components/cinematic/HeroPortraitShader.tsx');
const projects = read('components/ProjectsSection.tsx');
const skills = read('components/SkillsSection.tsx');
const contact = read('components/ContactSection.tsx');
const footer = read('components/Footer.tsx');
const commandPalette = read('components/CommandPalette.tsx');

// V16 — GPU compositing and strict containment must be attached to the
// full-viewport decorative layer, not merely mentioned in documentation.
requireContract(
  gradient.includes('gradient-mesh-motion') &&
    /\.gradient-mesh-motion\s*\{[^}]*contain:\s*strict;[^}]*transform:\s*translateZ\(0\);/s.test(
      globalStyles
    ),
  'V16: GradientMeshMotion must use the strict-containment, GPU-composited CSS layer.'
);

// V17 — Ensure the browser gets the dark native control/color-scheme hint from
// the server-rendered root document.
requireContract(
  /<meta\s+name="color-scheme"\s+content="dark"\s*\/>/.test(layout),
  'V17: Root layout must declare the dark color scheme.'
);

// V18 — Selecting an architecture record must announce the changed summary
// politely. This is content navigation, not a live operational status feed.
requireContract(
  /aria-live="polite"[\s\S]{0,180}aria-atomic="true"/.test(telemetry) &&
    telemetry.includes('{activeNode.architectureSummary}') &&
    telemetry.includes('Project snapshots from the written engineering record'),
  'V18: Architecture selection must update an accessible polite live region and disclose that the panel is not live telemetry.'
);

// V19 — The related-content dismiss control must remain a real 44px touch
// target and continue to dismiss its panel.
const dismissLabel = 'aria-label="Close suggestions"';
const dismissLabelIndex = blogWidget.indexOf(dismissLabel);
const dismissButtonStart =
  dismissLabelIndex >= 0 ? blogWidget.lastIndexOf('<button', dismissLabelIndex) : -1;
const dismissButtonEnd =
  dismissLabelIndex >= 0 ? blogWidget.indexOf('</button>', dismissLabelIndex) : -1;
const dismissButton =
  dismissButtonStart >= 0 && dismissButtonEnd > dismissButtonStart
    ? blogWidget.slice(dismissButtonStart, dismissButtonEnd)
    : '';
requireContract(
  dismissButton.includes(dismissLabel) &&
    dismissButton.includes('min-h-[44px]') &&
    dismissButton.includes('min-w-[44px]') &&
    dismissButton.includes('setShowSuggestions(false)'),
  'V19: Blog suggestion dismissal must be accessible, functional, and at least 44px in both dimensions.'
);

// V20 — Identity Card editorial portrait must use oscar-headshot.jpg with
// explicit 4:5 dimensions, responsive sizes, priority loading, and dark scrim.
requireContract(
  identityCard.includes("const PORTRAIT_ASSET_PATH = '/images/oscar-headshot.jpg';") &&
    identityCard.includes('const PORTRAIT_WIDTH = 240;') &&
    identityCard.includes('const PORTRAIT_HEIGHT = 300;') &&
    identityCard.includes('sizes={PORTRAIT_SIZES}') &&
    identityCard.includes('priority') &&
    identityCard.includes('identity-portrait-scrim') &&
    /\.identity-portrait-scrim\s*\{/.test(globalStyles),
  'V20: IdentityCard portrait must render oscar-headshot.jpg in a 240x300 (4:5) frame with dark-surface scrim integration.'
);

// V21 — 2x2 capability ledger must maintain symmetrical 3-term quadrants
// aligned with docs/claim-ledger.md.
const ledgerMatch = hero.match(/const CAPABILITY_LEDGER[\s\S]*?\] as const;/);
const ledgerBlock = ledgerMatch ? ledgerMatch[0] : '';
const quadrantTermArrays = [...ledgerBlock.matchAll(/terms:\s*\[([^\]]+)\]/g)];
const allQuadrantsHaveThreeTerms =
  quadrantTermArrays.length === 4 &&
  quadrantTermArrays.every(
    (match) => match[1].split(',').filter((t) => t.trim().length > 0).length === 3
  );

requireContract(
  allQuadrantsHaveThreeTerms && ledgerBlock.includes("'Local GGUF'"),
  'V21: HeroSection CAPABILITY_LEDGER must expose exactly 4 quadrants with 3 balanced terms each (including Local GGUF).'
);

// V22 — Identity Card footer must pair primary CopyEmail action with canonical
// CV_ASSET_PATH link, both at >= 44px touch targets with polite status feedback.
requireContract(
  identityCard.includes('<CopyEmail') &&
    identityCard.includes('variant="primary"') &&
    identityCard.includes('href={CV_ASSET_PATH}') &&
    identityCard.includes('role="status"') &&
    identityCard.includes('aria-live="polite"') &&
    copyEmail.includes('min-h-touch') &&
    identityStyles.includes('min-h-touch min-w-touch'),
  'V22: IdentityCard footer must pair primary CopyEmail and canonical CV_ASSET_PATH controls with >= 44px touch targets and polite status feedback.'
);

// V23 — Upgraded Phase 1 + Phase 2 surface files must not introduce arbitrary
// Tailwind bracket syntax (enforced alongside ESLint AST rules).
const tokenScopedFiles = [
  ['components/Navbar.tsx', navbar],
  ['components/HeroSection.tsx', hero],
  ['components/IdentityCard.tsx', identityCard],
  ['components/IdentityCardMotion.tsx', identityMotion],
  ['components/identityCardStyles.ts', identityStyles],
  ['components/CopyEmail.tsx', copyEmail],
  ['components/cinematic/HeroPortraitShader.tsx', portraitShader],
  ['components/ProjectsSection.tsx', projects],
  ['components/SkillsSection.tsx', skills],
  ['components/Liveactivitybar.tsx', telemetry],
  ['components/ContactSection.tsx', contact],
  ['components/Footer.tsx', footer],
  ['components/CommandPalette.tsx', commandPalette],
];
const arbitraryClassRegex =
  /\b(?:bg|text|border|min-h|min-w|max-w|grid-cols|aspect|tracking|shadow|transition|z|p|px|py|m|mt|mb|gap|rounded|w|h)-\[[^\]]+\]/;

for (const [filePath, source] of tokenScopedFiles) {
  requireContract(
    !arbitraryClassRegex.test(source),
    `V23: ${filePath} contains disallowed arbitrary Tailwind bracket utilities.`
  );
}

// V24 — Portrait WebGL shader must stay dynamically loaded (ssr: false) and
// gated behind desktop fine-pointer + reduced-motion checks.
requireContract(
  identityCard.includes('ssr: false') &&
    identityCard.includes('(min-width: 1024px) and (pointer: fine)') &&
    identityCard.includes('(prefers-reduced-motion: reduce)') &&
    portraitShader.includes('(prefers-reduced-motion: reduce)'),
  'V24: HeroPortraitShader must remain client-only (ssr: false) and gated for desktop fine-pointer and reduced-motion users.'
);

// V25 — Phase 2 cohesion surfaces must not reference dead legacy tokens or
// low-contrast zinc-500 text, and CommandPalette must stay synced with STATIC_PALETTE_ITEMS.
const deadLegacyTokenRegex =
  /\b(?:obsidian-border|obsidian-text|obsidian-muted|obsidian-dim|obsidian-elevated|bg-illuminate-cyan|text-caption|tracking-telemetry)\b/;

requireContract(
  !deadLegacyTokenRegex.test(skills) &&
    !deadLegacyTokenRegex.test(commandPalette) &&
    !telemetry.includes('text-zinc-500') &&
    commandPalette.includes('STATIC_PALETTE_ITEMS') &&
    commandPalette.includes('min-h-touch min-w-touch'),
  'V25: SkillsSection, Liveactivitybar, and CommandPalette must use live Obsidian Nocturne v2 tokens, WCAG AA+ contrast, and >= 44px touch targets.'
);

if (failures.length > 0) {
  console.error('\n━━━ UI CONTRACT VERIFICATION FAILED ━━━');
  for (const failure of failures) console.error(` ✕ ${failure}`);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(1);
}

console.log(
  ' ✓ [verify-ui-contracts] V16–V25 rendering, geometry, token, and accessibility contracts verified.'
);
