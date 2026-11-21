#!/usr/bin/env node
// scripts/verify-contrast.mjs
// Mathematical verification of OKLCH legacy tokens and Obsidian Nocturne v2
// sRGB relative luminance + WCAG 2.1 AA/AAA contrast ratios.

function oklchToRgb(L, C, h) {
  const hRad = (h * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const toGamma = (c) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055;

  const r = Math.min(255, Math.max(0, Math.round(toGamma(rLin) * 255)));
  const g = Math.min(255, Math.max(0, Math.round(toGamma(gLin) * 255)));
  const bR = Math.min(255, Math.max(0, Math.round(toGamma(bLin) * 255)));

  return [r, g, bR];
}

function hexToRgb(hex) {
  const c = parseInt(hex.replace('#', ''), 16);
  return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
}

function getLuminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const channel = v / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrast(rgb1, rgb2) {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function blend(fgRgb, bgRgb, alpha) {
  return [
    Math.round(fgRgb[0] * alpha + bgRgb[0] * (1 - alpha)),
    Math.round(fgRgb[1] * alpha + bgRgb[1] * (1 - alpha)),
    Math.round(fgRgb[2] * alpha + bgRgb[2] * (1 - alpha)),
  ];
}

const textMutedRgb = oklchToRgb(0.63, 0.005, 264);
const textSecondaryRgb = oklchToRgb(0.67, 0.005, 264);
const textPrimaryRgb = oklchToRgb(0.94, 0.007, 80);

console.log('=== LEGACY OKLCH COLOR VALUES ===');
console.log(
  'text-color-text-primary (oklch 94% 0.007 80):',
  textPrimaryRgb,
  'Hex: #' + textPrimaryRgb.map((x) => x.toString(16).padStart(2, '0')).join('')
);
console.log(
  'text-color-text-secondary (oklch 67% 0.005 264):',
  textSecondaryRgb,
  'Hex: #' + textSecondaryRgb.map((x) => x.toString(16).padStart(2, '0')).join('')
);
console.log(
  'text-color-text-muted (oklch 63% 0.005 264):',
  textMutedRgb,
  'Hex: #' + textMutedRgb.map((x) => x.toString(16).padStart(2, '0')).join('')
);

const legacyBackgrounds = [
  { name: 'Pure Black (#000000)', rgb: [0, 0, 0] },
  { name: '--brand-bg (#050607)', rgb: hexToRgb('#050607') },
  { name: '--chapter-ink (#06070a)', rgb: hexToRgb('#06070a') },
  { name: '--chapter-wash (#0c1320)', rgb: hexToRgb('#0c1320') },
  { name: '--color-bg oklch(6.5% 0.01 265)', rgb: oklchToRgb(0.065, 0.01, 265) },
  { name: '--color-surface oklch(9.5% 0.01 264)', rgb: oklchToRgb(0.095, 0.01, 264) },
  { name: '--color-surface-raised oklch(11.5% 0.011 264)', rgb: oklchToRgb(0.115, 0.011, 264) },
];

console.log('\n=== LEGACY CONTRAST EVALUATION: text-color-text-muted (100% vs 50% opacity) ===');
let allLegacyPass100 = true;
let allLegacyFail50 = true;

for (const bg of legacyBackgrounds) {
  const fullContrast = contrast(textMutedRgb, bg.rgb);
  const blended50Rgb = blend(textMutedRgb, bg.rgb, 0.5);
  const halfContrast = contrast(blended50Rgb, bg.rgb);

  const pass100 = fullContrast >= 4.5;
  const pass50 = halfContrast >= 4.5;

  if (!pass100) allLegacyPass100 = false;
  if (pass50) allLegacyFail50 = false;

  console.log(`\nBackground: ${bg.name} [RGB: ${bg.rgb.join(', ')}]`);
  console.log(
    `  Full 100% Opacity (Restored): ${fullContrast.toFixed(2)}:1 -> ${pass100 ? 'PASS (>= 4.5:1 WCAG AA)' : 'FAIL'}`
  );
  console.log(
    `  With opacity-50 (Previous):   ${halfContrast.toFixed(2)}:1 -> ${pass50 ? 'PASS' : 'FAIL (< 4.5:1 Violation)'}`
  );
}

// Obsidian Nocturne v2 — Hero & Identity Card production palette audit
const OBSIDIAN_BASE = hexToRgb('#08090C');
const OBSIDIAN_SURFACE = hexToRgb('#0E0E10');
const ACCENT_CYAN = hexToRgb('#00D9FF');
const ACCENT_CYAN_HOVER = hexToRgb('#7AEAFF');
const ACCENT_EMERALD = hexToRgb('#00FF66');
const WHITE = hexToRgb('#FFFFFF');
const ZINC_100 = hexToRgb('#F4F4F5');
const ZINC_200 = hexToRgb('#E4E4E7');
const ZINC_300 = hexToRgb('#D4D4D8');
const ZINC_400 = hexToRgb('#A1A1AA');

const obsidianChecks = [
  {
    label: 'Hero H1 / Card Heading (#FFFFFF on #08090C)',
    fg: WHITE,
    bg: OBSIDIAN_BASE,
    minRatio: 7.0,
  },
  {
    label: 'Identity Card Heading (#FFFFFF on #0E0E10)',
    fg: WHITE,
    bg: OBSIDIAN_SURFACE,
    minRatio: 7.0,
  },
  {
    label: 'Hero Primary CTA (#08090C on #00D9FF)',
    fg: OBSIDIAN_BASE,
    bg: ACCENT_CYAN,
    minRatio: 7.0,
  },
  {
    label: 'Hero Primary CTA Hover (#08090C on #7AEAFF)',
    fg: OBSIDIAN_BASE,
    bg: ACCENT_CYAN_HOVER,
    minRatio: 7.0,
  },
  {
    label: 'Engineering Profile Kicker / @Scardubu (#00D9FF on #0E0E10)',
    fg: ACCENT_CYAN,
    bg: OBSIDIAN_SURFACE,
    minRatio: 7.0,
  },
  {
    label: 'Identity Primary Copy CTA (#00D9FF on 10% cyan over #0E0E10)',
    fg: ACCENT_CYAN,
    bg: blend(ACCENT_CYAN, OBSIDIAN_SURFACE, 0.1),
    minRatio: 7.0,
  },
  {
    label: 'Identity Copied State CTA (#00FF66 on 10% emerald over #0E0E10)',
    fg: ACCENT_EMERALD,
    bg: blend(ACCENT_EMERALD, OBSIDIAN_SURFACE, 0.1),
    minRatio: 7.0,
  },
  {
    label: 'Identity CV.PDF Secondary CTA (zinc-200 on #08090C)',
    fg: ZINC_200,
    bg: OBSIDIAN_BASE,
    minRatio: 7.0,
  },
  {
    label: 'Capability Ledger Terms (zinc-100 on #08090C)',
    fg: ZINC_100,
    bg: OBSIDIAN_BASE,
    minRatio: 7.0,
  },
  {
    label: 'Domain Chips & Location Badge (zinc-300 on #08090C)',
    fg: ZINC_300,
    bg: OBSIDIAN_BASE,
    minRatio: 7.0,
  },
  {
    label: 'Quadrant Labels & Secondary Spec Copy (zinc-400 on #0E0E10)',
    fg: ZINC_400,
    bg: OBSIDIAN_SURFACE,
    minRatio: 4.5,
  },
];

console.log('\n=== OBSIDIAN NOCTURNE V2 — HERO & IDENTITY CARD CONTRAST MATRIX ===');
let allObsidianPass = true;

for (const check of obsidianChecks) {
  const ratio = contrast(check.fg, check.bg);
  const pass = ratio >= check.minRatio;
  if (!pass) allObsidianPass = false;
  const tier = ratio >= 7.0 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL';
  console.log(
    `  ${pass ? '✓' : '✕'} ${check.label}: ${ratio.toFixed(2)}:1 (min ${check.minRatio.toFixed(1)}:1, ${tier})`
  );
}

console.log('\n=== SUMMARY ===');
console.log('All legacy backgrounds pass >= 4.5:1 with opacity removed:', allLegacyPass100);
console.log('All legacy backgrounds failed < 4.5:1 when opacity-50 was applied:', allLegacyFail50);
console.log('All Obsidian Nocturne v2 Hero & Identity Card pairs pass WCAG thresholds:', allObsidianPass);

process.exit(allLegacyPass100 && allObsidianPass ? 0 : 1);
