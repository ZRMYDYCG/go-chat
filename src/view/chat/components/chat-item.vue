<template>
  <div class="chat-item" :class="{ 'chat-item--me': isMe }">
    <div v-if="showDate" class="date">
      <span>{{ $date.formatDate(message.send_time, 'HH:mm') }}</span>
    </div>

    <div class="chat-data" :class="{ 'flex justify-end': isMe }">
      <div v-if="!isMe" class="avater float-left mr-[15px]">
        <img :src="message.avatar" alt="" />
      </div>
      <div class="message relative inline-block" :class="{ 'message--me': isMe }">
        {{ message.content }}
      </div>
      <div v-if="isMe" class="avater float-right ml-[15px]">
        <img src="@/assets/default_avatar.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

<style scoped>
.chat-item {
  margin: 10px 0;
  overflow: hidden;
}
.chat-item .date {
  text-align: center;
  margin: 7px auto;
}
.chat-item .date span {
  display: inline-block;
  padding: 4px 6px;
  color: #fff;
  font-size: 12px;
  border-radius: 3px;
  background-color: #dcdcdc;
}

.chat-item .chat-data .avater {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
}
.chat-item .chat-data .avater img {
  border-radius: 50%;
}

.chat-item .chat-data .message {
  display: inline-block;
  position: relative;
  padding: 6px 10px;
  max-width: 330px;
  min-height: 36px;
  line-height: 24px;
  font-size: 14px;
  word-break: break-all;
  background-color: #f0f2f4;
  border-radius: 4px;
}
.chat-item .chat-data .message::before {
  content: ' ';
  position: absolute;
  top: 12px;
  right: 100%;
  border: 6px solid transparent;
  border-right-color: #f0f2f4;
}

.chat-item .chat-data .message.message--me {
  background-color: #b2e281;
}
.chat-item .chat-data .message.message--me::before {
  right: -12px;
  vertical-align: middle;
  border-right-color: transparent;
  border-left-color: #b2e281;
}
</style>
