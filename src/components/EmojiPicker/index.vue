<template>
  <el-popover :width="400" trigger="click" @show="handlePopoverShow" @hide="handlePopoverHide">
    <template #reference>
      <div @mousedown.prevent="handleTriggerMouseDown" @click="handleTriggerClick">
        <slot name="trigger"></slot>
      </div>
    </template>

    <!-- 表情分类标签 -->
    <div class="flex border-b">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="relative px-4 py-2 text-sm"
        :class="{
          'text-blue-500': selectedTab === tab.id,
          'text-gray-600': selectedTab !== tab.id,
        }"
        @click="selectedTab = tab.id"
      >
        {{ tab.label }}
        <!-- 底部指示条 -->
        <div v-if="selectedTab === tab.id" class="absolute right-0 bottom-0 left-0 h-0.5 bg-blue-500"></div>
      </button>
    </div>

    <!-- 表情展示区域 -->
    <el-scrollbar height="200">
      <div v-if="selectedTab === 'default'" class="grid grid-cols-8 gap-2">
        <button
          v-for="(emoji, index) in defaultEmojis"
          :key="index"
          class="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
          @click="handleSelect(emoji)"
        >
          <span class="text-2xl">{{ emoji.char }}</span>
        </button>
      </div>

      <div v-if="selectedTab === 'favorite'" class="grid grid-cols-8 gap-2">
        <button
          v-for="(emoji, index) in favoriteEmojis"
          :key="index"
          class="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
          @click="handleSelect(emoji)"
        >
          <img v-if="emoji.type === 'custom'" :src="emoji.url" class="h-6 w-6 object-contain" />
          <span v-else class="text-2xl">{{ emoji.char }}</span>
        </button>

        <div v-if="favoriteEmojis.length === 0" class="col-span-8 py-4 text-center text-sm text-gray-400">
          暂无收藏表情
        </div>
      </div>
    </el-scrollbar>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emoji {
  id: string
  char?: string // 系统emoji字符
  url?: string // 自定义表情URL
  type: 'system' | 'custom'
}

const props = defineProps<{
  favoriteEmojis: Emoji[] // 收藏的表情列表
}>()

const emit = defineEmits<{
  (e: 'select', payload: Emoji): void
  (e: 'popover-show'): void
  (e: 'popover-hide'): void
}>()

const popoverVisible = ref(false)
let shouldOpen = false

// 标签页配置
const tabs = [
  { id: 'default', label: '默认' },
  { id: 'favorite', label: '收藏' },
]

