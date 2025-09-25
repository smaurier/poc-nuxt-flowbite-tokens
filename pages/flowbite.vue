<script setup lang="ts">
import { FwbAlert, FwbButton, FwbDropdown, FwbModal, FwbTab, FwbTabs } from 'flowbite-vue'

const requestURL = useRequestURL()

useSeoMeta({
  title: 'Flowbite components · Multi-tenant tokens POC',
  description: 'Demonstrates Flowbite Vue components styled with Tailwind classes bound to tenant CSS variables.'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: `${requestURL.origin}${requestURL.pathname}`
    }
  ]
})

type ThemePayload = {
  tenantId: string
  tokens: Record<string, string | boolean>
  css: string
}

const showModal = ref(false)
const activeTab = ref('overview')

const dropdownTriggerClass =
  'flex items-center gap-2 rounded-md border border-[color:var(--color-primary)] bg-primary px-4 py-2 text-sm font-medium text-[color:var(--color-primary-contrast)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-primary)] focus-visible:outline-offset-2'

const dropdownItemClass =
  'block w-full rounded-md px-4 py-2 text-left text-sm text-text transition hover:bg-[color:var(--color-primary)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-primary)] focus-visible:outline-offset-2'

const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-md border border-[color:var(--color-primary)] bg-primary px-4 py-2 text-sm font-semibold text-[color:var(--color-primary-contrast)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-primary)] focus-visible:outline-offset-2'

const alertClass =
  'rounded-md border border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10 text-sm text-text shadow-sm'

const tabListClass =
  'border-b border-[color:var(--color-primary)] text-sm font-medium text-text'

const modalClass =
  '[&>div:first-child]:bg-[color:var(--color-text)]/40 [&_.rounded-lg]:bg-bg [&_.rounded-lg]:text-text [&_.rounded-lg]:border [&_.rounded-lg]:border-[color:var(--color-primary)] [&_.rounded-t]:border-b [&_.rounded-t]:border-[color:var(--color-primary)] [&_.rounded-b]:border-t [&_.rounded-b]:border-[color:var(--color-primary)]'

const { data: themeResponse } = await useFetch<ThemePayload>('/api/theme')

const debugJson = computed(() =>
  themeResponse.value ? JSON.stringify(themeResponse.value, null, 2) : 'Loading token payload...'
)
</script>

<template>
  <div class="flex flex-col gap-8">
    <section aria-labelledby="flowbite-heading" class="flex flex-col gap-4">
      <h1 id="flowbite-heading" class="text-3xl font-bold tracking-tight text-text">Flowbite Vue themed by tokens</h1>
      <p class="max-w-3xl text-base leading-relaxed text-text">
        Components below are Flowbite Vue primitives. They use Tailwind utility classes that reference CSS variables, so colors,
        spacing, and typography all respond to the active tenant.
      </p>
      <div class="flex flex-wrap items-center gap-4">
        <FwbButton :class="buttonClass" @click="showModal = true">Launch modal</FwbButton>
        <FwbDropdown :trigger-class="dropdownTriggerClass" text="Token actions">
          <div class="flex flex-col gap-1 p-1">
            <button type="button" :class="dropdownItemClass">View docs</button>
            <button type="button" :class="dropdownItemClass">Sync tokens</button>
            <button type="button" :class="dropdownItemClass">Report contrast</button>
          </div>
        </FwbDropdown>
      </div>
      <FwbAlert :class="alertClass" closable>
        <template #title>
          <strong class="font-semibold text-[color:var(--color-primary)]">Token powered</strong>
        </template>
        <template #default>
          <span>
            Utilities such as <code>bg-primary</code> and <code>rounded-md</code> resolve to CSS variables generated for the
            current tenant. Flowbite inherits them without additional overrides.
          </span>
        </template>
      </FwbAlert>
    </section>

    <section aria-labelledby="tabs-heading" class="flex flex-col gap-4">
      <h2 id="tabs-heading" class="text-2xl font-semibold text-text">Tabbed content</h2>
      <div
        class="[&_.border-gray-200]:border-[color:var(--color-primary)] [&_.text-gray-500]:text-text [&_.dark\\:border-gray-700]:border-[color:var(--color-primary)] [&_.dark\\:text-gray-400]:text-text"
      >
        <FwbTabs v-model="activeTab" class="flex flex-col gap-4" :class="tabListClass">
          <FwbTab name="overview" title="Overview">
            <div class="rounded-md border border-[color:var(--color-primary)] bg-bg p-4 text-sm text-text">
              Tailwind classes inside Flowbite tabs still map to the same CSS variables, so backgrounds and borders adapt across tenants.
            </div>
          </FwbTab>
        <FwbTab name="tokens" title="Tokens">
          <div class="rounded-md border border-[color:var(--color-primary)] bg-bg p-4 text-sm text-text">
            Primary color: <span class="font-mono">var(--color-primary)</span><br>
            Text color: <span class="font-mono">var(--color-text)</span>
          </div>
        </FwbTab>
        <FwbTab name="dark" title="Dark mode">
          <div class="rounded-md border border-[color:var(--color-primary)] bg-bg p-4 text-sm text-text">
            When a tenant enables dark mode, toggling <code>data-theme="dark"</code> on the root swaps background and text variables.
          </div>
        </FwbTab>
        </FwbTabs>
      </div>
    </section>

    <FwbModal v-if="showModal" :class="modalClass" @close="showModal = false" @click:outside="showModal = false">
      <template #header>
        <h3 class="text-xl font-semibold text-text">Modal styled by tokens</h3>
      </template>
      <template #body>
        <p class="text-sm leading-relaxed text-text">
          The modal wrapper uses utility selectors such as <code>[&amp;_.rounded-lg]:bg-bg</code> to propagate tenant variables
          into Flowbite internals. No inline hex values are required.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <FwbButton :class="buttonClass" @click="showModal = false">Close</FwbButton>
          <FwbButton :class="buttonClass">Confirm</FwbButton>
        </div>
      </template>
    </FwbModal>

    <section aria-labelledby="api-heading" class="flex flex-col gap-4">
      <h2 id="api-heading" class="text-2xl font-semibold text-text">/api/theme payload</h2>
      <div class="card-surface overflow-auto">
        <pre class="whitespace-pre-wrap break-words text-xs leading-relaxed text-text">{{ debugJson }}</pre>
      </div>
    </section>
  </div>
</template>
