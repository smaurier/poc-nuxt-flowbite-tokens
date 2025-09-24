import { readFile } from 'node:fs/promises'
import { join } from 'pathe'

const REQUIRED_KEYS = [
  'color.primary',
  'color.primary-contrast',
  'color.bg',
  'color.text',
  'radius.md',
  'font.family.sans',
  'space.2',
  'space.4',
  'dark.enabled'
] as const

export type ThemeTokens = Record<(typeof REQUIRED_KEYS)[number] | string, string | boolean>

export async function readTokens(tenantId: string): Promise<ThemeTokens> {
  const filePath = join(process.cwd(), 'tokens', `${tenantId}.tokens.json`)
  const raw = await readFile(filePath, 'utf8')
  const tokens = JSON.parse(raw) as ThemeTokens
  for (const key of REQUIRED_KEYS) {
    if (typeof tokens[key] === 'undefined') {
      throw new Error(`Missing token "${key}" for tenant ${tenantId}`)
    }
  }
  return tokens
}

export function toCSSVars(tokens: ThemeTokens): string {
  const darkEnabled = Boolean(tokens['dark.enabled'])
  const lines: string[] = [
    ':root {',
    `  --color-primary: ${tokens['color.primary']};`,
    `  --color-primary-contrast: ${tokens['color.primary-contrast']};`,
    `  --color-bg: ${tokens['color.bg']};`,
    `  --color-text: ${tokens['color.text']};`,
    `  --radius-md: ${tokens['radius.md']};`,
    `  --space-2: ${tokens['space.2']};`,
    `  --space-4: ${tokens['space.4']};`,
    `  --font-sans: ${tokens['font.family.sans']};`,
    '}'
  ]

  if (darkEnabled) {
    const darkBg = (tokens['color.dark.bg'] as string | undefined) ?? (tokens['color.bg'] as string)
    const darkText = (tokens['color.dark.text'] as string | undefined) ?? (tokens['color.text'] as string)
    lines.push(':root[data-theme="dark"] {')
    lines.push(`  --color-bg: ${darkBg};`)
    lines.push(`  --color-text: ${darkText};`)
    lines.push('}')
  }

  return lines.join('\n')
}
