import type { Component } from 'vue'
import * as FlowbiteVue from 'flowbite-vue'
import 'flowbite-vue/index.css'

const isVueComponent = (value: unknown): value is Component =>
  typeof value === 'function' ||
  (typeof value === 'object' && value !== null && ('render' in value || 'setup' in value))

const flowbiteComponents = Object.entries(FlowbiteVue).filter(
  ([name, component]) => name.startsWith('Fwb') && isVueComponent(component)
)

export default defineNuxtPlugin((nuxtApp) => {
  for (const [name, component] of flowbiteComponents) {
    nuxtApp.vueApp.component(name, component)
  }
})
