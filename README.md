# Nuxt multi-tenant theming POC

This proof of concept shows how a single Nuxt 3 front-office application can resolve tenants from the request host, load their design tokens, expose them as CSS variables, and drive both bespoke primitives and Flowbite Vue components through Tailwind utilities. It also provides an opt-in dark mode per tenant and a debugging surface for the effective token payload.

## Quick start

```bash
pnpm install
pnpm dev -- --host 0.0.0.0
```

* `http://localhost:3000` renders the default **beta** tenant.
* To preview **acme**, map `acme.localhost` to `127.0.0.1` in your hosts file and browse `http://acme.localhost:3000` (any host containing `acme` resolves to that tenant).
* When using command-line tools you can override the host header: `curl -H "Host: acme.localhost" http://localhost:3000/api/theme`.

The middleware always falls back to `beta` in development so local smoke tests work even without a custom host.

## What this POC demonstrates

1. **Single front-office with tenant resolution** – `/server/middleware/tenant.ts` inspects the host header, stores `tenantId` in the event context, and every SSR pass injects the right token sheet.
2. **Tokens → CSS variables → Tailwind** – `/server/utils/theme.ts` parses `/tokens/*.tokens.json`, validates required keys, and generates the `<style id="tenant-tokens">` injected from `app.vue`. Tailwind only references semantic utilities such as `bg-primary` or `rounded-md`, which resolve to `var(--token)` values.
3. **Flowbite Vue without hacks** – `/pages/flowbite.vue` uses Flowbite Vue buttons, modals, alerts, tabs, and dropdowns. Styling relies on Tailwind utilities (including Tailwind arbitrary selectors) tied to CSS variables; no component-specific overrides or hard-coded colors.
4. **Optional dark mode per tenant** – If `dark.enabled` is true (e.g. acme), a toggle appears in the global header. Toggling simply flips `data-theme="dark"` on `<html>`, activating the overrides in the generated token sheet.
5. **Accessibility and SEO** – Each page exposes a single `<h1>`, uses semantic landmarks (`header`, `nav`, `main`, `footer`), and defines canonical links plus titles/descriptions via `useSeoMeta`.
6. **Operational tooling** – `/api/theme` returns the active tokens (and generated CSS string) so teams can script validations or feed external tools.

## Repository layout

```
/api/theme.get.ts              # Debug endpoint exposing the resolved tenant tokens
/assets/css/tailwind.css       # Tailwind entrypoint + base/focus styles mapped to CSS vars
/components/DSButton.vue       # Design-system button primitive using token-driven utilities
/components/DSCard.vue         # Card primitive consuming the same utility mapping
/pages/index.vue               # Primitive showcase + token table
/pages/flowbite.vue            # Flowbite Vue showcase themed via Tailwind classes
/plugins/flowbite.client.ts    # Registers Flowbite Vue plugin on the client
/server/middleware/tenant.ts   # Host → tenant resolver stored on event context
/server/utils/theme.ts         # Token loader + CSS variable generator
/tailwind.config.js            # Tailwind theme extension mapped to CSS variables
/tokens/*.tokens.json          # Source of truth for tenants (extend as needed)
/app.vue                       # Global layout, SSR token injection, dark-mode toggle
```

## Verifying the theming pipeline

1. Start the dev server and open both `/` and `/flowbite` under `beta` and `acme`. Observe that button fills, card borders, Flowbite tabs, modal surfaces, and dropdown menus all change without altering component logic.
2. Use the dark-mode toggle (only on acme) to ensure background and text variables switch while the Flowbite components remain legible.
3. Hit `http://localhost:3000/api/theme` (or via `curl`) to confirm the server is returning the expected JSON payload.
4. Run the lint-style guard to guarantee no accidental hex codes leaked into the source tree:

   ```bash
   grep -R -E "#[0-9A-Fa-f]{6}" --exclude-dir=tokens --include="*.{vue,js,ts,css}" .
   ```

   The command should output nothing.

## Testing checklist

