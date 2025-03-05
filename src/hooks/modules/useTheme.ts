/**
 * @description: 白天黑夜模式切换
 * */
import { ref, watchEffect } from 'vue'

type Theme = 'light' | 'dark'

export function useTheme() {
  const theme = ref<Theme>(getInitialTheme())

  function getInitialTheme(): Theme {
    // 优先使用 localStorage 保存的主题
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) return savedTheme

    // 其次使用系统偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function applyTheme(newTheme: Theme) {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  // 初始化时应用主题
  watchEffect(() => applyTheme(theme.value))

  return {
    theme,
    toggleTheme,
  }
}
