# Nuxt Multi-tenant Theming Demo Playbook

This playbook structures the proof-of-concept walkthrough so stakeholders clearly see how the Nuxt 3 front-office satisfies the guarantees that came out of the workshop and the CMS strategy document.

## 1. Core claims to prove live

| Claim | How to demonstrate | Evidence to highlight |
| --- | --- | --- |
| Single front-office handling multiple tenants by domain | Start `pnpm dev -- --host 0.0.0.0`, open `http://beta.localhost:3000` (or default `localhost`) then `http://acme.localhost:3000`. The middleware in `server/middleware/tenant.ts` resolves the host and injects the right token sheet. | Inspect the `<html data-tenant>` attribute, the `/api/theme` payload, and the visual switch (palette, radius, typography). |
| Tokens → CSS variables → Tailwind utilities → UI | Refresh `/` and use the “Resolved tokens” table to connect JSON values to the rendered button/card primitives. | Show `tailwind.config.js` mapping semantic utilities to `var(--token)` and point out there are zero hex values outside `/tokens`. |
| Flowbite Vue components themed without hacks | Visit `/flowbite`, trigger the dropdown, tabs, modal, and alert. | Inspect classes such as `bg-primary`, `border-[color:var(--color-primary)]`, and the arbitrary selectors (`[&_.rounded-lg]:bg-bg`) that bridge tokens into Flowbite internals. |
| Optional tenant dark mode | Stay on `acme`, toggle the “Enable dark mode” button in the header. | Note how `<html data-theme="dark">` flips on, `:root[data-theme="dark"]` overrides swap background/text, and Flowbite remains legible without one-off overrides. |
| Operational tooling | Hit `/api/theme` or use the debug panel in `/flowbite`. | Demonstrate that SSR and CSR share the same payload and that we can script validations around it. |

## 2. “Beyond the code” talking points from the workshop

These items came up repeatedly in the Teams conversation and should accompany the live demo so stakeholders link the POC to the broader delivery plan:

1. **Migration story:** reassure Pierre that a single Nuxt FO plus token-driven primitives makes it feasible to migrate existing tenants without duplicating screens. Show how tokens can be swapped without touching Vue components.
2. **Design System alignment:** stress Tailwind-first implementation and Flowbite adoption for the back-office. Mention how tokens remain the source of truth so designers (Amandine) can evolve palettes safely.
3. **Editor constraints:** remind everyone (Houssem, Quentin) that Unlayer outputs inline styles, so we plan to lock editors to tenant palettes and avoid free-form hex values. Tie this to the “Themes & Variations” guardrails from the strategy PDF (section 5.7).
4. **Governance & cadence:** call back to Sébastien’s concerns on staffing—highlight that tokens + shared primitives reduce long-term overhead. Mention the need for weekly checkpoints and a shared Notion workspace as agreed.
5. **Back-office/front-office separation:** confirm the roadmap keeps two Nuxt apps but shares tokens and governance, matching Loïc’s coordination with OnePlatform.
6. **Tech spikes:** note the planned research backlog (multi-tenant caching, preview environments, fake data, performance tooling) so Quentin and Sylvain can prioritise investigations after the demo.

## 3. References into the strategy PDF (`document.pdf`)

| Topic in PDF | Connection to the demo |
| --- | --- |
| **5.7 Themes and Variations** | Reinforces why tokens and controlled variations matter. Use the demo to show how variations become a token swap instead of per-component overrides, and explain that custom CSS stays an escape hatch with guardrails. |
| **Accessibility & performance constraints (p. 44)** | Point out how semantic landmarks (`header`, `nav`, `main`, `footer`) and focus-visible handling already follow RGAA direction, and that token-driven utilities help enforce future budgets. |
| **API & governance sections (8.2, 8.3)** | `/api/theme` exemplifies the “living contract” mindset: same structure for tooling, tests, and other apps. Mention how we plan to surface token diffs and audit logs later, aligning with governance expectations. |
| **Media & DAM roadmap (5.5)** | While not implemented, clarify how tenant-aware assets could reuse the same host resolution pattern demonstrated here, easing future DAM integration. |

## 4. Checklist before stakeholder sessions

- [ ] Hosts configured (`acme.localhost`, `beta.localhost`) and screenshots captured for both light/dark states.
- [ ] `pnpm build` runs cleanly to prove the stack is production-ready.
- [ ] `grep -R -E "#[0-9A-Fa-f]{6}" --exclude-dir=tokens --include="*.{vue,js,ts,css}" .` returns nothing.
- [ ] Talking points rehearsed (migration, DS alignment, editor limits, staffing, OnePlatform coordination).
- [ ] Notion page prepared with backlog topics (tokens tooling, Flowbite audit, preview environments, performance instrumentation, test strategy).

## 5. Next actions after the demo

1. **Token governance tooling:** define how designers request new tokens, how we validate contrast, and how releases propagate to both FO and BO apps.
2. **Performance & testing spikes:** benchmark SSR TTFB with multi-tenant caching and outline the automated testing matrix (unit, component, E2E) expected by the Development Approach Plan referenced in the PDF.
3. **CMS integration research:** partner with OnePlatform (Julien/Simon) to align API contracts, and evaluate how Unlayer templates can consume tokens deterministically.
4. **Documentation & enablement:** migrate these notes to the shared Notion workspace, keep README updated, and schedule the follow-up meeting proposed for next week.

Prepared by Sylvain Maurier (Front-end). Last updated: 2025-09-25.
