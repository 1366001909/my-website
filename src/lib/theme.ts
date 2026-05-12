export type Theme = 'light' | 'dark'

/** Must stay in sync with the inline boot script in `index.html`. */
export const STORAGE_KEY = 'theme'

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function readStoredTheme(): Theme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return null
    }
    if (isTheme(raw)) {
      return raw
    }
    localStorage.removeItem(STORAGE_KEY)
    return null
  } catch {
    return null
  }
}

export function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? getSystemTheme()
}

export function applyThemeToDocument(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

export function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // ignore quota / private mode
  }
}
