<template>
  <div class="chatting">
    <GcColumn ref="gcColumnRef">
      <template #header>
        <div v-if="chatStore.activeChat" class="user flex w-[100%]">
          <div class="avater">
            <img :src="chatStore.activeChat.avatar" alt="" />
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
            @keydown="handleKeyDown"
          ></div>

          <div class="chat-oprate">
            <a href="javascript:void(0)">
              <i class="ri-emotion-happy-line"></i>
            </a>
            <a href="javascript:void(0)">
              <i class="ri-landscape-line"></i>
            </a>
            <a href="javascript:void(0)">
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
import { useCurrentInstance, useLoadMore, usePageList } from '@/hooks'
import useChatStore from '@/store/modules/chat'
import { formatDate } from '@/utils/helper/data'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ChatItem from './chat-item.vue'

const { $api } = useCurrentInstance()
const chatStore = useChatStore()

const searchFormMdl = ref({
  keywords: '',
})

// 消息列表
const {
  list: messageList,
  loadding,
  refreshPageList,
  loadMore,
} = usePageList({
  getPageListApi: $api.message.getChatMessageList,
  searchParams: searchFormMdl,
  dataAppend: 'start',
})

const gcColumnRef = ref<InstanceType<typeof GcColumn>>()
const inputRef = ref<HTMLDivElement>()

const scrollToBottom = () => {
  nextTick(() => {
    const container = gcColumnRef.value?.elScrollbar.wrapRef
    if (container) {
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight
      gcColumnRef.value?.elScrollbar.scrollTo({
        top: scrollHeight - clientHeight,
      })
    }
  })
}

watch(
  () => chatStore.activeChat?.user_id,
  async () => {
    await refreshPageList()
    scrollToBottom()
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
      if (container) {
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
      }
    },
    container: gcColumnRef.value?.elScrollbar.wrapRef,
    distance: 150,
  })
})

const sendMessage = (message: string) => {
  const item = {
    id: 'id',
    user_id: 'user_id',
    nickname: 'nickname',
    message,
    reciver_id: chatStore.activeChat.user_id,
    avater: chatStore.activeChat.avater,
    is_me: true,
    read: 0,
    send_time: formatDate(new Date()),
    create_time: 'create_time',
  }
  messageList.value.push(item)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()

    // 执行发送聊天消息
    const target = e.target as HTMLDivElement
    sendMessage(target.innerHTML)
    scrollToBottom()
    // console.log('执行发送聊天消息', target.innerHTML)
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
</script>

<style scoped>
.chatting {
  flex: 1;
  height: 100vh;
}

.chatting .gc-column :deep(.gc-column__header) {
  display: flex;
  align-items: center;
  height: 70px;
  padding-left: 15px;
  border-bottom: 1px solid #e0e4ea;
}

.chatting .gc-column :deep(.gc-column__header .user .avater) {
  width: 45px;
  height: 45px;
  margin-right: 15px;
}

.chatting .gc-column :deep(.gc-column__header .user .avater img) {
  border-radius: 50%;
}

.chatting .gc-column :deep(.gc-column__header .user .info) {
  flex: 1;
}

.chatting .gc-column :deep(.gc-column__header .user .info-top .nickname) {
  font-size: 15px;
  font-weight: 600;
}

.chatting .gc-column :deep(.gc-column__header .user .info-bottom) {
  font-size: 12px;
  color: #96a1b1;
}

.chatting .gc-column :deep(.el-scrollbar .chat-list) {
  padding: 30px 15px;
}

.chatting .gc-column :deep(.gc-column__footer) {
  padding: 15px;
}

.chatting .gc-column :deep(.gc-column__footer .chat-input) {
  padding: 15px;
  background-color: #edeff0;
  border-radius: 15px;
}

.chatting .gc-column :deep(.gc-column__footer .chat-input .input) {
  max-width: 500px;
  height: 31px;
  width: 100%;
  outline: 0;
  overflow-y: auto;
}

.chatting .gc-column :deep(.gc-column__footer .chat-input .input:empty::before) {
  content: attr(placeholder);
  color: #bbb;
}

.chatting .gc-column :deep(.gc-column__footer .chat-input .chat-oprate a) {
  font-size: 20px;
  padding: 5px;
}

.chatting .gc-column :deep(.gc-column__footer .chat-input .chat-oprate a i) {
  color: #8792a5;
}
</style>
