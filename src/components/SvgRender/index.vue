<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 图标名称（对应assets/svg目录下的svg文件名） */
  name: string
  /** 预设尺寸（当未指定width/height时生效） */
  size?: 'small' | 'medium' | 'large'
  /** 自定义宽度（支持所有CSS单位） */
  width?: string
  /** 自定义高度（支持所有CSS单位） */
  height?: string
  /** 自定义class */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
})

const sizeMap = {
  small: 16,
  medium: 24,
  large: 32,
}

// 处理数字自动补px
const parseDimension = (value?: string): string | undefined => {
  if (!value) return undefined
  return /^\d*\.?\d+$/.test(value) ? `${value}px` : value
}

// assets 路径方案
const svgSrc = computed(() => {
  return new URL(`/src/assets/svg/${props.name}.svg`, import.meta.url).href
})

// 尺寸计算逻辑
const dimensions = computed(() => {
  const baseSize = sizeMap[props.size]
  return {
    width: parseDimension(props.width) ?? `${baseSize}px`,
    height: parseDimension(props.height) ?? `${baseSize}px`,
  }
})
</script>

<template>
  <img
    :src="svgSrc"
    :style="{
      width: dimensions.width,
      height: dimensions.height,
    }"
    :class="props.class"
    class="inline-block align-middle"
    aria-hidden="true"
  />
</template>
