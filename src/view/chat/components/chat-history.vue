<template>
  <div class="chat-history h-screen w-[300px]">
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
        <div class="list-title">聊天记录</div>
      </template>
      <GcList
        ref="chatListRef"
        :list="chatList"
        :options="{
          key: 'user_id',
        }"
        @change="handleChangeChatListItem"
      >
        <template #default="{ item }">
          <div class="chat-item flex w-[100%]">
            <div class="user flex w-[100%] items-center">
              <div class="avater">
                <img :src="item.avatar" alt="" />
              </div>
              <div class="info">
                <div class="info-top flex items-center justify-between">
                  <p class="nickname">{{ item.nickname }}</p>
                  <span class="date">{{ $date.formatDate(item.send_time, 'HH:mm') }}</span>
                </div>

                <div class="info-bottom flex">
                  <p class="last-message truncate">
                    {{ item.last_message }}
                  </p>
                </div>
              </div>
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
import { useCurrentInstance, useLoadMore, usePageList } from '@/hooks'
import useChatStore from '@/store/modules/chat'
import { debounce } from 'lodash-es'
import { onMounted, ref, watch } from 'vue'

const { $api } = useCurrentInstance()
const chatStore = useChatStore()

interface SearchFormModel {
  keywords: string
}

interface ChatItem {
  user_id: string
  avatar: string
  nickname: string
  send_time: string
  last_message: string
}

const searchFormMdl = ref<SearchFormModel>({
  keywords: '',
})

const chatListRef = ref<any>(null)

const {
  list: chatList,
  loading, // 这里应该是 loading 而不是 loadding
  getPageList,
} = usePageList<ChatItem>({
  getPageListApi: $api.chat.getChatHistoryList,
  searchParams: searchFormMdl,
})

onMounted(async () => {
  await getPageList()
  if (chatList.value.length) {
    chatListRef.value?.handleChangeItem(chatList.value[0])
  }
})

const gcColumnRef = ref<any>(null)
onMounted(() => {
  useLoadMore({
    type: 'bottom',
    scrollBottomCallback: getPageList,
    container: gcColumnRef.value?.elScrollbar.wrapRef,
    distance: 150,
  })
})

watch(
  chatList,
  () => {
    chatStore.updateChatList(chatList.value)
  },
  {
    immediate: true,
    deep: true,
  },
)

const handleChangeChatListItem = debounce((chatId: string, chat: ChatItem) => {
  // console.log('聊天记录item切换', chatId, chat)
  chatStore.updateActiveChatId(chatId)
}, 300)
</script>

<style scoped>
.chat-history {
  width: 300px;
  height: 100vh;
  border-right: 1px solid #e0e4ea;
}

.chat-history :deep(.gc-column .gc-column__header) {
  display: flex;
  align-items: center;
  height: 70px;
  padding-left: 15px;
  border-bottom: 1px solid #e0e4ea;
}

.chat-history :deep(.gc-column .list-title) {
  font-size: 14px;
  color: #96a1b1;
  line-height: 45px;
  padding-left: 15px;
  margin-bottom: 5px;
}

.chat-history :deep(.gc-column .el-scrollbar .gc-list) {
  padding-bottom: 30px;
}

.chat-history :deep(.gc-column .el-scrollbar .gc-list .gc-list__item .chat-item .user .avater) {
  flex-shrink: 0;
  width: 45px;
  height: 45px;
  margin-right: 15px;
}

.chat-history :deep(.gc-column .el-scrollbar .gc-list .gc-list__item .chat-item .user .avater img) {
  border-radius: 50%;
}

.chat-history :deep(.gc-column .el-scrollbar .gc-list .gc-list__item .chat-item .user .info) {
  flex: 1;
}

.chat-history :deep(.gc-column .el-scrollbar .gc-list .gc-list__item .chat-item .user .info-top .nickname) {
  font-size: 15px;
  font-weight: 600;
}

.chat-history :deep(.gc-column .el-scrollbar .gc-list .gc-list__item .chat-item .user .info-top .date) {
  color: #404a5b;
  font-size: 12px;
}

.chat-history :deep(.gc-column .el-scrollbar .gc-list .gc-list__item .chat-item .user .info-bottom) {
  margin-top: 5px;
}

.chat-history :deep(.gc-column .el-scrollbar .gc-list .gc-list__item .chat-item .user .info-bottom .last-message) {
  width: 0;
  flex: 1;
  font-size: 13px;
  color: #404a5b;
}
</style>
