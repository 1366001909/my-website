import { useState } from 'react'
import {
  applyThemeToDocument,
  isTheme,
  persistTheme,
  resolveInitialTheme,
  type Theme,
} from '../lib/theme'

function readDomTheme(): Theme {
  const raw = document.documentElement.dataset.theme
  return isTheme(raw) ? raw : resolveInitialTheme()
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readDomTheme)

  function toggle() {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    applyThemeToDocument(next)
    persistTheme(next)
  }

  return (
    <button
      type="button"
      className="mt-8 inline-flex items-center justify-center rounded-md border-2 border-transparent bg-[var(--accent-bg)] px-4 py-2 text-base font-medium text-[var(--accent)] hover:border-[var(--accent-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      aria-label="切换明亮或暗黑主题"
      aria-pressed={theme === 'dark'}
      onClick={toggle}
    >
      {theme === 'dark' ? '当前：暗黑' : '当前：明亮'}
    </button>
  )
}
