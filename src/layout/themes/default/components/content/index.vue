<template>
  <div class="gc-content ml-[245px] h-full">
    <router-view v-slot="{ Component }">
      <keep-alive :max="20" :exclude="[]">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
