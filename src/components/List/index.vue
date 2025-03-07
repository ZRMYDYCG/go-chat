<template>
  <div class="gc-list">
    <div class="gc-list__wrapper">
      <a
        v-for="(item, index) in list"
        :key="index"
        href="javascript:void(0)"
        class="gc-list__item transition-background :last- mx-[10px] flex items-center rounded-[10px] px-[15px] py-[10px] text-[#333] duration-300 last:border-b-0 hover:shadow-sm"
        :class="[{ 'bg-[#fff] text-[#26224e] shadow-sm': currentIndex === getObjectAttrValue(item, options.key) }]"
        :draggable="draggable"
        @click="handleChangeItem(item)"
        @click.right="handleContextMenu($event, item)"
      >
        <slot :item="item" :index="index">
          {{ getObjectAttrValue(item, options.label) }}
        </slot>
      </a>
      <el-empty v-if="isEmpty" :image-size="60" description="暂无数据" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentInstance } from '@/hooks'
import { get as getObjectAttrValue } from 'lodash'
import type { PropType } from 'vue'
import { computed, nextTick, ref } from 'vue'

interface Item {
  [key: string]: any
}

interface Options {
  key: string
  label: string
}

interface BeforeChangeFunction {
  (index: number, item: Item, value: any): boolean | Promise<boolean>
}

const props = defineProps({
  list: {
    type: Array as PropType<Item[]>,
    default: () => [],
  },
  options: {
    type: Object as PropType<Options>,
    default: () => ({
      key: 'id',
      label: 'name',
    }),
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  beforeChange: {
    type: Function as PropType<BeforeChangeFunction>,
    default: null,
  },
})

const emit = defineEmits(['click-item', 'change', 'context-menu'])

const { $is } = useCurrentInstance()
const { isFunction, isAsyncFunction } = $is

const currentIndex = ref('')

const isEmpty = computed(() => {
  return props.list.length === 0
})

function handleChangeItem(item: Item) {
  emit('click-item', item)

  const index = props.list.findIndex((listItem) => {
    return getObjectAttrValue(listItem, props.options.key) === getObjectAttrValue(item, props.options.key)
  })

  const value = getObjectAttrValue(props.list[index], props.options.key)

  if (props.beforeChange) {
    let changeConfirm: boolean | Promise<boolean>

    if (isAsyncFunction(props.beforeChange)) {
      changeConfirm = new Promise((resolve) => {
        props
          .beforeChange(index, item, value)
          .then((status) => {
            changeConfirm = status
            resolve(status)
          })
          .catch(() => {
            changeConfirm = false
            resolve(false)
          })
      })
    } else {
      changeConfirm = props.beforeChange(index, item, value)
    }

    if (changeConfirm === false) {
      return
    }

    if (index !== -1) {
      currentIndex.value = value
      emit('change', currentIndex.value, props.list[index])
    }
  } else {
    currentIndex.value = value
    emit('change', currentIndex.value, props.list[index])
  }
}

function handleContextMenu(event: MouseEvent, item: Item) {
  handleChangeItem(item)
  nextTick(() => {
    emit('context-menu', event, currentIndex.value, item)
  })
}

defineExpose({
  handleChangeItem,
  handleContextMenu,
})
</script>

<style scoped>
.gc-list .gc-list__item:last-child {
  border-bottom: 0;
}
</style>
