# CLAUDE.md — Vantage

## What this is
Vantage is a Progressive Web App that gives Indian students and their families the key details and blind spots they miss when considering foreign higher education. It is **purely informational, never recommendatory**. It does not rank colleges — it compares the education, career, and life outcomes of pursuing a **specific degree across 8 countries**.

The user flow: pick your degree → explore five components: (1) Career & Visa Landscape scatter plot, (2) Student Life Index with personal weight sliders, (3) Emerging Destinations, (4) Post-Study Pathway Timeline, (5) True-Cost View.

## Non-negotiable rules
1. **NEVER invent data.** All country/degree data lives in `/src/data/*.json`. Where real values are not yet provided, use schema-valid placeholder values and mark them `"confidence": "placeholder"`. The UI must render a visible "Sample data" badge when confidence is placeholder. Do not fabricate statistics, visa durations, salaries, or source URLs.
2. **Every data point displays a source.** Each metric shown in the UI has a `sources[]` chip linking out, plus a `lastUpdated` date.
3. **Methodology is public.** A `/methodology` page shows every formula and weight in plain language.
4. **INR-first.** All money displays default to ₹ lakh (converted from base USD at the rate in `/src/data/config.json`, which carries its own lastUpdated). A ₹/US$ toggle sits in the header.
5. Stay within the current phase's scope. Do not build ahead.
6. After each phase: run the dev server, verify acceptance checks, then commit with a clear message.

## Tech stack
- Vite + React 18 + TypeScript (strict)
- react-router-dom for routing
- Tailwind CSS (design tokens in `tailwind.config`), framer-motion for motion
- Recharts for the scatter and bar charts (custom-styled; no default look)
- zod for validating JSON data at load; vitest for unit tests
- zustand for state (selected degree, slider weights, currency), persisted to localStorage
- vite-plugin-pwa for the PWA layer
- Deploy target: Vercel. Data ships as static JSON in v1 (Supabase migration is a later optional phase)

## The 8 countries
`us` United States, `uk` United Kingdom, `ca` Canada, `au` Australia, `de` Germany, `ie` Ireland, `nl` Netherlands, `sg` Singapore.

## The 8 degrees
`cs-it` Computer Science & IT, `engineering` Engineering (non-CS), `business-finance` Business & Finance, `economics` Economics, `data-science` Data Science & Analytics, `health-life-sciences` Health & Life Sciences, `design-media` Design & Media, `humanities-social` Humanities & Social Sciences.

## Data schemas (source of truth — implement as zod schemas + TS types)

```ts
type CountryId = 'us'|'uk'|'ca'|'au'|'de'|'ie'|'nl'|'sg';
type DegreeId = 'cs-it'|'engineering'|'business-finance'|'economics'|'data-science'|'health-life-sciences'|'design-media'|'humanities-social';
type Confidence = 'high'|'medium'|'low'|'placeholder';

interface Source { name: string; url: string; lastUpdated: string /* ISO date */ }

// countries.json
interface Country {
  id: CountryId; name: string; flag: string; currency: string;
  blurb: string; // one line on the country's overall story for Indian students
}

// careerVisa.json — one record per country × degree (64 records)
interface CareerVisaMetrics {
  countryId: CountryId; degreeId: DegreeId;
  jobDemand: number;          // 0–100 curated (shortage-list presence + occupation growth)
  visaOpenness: number;       // 0–100 curated (cost, processing, refusal rate, work-during-study)
  postStudyWorkYears: number; // raw years of post-study work visa
  prPathwayYears: number;     // raw years from arrival to PR eligibility
  medianSalaryY1PppUsd: number; // year-1 median graduate salary, PPP-adjusted USD
  totalDegreeCostUsd: number;   // tuition + living + insurance + visa fees, full degree
  narrative: string;          // 2–3 sentences justifying this country's position
  confidence: Confidence; sources: Source[];
}

// studentLife.json — one record per country × factor (72 records)
type FactorId = 'affordability'|'safety'|'openness'|'work-rights'|'healthcare'|'language'|'community'|'political-climate'|'climate-lifestyle';
interface StudentLifeScore {
  countryId: CountryId; factorId: FactorId;
  score: number;              // 0–100
  blurb: string;              // 1–2 sentences of justification
  confidence: Confidence; sources: Source[];
}
// Factor display names & one-line descriptions live in factors.json

// pathways.json — one per country
interface Pathway {
  countryId: CountryId;
  stages: { label: string; years: number; description: string }[]; // study → post-study visa → PR → citizenship
  totalYearsToPr: number;
  confidence: Confidence; sources: Source[];
}

// trueCost.json — one per country
interface TrueCost {
  countryId: CountryId;
  tuitionPerYearUsd: number; livingPerYearUsd: number; insurancePerYearUsd: number;
  visaFeesOneTimeUsd: number; flightsPerYearUsd: number;
  hiddenNotes: string[];      // e.g. forex risk, deposit requirements, health surcharge
  confidence: Confidence; sources: Source[];
}

// emerging.json — 4–5 per degree
interface EmergingDestination {
  degreeId: DegreeId; country: string; flag: string;
  pitch: string;              // 2 sentences: why it's under the radar for this degree
  links: Source[];
}

// config.json
interface Config { usdToInr: number; ratesLastUpdated: string; }
```

## Scoring engine (`/src/lib/scoring.ts` — pure functions, unit-tested)

