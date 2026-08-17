export const THEME_STORAGE_KEY = 'portfolio-theme'

export function readStoredTheme(storage = window.localStorage) {
  return storage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'
}

export function applyTheme(theme, root = document.documentElement) {
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}
