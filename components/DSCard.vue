<template>
  <article class="card-surface flex flex-col gap-4">
    <header>
      <h2 class="text-lg font-semibold tracking-tight text-text">
        <slot name="title" />
      </h2>
    </header>
    <div class="text-sm leading-relaxed text-text">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="mt-auto pt-4 border-t border-[color:var(--color-primary)]">
      <slot name="footer" />
    </footer>
  </article>
</template>
