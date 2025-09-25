<script setup lang="ts">
type ThemePayload = {
  tenantId: string
  tokens: Record<string, string | boolean>
  css: string
}

type ThemeState = {
  tenantId: string
  tokens: Record<string, string | boolean> | null
  css: string
  darkEnabled: boolean
}

const themeState = useState<ThemeState>('tenant-theme', () => ({
  tenantId: 'beta',
  tokens: null,
  css: '',
  darkEnabled: false
}))

const isDark = useState('tenant-dark', () => false)

if (import.meta.server) {
  const { data } = await useFetch<ThemePayload>('/api/theme', { server: true })
  if (data.value) {
    themeState.value = {
      tenantId: data.value.tenantId,
      tokens: data.value.tokens,
      css: data.value.css,
      darkEnabled: Boolean(data.value.tokens['dark.enabled'])
    }
  }
}

if (import.meta.client && !themeState.value.tokens) {
  const { data } = await useFetch<ThemePayload>('/api/theme')
  if (data.value) {
    themeState.value = {
      tenantId: data.value.tenantId,
      tokens: data.value.tokens,
      css: data.value.css,
      darkEnabled: Boolean(data.value.tokens['dark.enabled'])
    }
  }
}

watch(
  () => themeState.value.darkEnabled,
  (enabled) => {
    if (!enabled) {
      isDark.value = false
    }
  },
  { immediate: true }
)

const cssString = computed(() => themeState.value.css)
const tenantId = computed(() => themeState.value.tenantId)
const darkEnabled = computed(() => themeState.value.darkEnabled)

useHead(() => ({
  htmlAttrs: {
    lang: 'en',
    'data-tenant': tenantId.value,
    'data-theme': darkEnabled.value && isDark.value ? 'dark' : null
  },
  style: cssString.value
    ? [
        {
          id: 'tenant-tokens',
          children: cssString.value
        }
      ]
    : []
}))

const links = [
  { to: '/', label: 'Design primitives' },
  { to: '/flowbite', label: 'Flowbite demo' }
]

const route = useRoute()

const tenantLabel = computed(() => (tenantId.value === 'acme' ? 'Acme' : 'Beta'))

const darkToggleLabel = computed(() => (isDark.value ? 'Disable dark mode' : 'Enable dark mode'))

function toggleDarkMode() {
  if (!darkEnabled.value) return
  isDark.value = !isDark.value
}
</script>

<template>
  <div class="min-h-screen bg-bg text-text">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bg focus:px-4 focus:py-2 focus:text-text"
    >
      Skip to main content
    </a>
    <NuxtLoadingIndicator color="var(--color-primary)" />
    <header class="border-b border-[color:var(--color-primary)] bg-bg">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div class="flex flex-col">
          <span class="text-xs font-medium uppercase tracking-wider text-text">Tenant: {{ tenantLabel }}</span>
          <NuxtLink
            to="/"
            class="text-2xl font-bold leading-tight text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-primary)] focus-visible:outline-offset-2"
          >
            Multi-tenant Theming POC
          </NuxtLink>
        </div>
        <nav aria-label="Main navigation">
          <ul class="flex items-center gap-2">
            <li v-for="link in links" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="rounded-md px-4 py-2 text-sm font-medium text-text transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-primary)] focus-visible:outline-offset-2"
                :class="{
                  'text-[color:var(--color-primary)] font-semibold': route.path === link.to
                }"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <button
          v-if="darkEnabled"
          type="button"
          class="rounded-md border border-[color:var(--color-primary)] px-4 py-2 text-sm font-medium text-text transition hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-primary-contrast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-primary)] focus-visible:outline-offset-2"
          :aria-pressed="isDark"
          @click="toggleDarkMode"
        >
          {{ darkToggleLabel }}
        </button>
      </div>
    </header>
    <main id="main" class="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10" role="main">
      <NuxtPage />
    </main>
    <footer class="border-t border-[color:var(--color-primary)] bg-bg">
      <div class="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-text">
        <p>
          Built to validate design tokens, Flowbite Vue integration, and multi-domain theming in a single Nuxt 3 app.
        </p>
        <p>
          Current tenant:
          <strong>{{ tenantLabel }}</strong>
        </p>
      </div>
    </footer>
  </div>
</template>
