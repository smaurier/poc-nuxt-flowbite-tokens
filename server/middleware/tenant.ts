import { defineEventHandler, getRequestHeader } from 'h3'
import { readTokens, toCSSVars, type ThemeTokens } from '~/server/utils/theme'

declare module 'h3' {
  interface H3EventContext {
    tenantId?: string
    tenantTokens?: ThemeTokens
    tenantCSS?: string
  }
}

export default defineEventHandler(async (event) => {
  const host = getRequestHeader(event, 'host')?.toLowerCase() ?? ''
  const tenantId = host.includes('acme') ? 'acme' : 'beta'
  event.context.tenantId = tenantId
  const tokens = await readTokens(tenantId)
  event.context.tenantTokens = tokens
  event.context.tenantCSS = toCSSVars(tokens)
})
