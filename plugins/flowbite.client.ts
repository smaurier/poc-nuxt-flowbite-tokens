import { FwbAlert, FwbButton, FwbDropdown, FwbModal, FwbTab, FwbTabs } from 'flowbite-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const components = {
    FwbAlert,
    FwbButton,
    FwbDropdown,
    FwbModal,
    FwbTab,
    FwbTabs
  }

  Object.entries(components).forEach(([name, component]) => {
    nuxtApp.vueApp.component(name, component)
  })
})
