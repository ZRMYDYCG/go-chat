<script setup lang="ts">
import { useTheme } from '@/hooks'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <div class="min-h-screen bg-white transition-colors duration-300 dark:bg-gray-900">
    <button class="fixed top-4 right-4 rounded-full bg-gray-200 p-2 dark:bg-gray-700" @click="toggleTheme">
      {{ theme === 'dark' ? '🌙' : '☀️' }}
    </button>

    <!-- 你的页面内容 -->
    <div class="text-gray-900 dark:text-gray-100">Current theme: {{ theme }}</div>
  </div>

  <div class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Title</h1>
    <p class="mt-2 text-gray-600 dark:text-gray-300">Content here...</p>

    <button
      class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
    >
      Button
    </button>
  </div>
</template>
