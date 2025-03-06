import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const useChatStore = defineStore('chatStore', () => {
  // 聊天记录列表
  const chatList = ref<any[]>([])
  const updateChatList = (list: any[]) => {
    chatList.value = list
  }

  // 正在进行中的聊天id
  const activeChatId = ref()
  const updateActiveChatId = (id: number) => {
    activeChatId.value = id
  }

  // 正在进行中的聊天
  const activeChat = computed(() => {
    const index = chatList.value.findIndex((chat) => {
      return chat.reciver_id === activeChatId.value
    })

    if (index > -1) {
      return chatList.value[index]
    } else {
      return null
    }
  })

  return {
    chatList,
    updateChatList,
    activeChatId,
    updateActiveChatId,
    activeChat,
  }
})

export default useChatStore
