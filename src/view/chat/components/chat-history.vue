<template>
  <div class="chat-history h-[100vh] w-[300px] border-r border-r-[#e0e4ea]">
    <GcColumn ref="gcColumnRef">
      <template #header>
        <div class="search">
          <el-input v-model="searchFormMdl.keywords" placeholder="搜索" clearable>
            <template #prefix>
              <i class="ri-search-line"></i>
            </template>
          </el-input>
        </div>
      </template>

      <template #scroll-header>
        <div class="list-title mb-[5px] pl-[15px] text-[14px] leading-[45px] text-[#96a1b1]">聊天记录</div>
      </template>
      <GcList
        ref="chatListRef"
        :list="chatList"
        :options="{
          key: 'reciver_id',
        }"
        @change="handleChangeChatListItem"
      >
        <template #default="{ item }">
          <div class="chat-item flex w-[100%]">
            <div class="user flex w-[100%] items-center">
              <div class="avater mr-[15px] h-[45px] w-[45px] shrink-0">
                <img class="rounded-full" :src="formatServerFilePath(item.avatar)" alt="头像" />
              </div>
              <div class="info flex-1">
                <div class="info-top flex items-center justify-between">
                  <p class="remark nickname truncate text-[15px] font-semibold">{{ item.remark }}</p>
                  <span class="date text-[12px] text-[#404a5b]">{{
                    $dataHelpers.formatDate(item.send_time, 'HH:mm')
                  }}</span>
                </div>

                <div class="info-bottom mt-[5px] flex">
                  <p class="last-message w-0 flex-1 truncate text-[13px] text-[#404a5b]">
                    {{ item.last_message }}
                  </p>
                </div>
              </div>
            </div>
            <div class="oprate" @click.stop>
              <el-dropdown :teleported="false" placement="top" @command="handleOparete($event, item)">
                <el-button link>
                  <i class="ri-more-fill"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="top">置顶聊天</el-dropdown-item>
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
      </GcList>
    </GcColumn>
  </div>
</template>

<script setup lang="ts">
import GcColumn from '@/components/Column/index.vue'
import GcList from '@/components/List/index.vue'
import { useCurrentInstance, useLoadMore, usePageList, useSocket } from '@/hooks'
import useChatStore from '@/store/modules/chat'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { debounce } from 'lodash-es'
import { onActivated, onMounted, ref, watch } from 'vue'

interface ChatItem {
  reciver_id: string
  avatar: string
  remark: string
  send_time: string
  last_message: string
}

interface SearchFormModel {
  keywords: string
}

const { $api, $HTTP_CODE, $common } = useCurrentInstance()
const { formatServerFilePath } = $common
const chatStore = useChatStore()
const { socket } = useSocket()

const searchFormMdl = ref<SearchFormModel>({
  keywords: '',
})

const chatListRef = ref(null)
const gcColumnRef = ref(null)

const {
  list: chatList,
  loadding,
  getPageList,
  handleRefresh,
} = usePageList<ChatItem>({
  getPageListApi: $api.chat.getChatHistoryList,
  searchParams: searchFormMdl,
})

onActivated(async () => {
  await initChatList()
})

const initChatList = async () => {
  await handleRefresh()
  if (chatList.value.length) {
    chatListRef.value?.handleChangeItem(chatList.value[0])
  }
}

onMounted(() => {
  useLoadMore({
    type: 'bottom',
    scrollBottomCallback: getPageList,
    container: gcColumnRef.value?.elScrollbar.wrapRef,
    distance: 150,
  })
})

watch(
  () => chatList.value,
  () => {
    chatStore.updateChatList(chatList.value)
  },
  {
    immediate: true,
    deep: true,
  },
)

socket.on('chat-1v1-to-client', (message: any) => {
  autoRefreshLastMessage(message)
})

const autoRefreshLastMessage = (message: any, userIdKey = 'user_id') => {
  const { content } = message

  chatList.value = chatList.value.map((chat) => {
    if (message[userIdKey] === chat.reciver_id) {
      chat.last_message = content
    }
    return chat
  })
}

const handleChangeChatListItem = debounce((chatId: string, chat: ChatItem) => {
  chatStore.updateActiveChatId(chatId)
}, 300)

socket.on('server:auto-create-chat', () => {
  handleRefresh()
})

const handleOparete = (command: string, chat: ChatItem) => {
  switch (command) {
    case 'delete':
      deleteChat(chat)
      break
    case 'top':
      // topChat();
      break
  }
}

const deleteChat = async (chat: ChatItem) => {
  const { id: chat_id, reciver_id } = chat
  const params = {
    chat_id,
    reciver_id,
  }

  const res = await $api.chat.deleteChat({ params })
  const { code, message } = res.data
  if (code === $HTTP_CODE.HTTP_SUCCESS_CODE) {
    ElMessage.success({
      message,
      duration: 3000,
    })
    await handleRefresh()
  } else {
    ElMessage.error({
      message,
      duration: 3000,
    })
  }
}
</script>

<style scoped>
:deep(.gc-column .gc-column__header) {
  display: flex;
  align-items: center;
  height: 70px;
  padding-left: 15px;
  border-bottom: 1px solid #e0e4ea;
}

:deep(.gc-column .el-scrollbar .gc-list) {
  padding-bottom: 30px;
}
</style>
