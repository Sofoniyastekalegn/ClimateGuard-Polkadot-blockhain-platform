[10 tools called]

Here’s a full replacement README you can drop into `project/README.md`:

```
# ClimateGuard COP30 Voting Platform

ClimateGuard is a decentralized voting and transparency layer for COP30 stakeholders. Delegates from 30 nations can monitor climate KPIs, review nationally backed green initiatives, and cast on-chain votes secured by Polkadot. The interface is built with React, TypeScript, Vite, Tailwind, and the Polkadot API stack, with MetaMask-friendly patterns to keep the door open for future DOT/EVM interoperability.

## Why It Matters

- Aligns global climate negotiations with verifiable, tamper-proof governance
- Tracks each country’s emission targets, renewable penetration, EV adoption, and flagship projects
- Records proposal outcomes immutably, so citizens and observers can audit COP30 progress in real time

## Architecture at a Glance

- **Frontend:** React 18 + TypeScript + Vite + Tailwind for fast UI iteration
- **Wallet Layer:** `@polkadot/extension-dapp` + `@polkadot/react-identicon` for SubWallet/Polkadot.js; MetaMask-compatible abstractions planned for DOT↔EVM bridges
- **Blockchain API:** `polkadot-api` to prepare DOT transactions
- **Data Plane:** Supabase (`@supabase/supabase-js`) hosts the `climate_metrics`, `climate_proposals`, `countries`, and `green_projects` tables defined in `supabase/migrations/20251017192929_create_climate_tables.sql`
- **UI Icons & Motion:** `lucide-react` plus custom Tailwind animations

## Core Features

- **Delegated Voting:** Proposal cards show live tallies, deadlines, and status; voters sign once per proposal and results sync back through Supabase and Polkadot.
- **Wallet-Gated Actions:** The `WalletConnect` menu lists Polkadot accounts with identicons, enforces one vote per address, and persists the chosen account in `localStorage`.
- **Country Intelligence:** The `Countries` view surfaces emission targets, renewable shares, EV adoption, forest coverage, carbon offsets, and green project portfolios for 30 COP nations.
- **Real-Time Climate KPIs:** `Dashboard` renders Supabase metrics with trend-aware styling so users can distinguish positive vs. negative movements instantly.
- **Resilient UX:** Loading skeletons, optimistic progress bars, and responsive layouts ensure usability on desktop and mobile.

## Project Structure

```
project/
├─ src/
│  ├─ components/
│  │  ├─ Dashboard.tsx      # KPI grid fed by Supabase climate_metrics
│  │  ├─ Voting.tsx         # Proposal list, wallet-gated voting, tally bars
│  │  ├─ Countries.tsx      # Country insights + green projects accordion
│  │  └─ WalletConnect.tsx  # Account picker + connect/disconnect UX
│  ├─ contexts/WalletContext.tsx  # Polkadot extension lifecycle handling
│  ├─ lib/supabase.ts       # Typed Supabase client + table interfaces
│  ├─ App.tsx               # Navigation shell (Dashboard/Voting/Countries)
│  └─ main.tsx, index.css   # Vite entry point and global styles
├─ supabase/migrations/…    # Schema for metrics, proposals, countries, projects
├─ package.json             # Scripts + dependency graph
└─ README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ (Vite 5 support)
- npm 9+ (or pnpm/yarn if you prefer)
- Polkadot.js Extension or SubWallet (Chrome/Firefox)
- MetaMask (optional today; required once DOT↔EVM bridge work lands)

### Installation

```bash
cd project
cp .env.example .env   # create if it does not exist
# populate the variables listed below
npm install
npm run dev
```

Vite boots on `http://localhost:5173` by default.

### Required Environment Variables

Create `project/.env`:

```
VITE_SUPABASE_URL=https://<your-supabase-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

Without these, `src/lib/supabase.ts` throws `Missing Supabase environment variables`.

### Available Scripts

- `npm run dev` – start Vite + Tailwind in development mode
- `npm run build` – type-check and bundle for production
- `npm run preview` – locally preview the production build
- `npm run lint` – run ESLint (React + TypeScript rules)
- `npm run typecheck` – `tsc --noEmit` against `tsconfig.app.json`

## Data & Voting Flow

1. **Metrics ingestion:** Populate Supabase tables via SQL in `supabase/migrations/...` or the Supabase studio.
2. **Wallet connect:** Users click *Connect Wallet* → `web3Enable('ClimateGuard')` registers the dApp → accounts hydrate into context.
3. **Casting votes:** `Voting.tsx` blocks duplicates per account using a `voted_<address>` token in `localStorage`. On each vote, Supabase is updated and (in production) the same transaction payload can be relayed to the Polkadot relay chain. MetaMask support will reuse the same payload builder once DOT assets are mirrored on EVM chains.
4. **Auditing:** All delegates see proposal badges (active/passed/rejected), tallies, and days remaining, ensuring COP30 transparency.

## Security & Compliance

- No secrets committed; Supabase keys must be injected at build time.
- Wallet state lives only in-memory + `localStorage` (address reference).
- Votes are rate-limited per address; server-side/on-chain validation must still be enforced when wiring the smart contract.
- When MetaMask support is enabled, ensure EOA signatures match the expected domain separator before relaying.

## Roadmap

- Bring-your-own smart contract module for Polkadot parachains
- MetaMask/EVM bridge so DOT-backed votes can mirror on Ethereum rollups
- Off-chain worker that reconciles Supabase tallies with on-chain events
- Analytics widgets for carbon finance (offset markets, SDG impact)

## Contributing

1. Fork & branch (`feat/<something>`).
2. Run `npm run lint && npm run typecheck` before raising PRs.
3. Include Supabase migration files for any schema updates.
4. Document new wallet providers or chains in this README.

---

Drop this markdown into `project/README.md`, commit, and you’ll have a professional, self-explanatory landing document for the ClimateGuard COP30 voting system. Let me know if you’d like a skeleton `.env.example` or Supabase seed scripts next.