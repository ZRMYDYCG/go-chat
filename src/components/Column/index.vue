<template>
  <div class="gc-column h-full w-full dark:bg-gray-900">
    <div class="gc-column__wrapper flex h-full flex-col">
      <div class="gc-column__header bg-white dark:bg-gray-900">
        <slot name="header"></slot>
      </div>

      <slot v-if="scrollbar" name="scroll-header"></slot>
      <ElScrollbar v-if="scrollbar" ref="elScrollbar" class="flex-1 bg-white dark:bg-gray-900">
        <div class="gc-column__body">
          <slot></slot>
        </div>
      </ElScrollbar>
      <slot v-if="scrollbar" name="scroll-footer"></slot>

      <div v-if="!scrollbar" class="gc-column__body bg-white dark:bg-gray-900">
        <slot></slot>
      </div>

      <div class="gc-column__footer bg-white dark:bg-gray-900">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, withDefaults } from 'vue'

defineOptions({
  name: 'GcColumn',
})

const props = withDefaults(
  defineProps<{
    scrollbar: boolean
  }>(),
  {
    scrollbar: true,
  },
)

const elScrollbar = ref<any>()

defineExpose({
  elScrollbar,
})
</script>

<style scoped>
.el-scrollbar {
  height: auto;
  flex: 1;
}
</style>