// 默认表情
const defaultEmojis: Emoji[] = [
  { id: '1', char: '😀', type: 'system' },
  { id: '2', char: '😃', type: 'system' },
  { id: '3', char: '😄', type: 'system' },
  { id: '4', char: '😁', type: 'system' },
  { id: '5', char: '😆', type: 'system' },
  { id: '6', char: '😅', type: 'system' },
  { id: '7', char: '😂', type: 'system' },
  { id: '8', char: '🤣', type: 'system' },
  { id: '9', char: '😊', type: 'system' },
  { id: '10', char: '😇', type: 'system' },
  { id: '11', char: '🙂', type: 'system' },
  { id: '12', char: '🙃', type: 'system' },
  { id: '13', char: '😉', type: 'system' },
  { id: '14', char: '😌', type: 'system' },
  { id: '15', char: '😍', type: 'system' },
  { id: '16', char: '🥰', type: 'system' },
  { id: '17', char: '😘', type: 'system' },
  { id: '18', char: '😗', type: 'system' },
  { id: '19', char: '😙', type: 'system' },
  { id: '20', char: '😚', type: 'system' },
  { id: '21', char: '🙌', type: 'system' },
  { id: '22', char: '🤓', type: 'system' },
  { id: '23', char: '😎', type: 'system' },
  { id: '24', char: '🤗', type: 'system' },
  { id: '25', char: '🤔', type: 'system' },
  { id: '26', char: '🤭', type: 'system' },
  { id: '27', char: '🤫', type: 'system' },
  { id: '28', char: '🤥', type: 'system' },
  { id: '29', char: '😏', type: 'system' },
  { id: '30', char: '😣', type: 'system' },
  { id: '31', char: '😥', type: 'system' },
  { id: '32', char: '😮', type: 'system' },
  { id: '33', char: '🤐', type: 'system' },
  { id: '34', char: '😯', type: 'system' },
  { id: '35', char: '😪', type: 'system' },
  { id: '36', char: '😫', type: 'system' },
  { id: '37', char: '😴', type: 'system' },
  { id: '38', char: '😌', type: 'system' },
  { id: '39', char: '😛', type: 'system' },
  { id: '40', char: '😜', type: 'system' },
  { id: '41', char: '😝', type: 'system' },
  { id: '42', char: '🤤', type: 'system' },
  { id: '43', char: '😒', type: 'system' },
  { id: '44', char: '😓', type: 'system' },
  { id: '45', char: '😔', type: 'system' },
  { id: '46', char: '😕', type: 'system' },
  { id: '47', char: '🙃', type: 'system' },
  { id: '48', char: '🤑', type: 'system' },
  { id: '49', char: '😲', type: 'system' },
  { id: '50', char: '☹️', type: 'system' },
  { id: '51', char: '🙁', type: 'system' },
  { id: '52', char: '😖', type: 'system' },
  { id: '53', char: '😞', type: 'system' },
  { id: '54', char: '😟', type: 'system' },
  { id: '55', char: '😤', type: 'system' },
  { id: '56', char: '😢', type: 'system' },
  { id: '57', char: '😭', type: 'system' },
  { id: '58', char: '😦', type: 'system' },
  { id: '59', char: '😧', type: 'system' },
  { id: '60', char: '😨', type: 'system' },
  { id: '61', char: '😩', type: 'system' },
  { id: '62', char: '🤯', type: 'system' },
  { id: '63', char: '😬', type: 'system' },
  { id: '64', char: '😰', type: 'system' },
  { id: '65', char: '😱', type: 'system' },
  { id: '66', char: '🥵', type: 'system' },
  { id: '67', char: '🥶', type: 'system' },
  { id: '68', char: '😳', type: 'system' },
  { id: '69', char: '🤪', type: 'system' },
  { id: '70', char: '😵', type: 'system' },
  { id: '71', char: '😡', type: 'system' },
  { id: '72', char: '😠', type: 'system' },
  { id: '73', char: '🤬', type: 'system' },
  { id: '74', char: '🤡', type: 'system' },
  { id: '75', char: '🤥', type: 'system' },
  { id: '76', char: '😷', type: 'system' },
  { id: '77', char: '🤒', type: 'system' },
  { id: '78', char: '🤕', type: 'system' },
  { id: '79', char: '🤢', type: 'system' },
  { id: '80', char: '🤮', type: 'system' },
  { id: '81', char: '🤧', type: 'system' },
  { id: '82', char: '😇', type: 'system' },
  { id: '83', char: '🤠', type: 'system' },
  { id: '84', char: '🤡', type: 'system' },
  { id: '85', char: '🤥', type: 'system' },
  { id: '86', char: '😈', type: 'system' },
  { id: '87', char: '👿', type: 'system' },
  { id: '88', char: '👹', type: 'system' },
  { id: '89', char: '👺', type: 'system' },
  { id: '90', char: '🤡', type: 'system' },
  { id: '91', char: '💩', type: 'system' },
  { id: '92', char: '👻', type: 'system' },
  { id: '93', char: '💀', type: 'system' },
  { id: '94', char: '☠️', type: 'system' },
  { id: '95', char: '👽', type: 'system' },
  { id: '96', char: '👾', type: 'system' },
  { id: '97', char: '🤖', type: 'system' },
  { id: '98', char: '🎃', type: 'system' },
  { id: '99', char: '😺', type: 'system' },
  { id: '100', char: '😸', type: 'system' },
  { id: '101', char: '😹', type: 'system' },
  { id: '102', char: '😻', type: 'system' },
  { id: '103', char: '😼', type: 'system' },
  { id: '104', char: '😽', type: 'system' },
  { id: '105', char: '🙀', type: 'system' },
  { id: '106', char: '😿', type: 'system' },
  { id: '107', char: '😾', type: 'system' },
  { id: '108', char: '🙈', type: 'system' },
  { id: '109', char: '🙉', type: 'system' },
  { id: '110', char: '🙊', type: 'system' },
  { id: '111', char: '💋', type: 'system' },
  { id: '112', char: '💌', type: 'system' },
  { id: '113', char: '💘', type: 'system' },
  { id: '114', char: '💝', type: 'system' },
  { id: '115', char: '💖', type: 'system' },
  { id: '116', char: '💗', type: 'system' },
  { id: '117', char: '💓', type: 'system' },
  { id: '118', char: '💞', type: 'system' },
  { id: '119', char: '💕', type: 'system' },
  { id: '120', char: '💟', type: 'system' },
  { id: '121', char: '❤️', type: 'system' },
  { id: '122', char: '🧡', type: 'system' },
  { id: '123', char: '💛', type: 'system' },
  { id: '124', char: '💚', type: 'system' },
  { id: '125', char: '💙', type: 'system' },
  { id: '126', char: '💜', type: 'system' },
  { id: '127', char: '🖤', type: 'system' },
  { id: '128', char: '🤍', type: 'system' },
  { id: '129', char: '🤎', type: 'system' },
  { id: '130', char: '🌈', type: 'system' },
  { id: '131', char: '🌹', type: 'system' },
  { id: '132', char: '🥀', type: 'system' },
  { id: '133', char: '🌺', type: 'system' },
  { id: '134', char: '🌸', type: 'system' },
  { id: '135', char: '🌼', type: 'system' },
  { id: '136', char: '🌷', type: 'system' },
  { id: '137', char: '🌱', type: 'system' },
  { id: '138', char: '🌲', type: 'system' },
  { id: '139', char: '🌳', type: 'system' },
  { id: '140', char: '🌴', type: 'system' },
  { id: '141', char: '🌵', type: 'system' },
  { id: '142', char: '🌾', type: 'system' },
  { id: '143', char: '🌿', type: 'system' },
  { id: '144', char: '🍀', type: 'system' },
  { id: '145', char: '🍁', type: 'system' },
  { id: '146', char: '🍂', type: 'system' },
  { id: '147', char: '🍃', type: 'system' },
  { id: '148', char: '🍇', type: 'system' },
  { id: '149', char: '🍈', type: 'system' },
  { id: '150', char: '🍉', type: 'system' },
  { id: '151', char: '🍊', type: 'system' },
  { id: '152', char: '🍋', type: 'system' },
]

const selectedTab = ref<'default' | 'favorite'>('default')

const handleSelect = (emoji: Emoji) => {
  emit('select', emoji)
}

// 修改后的触发逻辑
const handleTriggerMouseDown = (e: MouseEvent) => {
  e.preventDefault()
  shouldOpen = !popoverVisible.value
}

const handleTriggerClick = () => {
  if (shouldOpen) {
    popoverVisible.value = true
  }
}

// 新增popover事件处理
const handlePopoverShow = () => {
  // 通知父组件保持焦点
  emit('popover-show')
}

const handlePopoverHide = () => {
  popoverVisible.value = false
  // 通知父组件恢复焦点（如果需要）
  emit('popover-hide')
}
</script>
