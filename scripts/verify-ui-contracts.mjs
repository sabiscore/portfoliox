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

// V18 — Telemetry mode transitions are meaningful status changes. Announce
// that chip politely without making the frequently-changing heartbeat live.
const liveRegionStart = telemetry.indexOf('aria-live="polite"');
const liveRegionEnd =
  liveRegionStart >= 0 ? telemetry.indexOf('</span>', liveRegionStart) : -1;
const telemetryLiveRegion =
  liveRegionStart >= 0 && liveRegionEnd > liveRegionStart
    ? telemetry.slice(liveRegionStart, liveRegionEnd)
    : '';
requireContract(
  telemetryLiveRegion.includes('aria-atomic="true"') &&
    telemetryLiveRegion.includes('{telemetryMode}'),
  'V18: Telemetry mode must be announced through a polite, atomic live region.'
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

if (failures.length > 0) {
  console.error('\n━━━ UI CONTRACT VERIFICATION FAILED ━━━');
  for (const failure of failures) console.error(` ✕ ${failure}`);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(1);
}

console.log(' ✓ [verify-ui-contracts] V16–V19 rendering and accessibility contracts verified.');
