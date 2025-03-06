<script setup lang="ts">
import { useSocket } from '@/hooks'

const { connectSocket } = useSocket()

connectSocket()
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
