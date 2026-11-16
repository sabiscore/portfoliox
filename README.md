# scardubu.dev // Principal Engineering Portfolio & Systems Ledger

> Systems you can trust at 2 AM. Staff backend, platform, and AI infrastructure engineered for strict resource bounds, deterministic recovery, and high availability.

---

## Architecture & Visual Design System

`scardubu.dev` operates under the **Obsidian Nocturne v2** visual interface design system, optimized for OLED displays, crisp telemetry parsing, and high-contrast accessibility:

* **Base Canvas**: Strict OLED black (`#08090C`)[span_3](start_span)[span_3](end_span).
* **Elevated Surfaces**: Structural cards and telemetry modules (`#0E0E10`, `#14161B`)[span_4](start_span)[span_4](end_span).
* **Accents**: Electric cyan (`#00D9FF`) for interactive telemetry and borders; emerald green (`#00FF66`) for primary CTAs and verified production states[span_5](start_span)[span_5](end_span).
* **Typography**: `Space Grotesk` for headings and prose; `JetBrains Mono` (`tabular-nums`) for commit hashes, telemetry coordinates, and metadata pills[span_6](start_span)[span_6](end_span).
* **Styling Principles**: Zero soft drop shadows; structural `1px` hairlines (`#1F222A`) with top-edge gradient illumination[span_7](start_span)[span_7](end_span).

---

## Core Subsystems & Production Evidence

1. **TaxBridge (`/work/taxbridge`)**: Replay-safe SME tax compliance and invoice reconciliation engine powered by Fastify 5, PostgreSQL 15 Row-Level Security (RLS), BullMQ, and hash-linked cryptographic audit trails[span_8](start_span)[span_8](end_span).
2. **SabiScore (`/work/sabiscore` / `sabiscore.app`)**: Institutional-grade football forecasting and market comparison engine executing out-of-core Polars/DuckDB pipelines under a strict `<512MB` RAM container ceiling with sub-150ms p99 inference[span_9](start_span)[span_9](end_span).
3. **SwarmXQ & The Yap Engine (`/work/swarmxq`)**: Fault-tolerant multi-agent DAG orchestrator with local LLM routing and Kokoro TTS audio generation on CPU-constrained nodes[span_10](start_span)[span_10](end_span).

---

## Local Development & Verification

### Prerequisites
* Node.js 20+ / pnpm 9+
* Linux workstation (HP EliteBook 850 G3 environment or equivalent)[span_11](start_span)[span_11](end_span)

### Quickstart
```bash
# Clone the repository
git clone [https://github.com/Scardubu/portfoliox.git](https://github.com/Scardubu/portfoliox.git)
cd portfoliox

# Install dependencies
pnpm install

# Run type checking & design system lint gates
pnpm run typecheck
pnpm run lint

# Start local development server
pnpm run dev
