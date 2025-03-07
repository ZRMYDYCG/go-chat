<template>
  <div class="gc-list">
    <div class="gc-list__wrapper">
      <a
        v-for="(item, index) in list"
        :key="index"
        href="javascript:void(0)"
        class="gc-list__item"
        :class="{
          'is-active': currentIndex === getObjectAttrValue(item, options.key),
        }"
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

<script>
import { useCurrentInstance } from '@/hooks'
import { get as getObjectAttrValue } from 'lodash'
import { computed, nextTick, ref } from 'vue'

export default {
  name: 'GCList',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => ({
        // 主键key字段
        key: 'id',
        // 展示内容字段
        label: 'name',
      }),
    },
    // item是否可以拖拽
    draggable: {
      type: Boolean,
      default: false,
    },
    // 切换标签前的回调函数，返回 false 可阻止切换，支持返回 Promise
    beforeChange: {
      type: Function,
      default: null,
    },
  },
  emits: ['click-item', 'change', 'context-menu'],
  setup(props, { emit }) {
    const { $is } = useCurrentInstance()
    const { isFunction, isAsyncFunction } = $is

    const currentIndex = ref('')

    const isEmpty = computed(() => {
      return props.list.length === 0
    })

    // 切换item选择
    const handleChangeItem = async (item) => {
      emit('click-item', item)

      const index = props.list.findIndex((listItem) => {
        return getObjectAttrValue(listItem, props.options.key) === getObjectAttrValue(item, props.options.key)
      })

      const value = getObjectAttrValue(props.list[index], props.options.key)

      if (isFunction(props.beforeChange)) {
        let changeConfirm

        if (isAsyncFunction(props.beforeChange)) {
          await new Promise((resolve) => {
            props
              .beforeChange(index, item, value)
              .then((status) => {
                changeConfirm = status
                resolve()
              })
              .catch(() => {
                changeConfirm = false
                resolve()
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

    // 鼠标右键点击
    const handleContextMenu = (event, item) => {
      handleChangeItem(item)
      nextTick(() => {
        emit('context-menu', event, currentIndex.value, item)
      })
    }

    return {
      getObjectAttrValue,
      currentIndex,
      isEmpty,
      handleChangeItem,
      handleContextMenu,
    }
  },
}
</script>

<style scoped>
.gc-list .gc-list__item {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  margin: 0 10px;
  border-bottom: 1px solid #f7f7f7;
  border-radius: 10px;
  transition: background 0.3s;
  color: #333;
}

.gc-list .gc-list__item:hover,
.gc-list .gc-list__item.is-active {
  color: #26224e;
  background: #fff;
  box-shadow: 5px 15px 30px 0px #f0f0f0;
}

.gc-list .gc-list__item:last-child {
  border-bottom: 0;
}
</style>
