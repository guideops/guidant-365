'use client'

import { useTheme } from '@/providers/ThemeProvider'

export function useDarkMode() {
  const { theme, toggleTheme, setTheme } = useTheme()
  return { isDark: theme === 'dark', toggleTheme, setTheme, theme }
}
