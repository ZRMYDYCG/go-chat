<template>
  <div class="gc-navigator-menu h-[calc(100vh-200px)] pt-[40px] pl-[30px]">
    <div class="menu-list">
      <router-link
        v-for="menu in menus"
        :key="menu.path"
        :to="menu.path"
        active-class="active"
        class="menu-item mb-[10px] block h-[40px] w-[160px] rounded-[10px] px-[20px] leading-[40px] text-[#38393e] transition-all duration-300 ease-in-out"
      >
        <i v-if="route.path !== menu.path" :class="menu.meta.icon" class="mr-[15px] text-[22px]"></i>
        <i v-else :class="menu.meta.activeIcon" class="mr-[15px] text-[22px]"></i>
        <span>{{ menu.meta.title }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { rootRoute } from '@/router/routes/basic'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menus = computed(() => {
  if (!rootRoute.children) return []
  return rootRoute.children.flatMap((child) => {
    if (!child.children) {
      return child
    } else {
      return child.children
    }
  })
})
</script>

<style scoped>
.menu-item.active,
.menu-item:hover {
  background-color: #fff;
  box-shadow: 0 6px 6px 1px #eceff4;
  color: #3246d1;
}
</style>
