<template>
  <div class="gc-navigator-menu">
    <div class="menu-list">
      <router-link v-for="menu in menus" :key="menu.path" :to="menu.path" active-class="active" class="menu-item">
        <i v-if="route.path !== menu.path" :class="menu.meta.icon"></i>
        <i v-else :class="menu.meta.activeIcon"></i>
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
.gc-navigator-menu {
  height: calc(100vh - 200px);
  padding-left: 30px;
  padding-top: 40px;
  .menu-list {
    .menu-item {
      display: block;
      width: 160px;
      height: 40px;
      line-height: 40px;
      color: #38393e;
      padding: 0 20px;
      margin-bottom: 10px;
      border-radius: 10px;
      transition: all 0.3s ease;

      i {
        font-size: 22px;
        margin-right: 15px;
      }

      &.active,
      &:hover {
        background-color: #fff;
        box-shadow: 0 6px 6px 1px #eceff4;
        color: $theme-color;
      }
    }
  }
}
</style>
