import { defineEventHandler } from 'h3'
import { readTokens, toCSSVars } from '~/server/utils/theme'

export default defineEventHandler(async (event) => {
  const tenantId = event.context.tenantId ?? 'beta'
  const tokens = await readTokens(tenantId)
  const css = toCSSVars(tokens)
  return { tenantId, tokens, css }
})