| Scenario | How to validate |
| --- | --- |
| Tenant switch | Serve with `pnpm dev -- --host 0.0.0.0`, open `beta` and `acme` hosts, confirm typography/color/radius change. |
| Flowbite integration | Visit `/flowbite`, trigger dropdown, modal, tabs, and alert; verify styles reference tokens (inspect DOM to see `var(--color-…)`). |
| Dark mode | On acme, toggle the switch and verify `<html data-theme="dark">` plus updated background/text contrasts. |
| API | `curl -H "Host: acme.localhost" http://localhost:3000/api/theme | jq` to inspect resolved tokens. |

## Discovery notes & next steps

The team sync (Pierre, Momo, Houssem, Quentin, Sylvain, Sébastien, Loïc) converged on several follow-ups:

* **Single Nuxt front-office is the right target** – One tenant-aware app simplifies deployments; front-office and back-office can still ship separately but share tokens and primitives.
* **Design system priorities** – Tailwind stays the base layer, Flowbite supplies back-office components, and tokens remain the single source of truth. No benefit to reintroducing Bootstrap alongside Tailwind.
* **Editor constraints** – Unlayer outputs inline styles; keep tenant palettes constrained to tokenized values to avoid brittle hex replacements when duplicating content.
* **Architecture considerations** – Investigate multi-tenant caching/CDN behavior, hexa architecture for payment services, and a preview system for designers (Loïc ↔ OnePlatform coordination).
* **Research backlog** – Document on Notion the topics each engineer will deep-dive: Nuxt routing, token transforms, performance monitoring, fake data generation, test strategy (unit/E2E), and packaging.
* **Collaboration cadence** – Daily syncs with shared investigation notes, weekly checkpoints, designers looped in early for DS updates.

This POC gives Sylvain (front-end owner) a concrete baseline to expand while the broader architectural spikes continue.

## Extended demo checklist (from workshop notes)

To align with the two-hour workshop recap, make sure the live walkthrough covers the following talking points in addition to the technical proof of concept:

* **Migration narrative** – Be ready to explain how we move from today’s fragmented stacks (Netanswer templates, WMS, OnePlatform) toward a single Nuxt front-office plus a dedicated back-office. Clarify that FO stays tenant-aware while BO and FO share tokens and primitives.
* **Design system positioning** – Highlight why Tailwind + Flowbite replaces Bootstrap in the back-office, how tokens remain the single source of truth, and how the same variables can be consumed by OnePlatform later on.
* **Content editors reality** – Surface Unlayer’s inline styling limits, the plan to constrain color palettes via tokens, and the expectation that advanced overrides happen through validated token updates rather than ad-hoc hex values.
* **Token-first architecture** – Walk stakeholders through the chain `JSON → CSS variables → Tailwind classes → Flowbite`, and insist that “Tailwind adapts to the tokens, not the other way around.”
* **Governance & performance** – Mention the performance budgets (HTML/JS caps, EU CDN), accessibility goals (RGAA target TBD), analytics + CMP expectations, and the need for logging KPIs early to feed FinOps reporting.
* **Integration roadmap** – Call out pending spikes: OnePlatform API alignment (Loïc ↔ Julien/Simon), payment platform (hexa) diagram, preview environments for designers, and fake data/test tooling for QA.
* **Team organization** – Reiterate the working cadence (daily touchpoints, weekly checkpoints, shared Notion workspace) and who drives what: Sylvain on front, Pierre pairing for onboarding, Loïc coordinating with OnePlatform, Amandine on DS alignment.
* **Open questions** – Keep track of remaining unknowns (OnePlatform CMS embedding, content builder compatibility, bootstrap vs tailwind for builders, dark mode coverage for Unlayer, tenant-driven variation strategy) so stakeholders see the follow-up backlog.

Printing this list before the demo helps ensure nothing from the workshop notes gets lost while focusing on the code.

## Troubleshooting

* Corporate proxies may block package installs. If `pnpm install` fails with 403 or ENETUNREACH, configure your proxy variables (or clear them) before retrying.
* Flowbite relies on Tailwind’s arbitrary selectors to override its default palette. Ensure your Tailwind version stays at `^3.4.x` and the plugin is registered in `tailwind.config.js`.

## Screenshots (manual)

Once the dev server is running, capture `/flowbite` under both tenants (light and dark) to document the visual differences. No automated tooling is included in this repository.
