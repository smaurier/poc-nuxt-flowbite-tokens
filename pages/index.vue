<script setup lang="ts">
const requestURL = useRequestURL()

useSeoMeta({
  title: 'Design primitives · Multi-tenant tokens POC',
  description: 'Demonstrates design tokens mapped to Tailwind utilities and custom primitives for each tenant.'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: `${requestURL.origin}${requestURL.pathname}`
    }
  ]
})

type ThemeState = {
  tokens: Record<string, string | boolean> | null
}

const themeState = useState<ThemeState>('tenant-theme')
const resolvedTokens = computed<Record<string, string | boolean>>(
  () => themeState.value.tokens ?? {}
)
</script>

<template>
  <div class="flex flex-col gap-8">
    <section aria-labelledby="overview-heading" class="flex flex-col gap-4">
      <h1 id="overview-heading" class="text-3xl font-bold tracking-tight text-text">
        Design primitives wired to tokens
      </h1>
      <p class="max-w-3xl text-base leading-relaxed text-text">
        This page shows bespoke primitives that consume the same Tailwind classes generated from CSS variables.
        Change the tenant (via domain) to see colors, spacing, typography, and radius update without touching the components.
      </p>
    </section>

    <section aria-labelledby="button-heading" class="flex flex-col gap-4">
      <h2 id="button-heading" class="text-2xl font-semibold text-text">Button primitive</h2>
      <p class="max-w-2xl text-sm text-text">
        The button only references Tailwind utilities linked to CSS variables. Primary color, contrast text, spacing, and radius all come from tokens.
      </p>
      <div class="flex flex-wrap items-center gap-4">
        <DSButton>Primary action</DSButton>
        <DSButton>Secondary action</DSButton>
      </div>
    </section>

    <section aria-labelledby="card-heading" class="flex flex-col gap-4">
      <h2 id="card-heading" class="text-2xl font-semibold text-text">Card primitive</h2>
      <p class="max-w-2xl text-sm text-text">
        Cards inherit typography and background from the theme. The footer illustrates spacing tokens and consistent borders.
      </p>
      <DSCard>
        <template #title>Composable surfaces</template>
        <p>
          Tokens map to Tailwind spacing utilities, so the padding and gap obey the tenant scale.
          Typography pulls directly from the tenant font-family and color variables.
        </p>
        <template #footer>
          <DSButton>Action in card</DSButton>
        </template>
      </DSCard>
    </section>

    <section aria-labelledby="token-heading" class="flex flex-col gap-4">
      <h2 id="token-heading" class="text-2xl font-semibold text-text">Resolved tokens</h2>
      <p class="max-w-2xl text-sm text-text">
        These values come from the active tenant JSON file. They are injected during SSR and hydrated on the client.
      </p>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-[color:var(--color-primary)] text-left text-sm">
          <thead>
            <tr class="text-[color:var(--color-primary)]">
              <th scope="col" class="px-4 py-2 font-semibold">Token</th>
              <th scope="col" class="px-4 py-2 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in resolvedTokens" :key="key" class="odd:bg-[color:var(--color-primary)]/5">
              <th scope="row" class="px-4 py-2 font-medium text-text">{{ key }}</th>
              <td class="px-4 py-2 font-mono text-sm text-text">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
