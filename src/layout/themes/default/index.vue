<script setup lang="ts">
import Aside from './components/aside/index.vue'
import Content from './components/content/index.vue'
</script>

<template>
  <div class="h-full w-full">
    <!--  侧边栏  -->
    <Aside />
    <!--  内容区域  -->
    <Content />
  </div>
</template>

<style scoped></style>
