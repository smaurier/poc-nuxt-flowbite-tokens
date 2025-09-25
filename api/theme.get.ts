import { defineEventHandler } from 'h3'
import { readTokens, toCSSVars } from '~/server/utils/theme'

export default defineEventHandler(async (event) => {
  const tenantId = event.context.tenantId ?? 'beta'
  const tokens = event.context.tenantTokens ?? (await readTokens(tenantId))
  const css = event.context.tenantCSS ?? toCSSVars(tokens)
  return { tenantId, tokens, css }
})
