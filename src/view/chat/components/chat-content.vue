<template>
  <div class="chatting">
    <GcColumn ref="gcColumnRef">
      <template #header>
        <div v-if="chatStore.activeChat" class="user flex w-[100%]">
          <div class="avater">
            <img :src="chatStore.activeChat.avater" alt="" />
          </div>
          <div class="info flex flex-col justify-center">
            <div class="info-top flex items-center justify-between">
              <p class="nickname">{{ chatStore.activeChat.nickname }}</p>
            </div>

            <div class="info-bottom flex">
              <p class="desc">{{ chatStore.activeChat.slogan }}</p>
            </div>
          </div>
        </div>
      </template>

      <div class="chat-list">
        <ChatItem v-for="message in messageList" :key="message.id" :message="message" :is-me="message.is_me"></ChatItem>
      </div>

      <template #footer>
        <div class="chat-input flex items-center justify-around">
          <div
            ref="inputRef"
            class="input"
            :contenteditable="Boolean(chatStore.activeChat)"
            placeholder="输入聊天内容..."
          ></div>

          <div class="chat-oprate">
            <a href="javascript:void(0)">
              <i class="ri-emotion-happy-line"></i>
            </a>
            <a href="javascript:void(0)">
              <i class="ri-landscape-line"></i>
            </a>
            <a href="javascript:void(0)" @click="handleSendMessage">
              <i class="ri-send-plane-line"></i>
            </a>
          </div>
        </div>
      </template>
    </GcColumn>
  </div>
</template>

<script setup lang="ts">
import GcColumn from '@/components/Column/index.vue'
import { useCurrentInstance, useLoadMore, usePageList, useSocket } from '@/hooks'
import useChatStore from '@/store/modules/chat'
import { formatDate } from '@/utils/helper/data'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ChatItem from './chat-item.vue'

interface MessageItem {
  id: string
  chat_id: string
  user_id: string
  content: string
  reciver_id: string
  send_time: string
  type: string
  is_me: boolean
}

const emit = defineEmits<{
  (e: 'send-message', item: MessageItem): void
}>()

const { $api } = useCurrentInstance()
const chatStore = useChatStore()
const { socket } = useSocket()

const searchFormMdl = ref({
  reciver_id: chatStore.activeChat?.reciver_id || '',
  keywords: '',
})

// 消息列表
const {
  list: messageList,
  loadding,
  refreshPageList,
  loadMore,
} = usePageList<MessageItem>({
  getPageListApi: $api.message.getChatMessageList,
  searchParams: searchFormMdl,
  dataAppend: 'start',
})

const scrollToBottom = () => {
  nextTick(() => {
    const container = gcColumnRef.value?.elScrollbar.wrapRef
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    gcColumnRef.value?.elScrollbar.scrollTo({
      top: scrollHeight - clientHeight,
    })
  })
}

const gcColumnRef = ref(null)

watch(
  () => chatStore.activeChat?.reciver_id,
  async () => {
    if (chatStore.activeChat) {
      searchFormMdl.value.reciver_id = chatStore.activeChat.reciver_id
      await refreshPageList()
      scrollToBottom()
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  // 加载更多聊天记录
  useLoadMore({
    type: 'top',
    scrollTopCallback: async () => {
      const container = gcColumnRef.value?.elScrollbar.wrapRef

      // 加载更多前的scrollHeight
      const scrollHeightBefore = container.scrollHeight

      await loadMore()

      nextTick(() => {
        const scrollHeightAfter = container.scrollHeight

        // 维持原有滚动位置需要滚动的距离
        const needScrollDistance = scrollHeightAfter - scrollHeightBefore
        gcColumnRef.value?.elScrollbar.scrollTo({
          top: needScrollDistance,
        })
      })
    },
    container: gcColumnRef.value?.elScrollbar.wrapRef,
    distance: 0,
  })
})

// 聊天输入框
const inputRef = ref<HTMLDivElement | null>(null)

const sendMessage = async (message: string) => {
  if (message === '') {
    return false
  }
  const item: MessageItem = {
    id: Date.now().toString(), // 生成一个唯一ID
    chat_id: chatStore.activeChat?.id || '',
    user_id: chatStore.activeChat?.user_id || '',
    content: message,
    reciver_id: chatStore.activeChat?.reciver_id || '',
    send_time: formatDate(new Date()),
    type: '0',
    is_me: true,
  }
  messageList.value.push(item)

  // socket发送消息到服务器
  socket.emit('chat-1v1-to-server', item)

  emit('send-message', item)
}

// 接收socket消息来信
socket.on('chat-1v1-to-client', (message: MessageItem) => {
  messageList.value.push(message)
  scrollToBottom()
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()

    // 执行发送聊天消息
    sendMessage((e.target as HTMLDivElement).innerHTML).then(() => {
      scrollToBottom()
      ;(e.target as HTMLDivElement).innerHTML = ''
    })
  }
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.addEventListener('keydown', handleKeyDown)
  }
})

onBeforeUnmount(() => {
  if (inputRef.value) {
    inputRef.value.removeEventListener('keydown', handleKeyDown)
  }
})

const handleSendMessage = () => {
  if (inputRef.value) {
    // 执行发送聊天消息
    sendMessage(inputRef.value.innerHTML).then(() => {
      scrollToBottom()
      inputRef.value!.innerHTML = ''
    })
  }
}
</script>

<style scoped>
.chatting {
  flex: 1;
  height: 850px;
}

.chatting :deep(.gc-column__header) {
  display: flex;
  align-items: center;
  height: 70px;
  padding-left: 15px;
  border-bottom: 1px solid #e0e4ea;
}

.chatting :deep(.gc-column__header .user .avater) {
  width: 45px;
  height: 45px;
  margin-right: 15px;
}

.chatting :deep(.gc-column__header .user .avater img) {
  border-radius: 50%;
}

.chatting :deep(.gc-column__header .user .info) {
  flex: 1;
}

.chatting :deep(.gc-column__header .user .info-top .nickname) {
  font-size: 15px;
  font-weight: 600;
}

.chatting :deep(.gc-column__header .user .info-bottom) {
  font-size: 12px;
  color: #96a1b1;
}

.chatting :deep(.el-scrollbar .chat-list) {
  padding: 30px 15px;
}

.chatting :deep(.gc-column__footer) {
  padding: 15px;
}

.chatting :deep(.gc-column__footer .chat-input) {
  padding: 15px;
  background-color: #edeff0;
  border-radius: 15px;
}

.chatting :deep(.gc-column__footer .chat-input .input) {
  max-width: 500px;
  height: 31px;
  width: 100%;
  outline: 0;
  overflow-y: auto;
}

.chatting :deep(.gc-column__footer .chat-input .input::before) {
  content: attr(placeholder);
  color: #bbb;
}

.chatting :deep(.gc-column__footer .chat-input .chat-oprate a) {
  font-size: 20px;
  padding: 5px;
}

.chatting :deep(.gc-column__footer .chat-input .chat-oprate a i) {
  color: #8792a5;
}
</style>
