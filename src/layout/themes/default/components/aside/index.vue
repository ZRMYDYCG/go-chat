<script setup lang="ts">
import GcColumn from '@/components/Column/index.vue'
import GcLogo from '../logo/index.vue'
import GcMenu from '../menu/index.vue'
import GcUser from '../user/index.vue'
</script>

<template>
  <div class="gc-aside fixed top-0 left-0 h-full w-[245px] border-r border-gray-200">
    <GcColumn :scrollbar="false">
      <template #header>
        <GcLogo></GcLogo>
      </template>
      <template #default>
        <GcMenu />
      </template>
      <template #footer>
        <GcUser />
        <img
          src="https://raw.githubusercontent.com/mayhemantt/mayhemantt/Update/svg/Bottom.svg"
          class="absolute -bottom-[4px]"
          alt="#"
        />
      </template>
    </GcColumn>
  </div>
</template>

<style scoped>
.gc-aside :deep(.gc-column) .gc-column__header {
  display: flex;
  align-items: center;
  height: 70px;
  padding-left: 30px;
  border-bottom: 1px solid #e2e8f0;
}

.gc-aside :deep(.gc-column) .gc-column__footer {
  display: flex;
  align-items: center;
  height: 95px;
  border-top: 1px solid #e2e8f0;
}
</style>
