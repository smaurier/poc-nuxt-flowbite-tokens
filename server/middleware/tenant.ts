import { defineEventHandler, getRequestHeader } from 'h3'

declare module 'h3' {
  interface H3EventContext {
    tenantId?: string
  }
}

export default defineEventHandler((event) => {
  const host = getRequestHeader(event, 'host')?.toLowerCase() ?? ''
  const tenantId = host.includes('acme') ? 'acme' : 'beta'
  event.context.tenantId = tenantId
})
