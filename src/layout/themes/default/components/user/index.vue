<template>
  <div class="gc-user flex w-full items-center justify-center">
    <img v-if="userInfo?.avatar" class="rounder-full h-[40px] w-[40px]" :src="userInfo.avatar" alt="用户头像" />
    <img v-else class="rounder-full h-[40px] w-[40px]" src="@/assets/default_avatar.png" alt="用户头像" />
    <h3 class="ml-[10px] cursor-default text-sm text-nowrap text-gray-600">{{ nickname ? nickname : '未登录' }}</h3>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { computed } from 'vue'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const nickname = computed(() => userInfo.value?.nickname || userInfo.value?.account)
</script>

<style scoped></style>