All normalisation is **min-max across the 8 countries within the selected degree**, producing 0–100 (0 = worst in set, 100 = best in set).

**Graph 1, X-axis — Career & Visa Score:**
```
postStudyScore = clamp(postStudyWorkYears / 3, 0, 1) * 100
prScore        = minMaxInverted(prPathwayYears)   // fewer years → higher
X = 0.35·jobDemand + 0.25·visaOpenness + 0.20·postStudyScore + 0.20·prScore
```

**Graph 1, Y-axis — ROI Score:**
```
roiRaw = (medianSalaryY1PppUsd × 5) / totalDegreeCostUsd
Y = minMax(roiRaw)   // across the 8 countries for this degree
```

**Graph 2 — Student Life Index (user-weighted):**
```
weights w_f ∈ {0..5}, default 3, set by sliders
SLI = Σ(score_f × w_f) / Σ(w_f)    // factors with w=0 excluded entirely
```
Recompute live on slider change; animate rank reordering.

## Design system — this must NOT look like a template

**Identity: a precision navigation instrument.** Vantage means a position giving a clear view — the visual language is cartographic: survey grids, sightlines, plotted points, readouts. Not a generic SaaS dashboard, not a cream-and-terracotta landing page.

**Tokens:**
- Paper `#F7F8F6` (app background), Ink `#111826` (text), Ultramarine `#2440C9` (primary accent — lines, active states, links), Gold `#B98A1F` (highlight accent — used sparingly: selected country marker, key stat), Slate `#5B6472` (secondary text), Hairline `#E3E6E1`. Dark mode later; do not build it in v1.
- Country categorical palette: 8 distinguishable hues at matched saturation/lightness so no country looks "endorsed".
- Type: **Newsreader** (Google Fonts, 500–600, tight leading) for display headlines only; **Inter** for all UI/body; **IBM Plex Mono for every number, unit, axis label, and data chip** — numerals-as-instrument-readout is a core identity element. Never set data in Inter.
- Radius 10px on cards, 6px on chips. Shadows almost none — hairline borders instead.

**Signature element (the one memorable thing):** the **sightline crosshair** on the Career & Visa scatter — hovering a country draws thin animated crosshair lines from the dot to both axes with mono readouts of the two scores at the margins, like a surveyor sighting a point. Quadrants carry quiet labels ("Strong demand · strong return", etc.) in small caps.

**Motion:** restrained and orchestrated. Dots spring in with 40ms stagger on load; SLI bars use framer-motion layout animation when reordering; number values count up with mono tabular figures; 200–280ms ease-out everywhere; respect `prefers-reduced-motion`.

**Quality floor:** responsive to 360px, visible keyboard focus rings, WCAG AA contrast, empty/error states with plain-language direction, all charts keyboard-accessible (arrow through countries).

## Information architecture
- `/` — Home: one-line thesis, degree picker (8 tiles), then a preview of the five components. The hero is the degree picker itself — choosing is the entry action.
- `/explore/:degreeId` — Tabbed workspace: **Career & Visa** | **Student Life** | **Pathways** | **True Cost** | **Emerging**. Tab state in URL.
- Country click anywhere → right-side drawer: metric breakdown bars, narrative, sources, lastUpdated, confidence badge.
- `/methodology` — formulas, weights, normalisation, data model, honesty statement (curated not live; timestamps; deep links to authorities).
- `/about` — the project, the research, the builder.
- Header: wordmark, degree switcher, ₹/$ toggle, methodology link. Footer: disclaimer ("informational, not advice; verify with official sources before deciding").

## Component specs
1. **Career & Visa Landscape** — Recharts scatter, X = Career & Visa Score, Y = ROI Score, both 0–100. Quadrant hairlines at 50/50. Dots = flag + country code, gold ring on selection. Sightline crosshair on hover. Drawer shows the four X components as horizontal readout bars + ROI inputs (salary, total cost in ₹ lakh) + narrative + sources.
2. **Student Life Index** — left: 9 sliders (0–5, default 3, mono value readouts, factor description on hover/tap); right: horizontal bar ranking of 8 countries, live-reordering. Country click → drawer with per-factor breakdown for that country.
3. **Post-Study Pathway Timeline** — horizontal stage timelines (study → post-study visa → PR → citizenship), years to scale in mono. Compare mode: pick up to 3 countries, stacked and aligned on arrival year. Total-years-to-PR readout at right.
4. **True-Cost View** — stacked horizontal bars per country (tuition/living/insurance/visa/flights), ₹ lakh default, sorted by total. Expand a country → per-line-item detail + hiddenNotes rendered as "What families miss" callouts.
5. **Emerging Destinations** — 4–5 cards for the selected degree: flag, country, two-sentence pitch, outbound links. Deliberately lighter; label the section "Beyond the usual eight".

## PWA requirements
- vite-plugin-pwa: installable manifest (name Vantage, theme `#2440C9`, maskable icons), service worker precaching app shell + data JSONs, offline = full app with last-cached data + quiet "offline — data as of {date}" banner. Custom "Add to Home Screen" prompt after second visit.

## Project conventions
- Components in `/src/components/{feature}/`, pages in `/src/pages/`, pure logic in `/src/lib/` (everything in lib unit-tested).
- No `any`. No dead code. No console noise.
- Commit after every phase: `phase N: <summary>`.
