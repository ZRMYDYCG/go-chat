<template>
  <div class="chat-item mx-[10px] overflow-hidden">
    <div v-if="showDate" class="date mx-auto my-[7px] text-center">
      <span class="inline rounded-sm bg-[#dcdcdc] px-[6px] py-[4px] text-[12px] text-[#fff]">{{
        $dataHelpers?.formatDate(message.send_time, 'HH:mm')
      }}</span>
    </div>
    <div class="chat-data" :class="{ 'flex justify-end': isMe }">
      <div v-if="!isMe" class="avatar float-left mr-[15px] h-[40px] w-[40px] shrink-0">
        <img :src="formatServerFilePath(message.avatar)" alt="" />
      </div>
      <div
        class="message relative inline-block min-h-[36px] max-w-[330px] rounded-sm px-[10px] py-[6px] text-[14px] leading-[24px] break-all"
        :class="[
          { 'message--me': isMe },
          isMe ? 'bg-[#b2e281]' : 'bg-[#f0f2f4]',
          isMe
            ? `before:content-[' '] before:absolute before:top-[12px] before:-right-[12px] before:border-[6px] before:border-transparent before:border-l-[#b2e281] before:align-middle`
            : `before:content-[' '] before:absolute before:top-[12px] before:right-[100%] before:border-[6px] before:border-transparent before:border-r-[#f0f2f4]`,
        ]"
      >
        {{ message.content }}
      </div>
      <div v-if="isMe" class="avatar float-right ml-[15px] h-[40px] w-[40px] shrink-0">
        <img :src="formatServerFilePath(message.avatar)" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentInstance } from '@/hooks'
import { defineProps } from 'vue'

interface Message {
  id: string
  user_id: string
  nickname: string
  content: string
  avatar: string
  send_time: string
  is_me: boolean
}

const currentInstance = useCurrentInstance()

const { $common, $dataHelpers } = currentInstance.proxy

const { formatServerFilePath } = $common

const props = defineProps({
  message: {
    type: Object as () => Message,
    required: true,
  },
  isMe: {
    type: Boolean,
    default: false,
  },
  showDate: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped></style>
