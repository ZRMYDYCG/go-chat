<template>
  <div class="gc-column h-full w-full">
    <div class="gc-column__wrapper flex h-full flex-col">
      <div class="gc-column__header">
        <slot name="header"></slot>
      </div>

      <slot v-if="scrollbar" name="scroll-header"></slot>
      <el-scrollbar v-if="scrollbar" ref="elScrollbar">
        <div class="gc-column__body">
          <slot></slot>
        </div>
      </el-scrollbar>
      <slot v-if="scrollbar" name="scroll-footer"></slot>

      <div v-if="!scrollbar" class="gc-column__body">
        <slot></slot>
      </div>

      <div class="gc-column__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElScrollbar } from 'element-plus'
import { defineProps, ref, withDefaults } from 'vue'

defineOptions({
  name: 'GcColumn',
})

withDefaults(
  defineProps<{
    scrollbar: boolean
  }>(),
  {
    scrollbar: true,
  },
)

const elScrollbar = ref<InstanceType<typeof ElScrollbar> | null>(null)

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
