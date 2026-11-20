// scripts/verify-contrast.mjs
// Precise mathematical verification of OKLCH colors, sRGB relative luminance, and WCAG 2.1 contrast ratios

function oklchToRgb(L, C, h) {
  // Convert OKLCH to OKLab
  const hRad = (h * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLab to linear LMS
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  // LMS to linear RGB
  let rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Linear to sRGB
  const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055);

  let r = Math.min(255, Math.max(0, Math.round(toGamma(rLin) * 255)));
  let g = Math.min(255, Math.max(0, Math.round(toGamma(gLin) * 255)));
  let bR = Math.min(255, Math.max(0, Math.round(toGamma(bLin) * 255)));

  return [r, g, bR];
}

function hexToRgb(hex) {
  const c = parseInt(hex.replace('#', ''), 16);
  return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
}

function getLuminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
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
    Math.round(fgRgb[2] * alpha + bgRgb[2] * (1 - alpha))
  ];
}

const textMutedRgb = oklchToRgb(0.63, 0.005, 264);
const textSecondaryRgb = oklchToRgb(0.67, 0.005, 264);
const textPrimaryRgb = oklchToRgb(0.94, 0.007, 80);

console.log('=== COLOR VALUES ===');
console.log('text-color-text-primary (oklch 94% 0.007 80):', textPrimaryRgb, 'Hex: #' + textPrimaryRgb.map(x => x.toString(16).padStart(2, '0')).join(''));
console.log('text-color-text-secondary (oklch 67% 0.005 264):', textSecondaryRgb, 'Hex: #' + textSecondaryRgb.map(x => x.toString(16).padStart(2, '0')).join(''));
console.log('text-color-text-muted (oklch 63% 0.005 264):', textMutedRgb, 'Hex: #' + textMutedRgb.map(x => x.toString(16).padStart(2, '0')).join(''));

const backgrounds = [
  { name: 'Pure Black (#000000)', rgb: [0, 0, 0] },
  { name: '--brand-bg (#050607)', rgb: hexToRgb('#050607') },
  { name: '--chapter-ink (#06070a)', rgb: hexToRgb('#06070a') },
  { name: '--chapter-wash (#0c1320)', rgb: hexToRgb('#0c1320') },
  { name: '--color-bg oklch(6.5% 0.01 265)', rgb: oklchToRgb(0.065, 0.01, 265) },
  { name: '--color-surface oklch(9.5% 0.01 264)', rgb: oklchToRgb(0.095, 0.01, 264) },
  { name: '--color-surface-raised oklch(11.5% 0.011 264)', rgb: oklchToRgb(0.115, 0.011, 264) },
];

console.log('\n=== CONTRAST EVALUATION: text-color-text-muted (100% vs 50% opacity) ===');
let allPass100 = true;
let allFail50 = true;

for (const bg of backgrounds) {
  const fullContrast = contrast(textMutedRgb, bg.rgb);
  const blended50Rgb = blend(textMutedRgb, bg.rgb, 0.5);
  const halfContrast = contrast(blended50Rgb, bg.rgb);
  
  const pass100 = fullContrast >= 4.5;
  const pass50 = halfContrast >= 4.5;
  
  if (!pass100) allPass100 = false;
  if (pass50) allFail50 = false;

  console.log(`\nBackground: ${bg.name} [RGB: ${bg.rgb.join(', ')}]`);
  console.log(`  Full 100% Opacity (Restored): ${fullContrast.toFixed(2)}:1 -> ${pass100 ? 'PASS (>= 4.5:1 WCAG AA)' : 'FAIL'}`);
  console.log(`  With opacity-50 (Previous):   ${halfContrast.toFixed(2)}:1 -> ${pass50 ? 'PASS' : 'FAIL (< 4.5:1 Violation)'}`);
}

console.log('\n=== SUMMARY ===');
console.log('All backgrounds pass >= 4.5:1 with opacity removed:', allPass100);
console.log('All backgrounds failed < 4.5:1 when opacity-50 was applied:', allFail50);

process.exit(allPass100 ? 0 : 1);
