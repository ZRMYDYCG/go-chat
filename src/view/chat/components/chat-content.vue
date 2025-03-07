<template>
  <div class="chatting h-[100vh] flex-1">
    <GcColumn ref="gcColumnRef" class="dark:bg-gray-900">
      <template #header>
        <div v-if="activeChat" class="user flex w-[100%] dark:bg-gray-900">
          <div class="avater mr-[15px] h-[45px] w-[45px]">
            <img class="rounded-full" :src="$common.formatServerFilePath(activeChat.avatar)" alt="" />
          </div>
          <div class="info flex flex-1 items-center justify-between">
            <div>
              <div class="info-top flex items-center justify-between">
                <p class="nickname text-[15px]">{{ activeChat?.remark }}</p>
              </div>
              <div class="info-bottom flex items-center gap-2 text-[12px] text-[#96a1b1]">
                <span class="h-[10px] w-[10px] rounded-full bg-green-500"></span>
                <p class="desc">在线</p>
              </div>
            </div>
            <div class="mr-3 flex gap-6">
              <el-icon>
                <Phone />
              </el-icon>
              <el-icon>
                <VideoCamera />
              </el-icon>
              <el-icon>
                <More />
              </el-icon>
            </div>
          </div>
        </div>
      </template>
      <div class="chat-list px-[15px] py-[30px] dark:bg-gray-900">
        <ChatItem v-for="message in messageList" :key="message.id" :message="message" :is-me="message.is_me"></ChatItem>
      </div>
      <template #footer>
        <div class="chat-input p-[16px] dark:bg-gray-900">
          <el-input v-model="inputMessage" type="textarea" :rows="3" placeholder="输入消息" resize="none" />
          <div class="chat-input-actions mt-[12px] flex items-center justify-between">
            <div class="left flex items-center">
              <el-button :icon="Picture" circle plain />
              <el-button :icon="Orange" circle plain />
            </div>
            <el-button type="primary" @click="sendMessage(inputMessage)">发送</el-button>
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
import { useUserStore } from '@/store/modules/user.ts'
import { formatDate } from '@/utils/helper/data'
import { Orange, Picture } from '@element-plus/icons-vue'
import { nextTick, onMounted, ref, toRefs, watch } from 'vue'
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
  avatar?: string
}

const emit = defineEmits<{
  (e: 'send-message', item: MessageItem): void
}>()

const { $api } = useCurrentInstance()
const { socket } = useSocket()

const chatStore = useChatStore()
const userStore = useUserStore()

const { activeChat } = toRefs(chatStore)

const searchFormMdl = ref({
  reciver_id: chatStore.activeChat?.reciver_id || '',
  keywords: '',
})
const inputMessage = ref('')
const gcColumnRef = ref(null)

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

function scrollToBottom() {
  nextTick(() => {
    const container = gcColumnRef.value?.elScrollbar.wrapRef
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    gcColumnRef.value?.elScrollbar.scrollTo({
      top: scrollHeight - clientHeight,
    })
  })
}

async function sendMessage(message: string) {
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
  messageList.value.push({ ...item, avatar: userStore.userInfo.avatar || '' })

  // socket发送消息到服务器
  socket.emit('chat-1v1-to-server', item)

  emit('send-message', item)

  inputMessage.value = ''
  scrollToBottom()
}

// 接收socket消息来信
socket.on('chat-1v1-to-client', (message: MessageItem) => {
  messageList.value.push(message)
  scrollToBottom()
})

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

      await nextTick(() => {
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
</script>

<style scoped>
:deep(.gc-column__header) {
  display: flex;
  align-items: center;
  height: 70px;
  padding-left: 15px;
  border-bottom: 1px solid #e0e4ea;
}
</style>
