#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT_DIR = process.cwd();

/**
 * Required App Router entrypoints and core component export contracts.
 * Enforces fail-closed verification before `next build` starts.
 */
const REQUIRED_FILES = [
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  'app/api/activity/latest/route.ts',
];

const COMPONENT_EXPORT_CONTRACTS = [
  {
    file: 'components/HeroSection.tsx',
    requiredSymbols: ['export function HeroSection', 'export default HeroSection'],
  },
  {
    file: 'components/IdentityCard.tsx',
    requiredSymbols: ['export function IdentityCard', 'export default IdentityCard'],
  },
  {
    file: 'components/ProjectsSection.tsx',
    requiredSymbols: ['export function ProjectsSection', 'export default ProjectsSection'],
  },
  {
    file: 'components/ProductionPatterns.tsx',
    requiredSymbols: [
      'export function ProductionPatterns',
      'export default ProductionPatterns',
    ],
  },
  {
    file: 'components/Liveactivitybar.tsx',
    requiredSymbols: [
      'export function LiveActivityBar',
      'export const Liveactivitybar',
      'export default LiveActivityBar',
    ],
  },
  {
    file: 'components/DeferredHeroEnhancements.tsx',
    requiredSymbols: [
      'export function DeferredHeroEnhancements',
      'export default DeferredHeroEnhancements',
    ],
  },
  {
    file: 'components/GradientMeshMotion.tsx',
    requiredSymbols: [
      'export function GradientMeshMotion',
      'export default GradientMeshMotion',
    ],
  },
  {
    file: 'components/Navbar.tsx',
    requiredSymbols: ['export function Navbar', 'export default Navbar'],
  },
  {
    file: 'components/ContactSection.tsx',
    requiredSymbols: ['export function ContactSection', 'export default ContactSection'],
  },
  {
    file: 'components/Footer.tsx',
    requiredSymbols: ['export function Footer', 'export default Footer'],
  },
];

function verifyRepositoryIntegrity() {
  const errors = [];

  // 1. Ensure legacy Pages Router does not conflict with App Router
  const legacyPagesDir = path.join(ROOT_DIR, 'pages');
  if (fs.existsSync(legacyPagesDir)) {
    errors.push(
      '[FAIL-CLOSED] Legacy `pages/` directory detected. Remove `pages/` to prevent Next.js App Router conflicts.'
    );
  }

  // 2. Verify required App Router files exist
  for (const relativePath of REQUIRED_FILES) {
    const fullPath = path.join(ROOT_DIR, relativePath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`[FAIL-CLOSED] Missing required App Router file: ${relativePath}`);
    }
  }

  // 3. Verify component export contracts & prevent accidental copy-paste collisions
  for (const contract of COMPONENT_EXPORT_CONTRACTS) {
    const fullPath = path.join(ROOT_DIR, contract.file);
    if (!fs.existsSync(fullPath)) {
      errors.push(`[FAIL-CLOSED] Missing required component file: ${contract.file}`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    for (const symbol of contract.requiredSymbols) {
      if (!content.includes(symbol)) {
        errors.push(
          `[FAIL-CLOSED] Contract violation in ${contract.file}: missing expected export "${symbol}".`
        );
      }
    }
  }

  // 4. Verify ProjectsSection.tsx and ProductionPatterns.tsx are distinct modules
  const projectsPath = path.join(ROOT_DIR, 'components/ProjectsSection.tsx');
  const patternsPath = path.join(ROOT_DIR, 'components/ProductionPatterns.tsx');
  if (fs.existsSync(projectsPath) && fs.existsSync(patternsPath)) {
    const projectsSource = fs.readFileSync(projectsPath, 'utf8').trim();
    const patternsSource = fs.readFileSync(patternsPath, 'utf8').trim();
    if (projectsSource === patternsSource) {
      errors.push(
        '[FAIL-CLOSED] Duplicate file collision: components/ProductionPatterns.tsx has identical content to components/ProjectsSection.tsx.'
      );
    }
  }

  if (errors.length > 0) {
    console.error('\n━━━ PREBUILD VERIFICATION FAILED ━━━');
    for (const err of errors) {
      console.error(` ✕ ${err}`);
    }
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  }

  console.log(
    ' ✓ [verify-app-router] All App Router routes and component export contracts verified.'
  );
}

verifyRepositoryIntegrity();
