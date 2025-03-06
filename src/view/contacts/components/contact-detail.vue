<template>
  <div class="contact-detail">
    <div class="contact-detail-wrapper">
      <div class="base-info flex items-center justify-between">
        <div class="left">
          <div class="nickname flex items-center">
            <span>{{ contact.remark }}</span>
            <img v-if="String(contact.sex) === '0'" class="sex" src="@/assets/female.png" alt="" />
            <img v-if="String(contact.sex) === '1'" class="sex" src="@/assets/male.png" alt="" />
            <el-button circle size="small" class="ml-[5px]" title="资料设置" @click="$emit('set-contact-info')">
              <template #icon>
                <el-icon><EditPen /></el-icon>
              </template>
            </el-button>
          </div>
          <div class="desc">{{ contact.desc }}</div>
        </div>

        <div class="right">
          <div class="avater">
            <img :src="$common.formatServerFilePath(contact.avatar)" />
          </div>
        </div>
      </div>

      <div class="other-info">
        <div class="info-row flex items-center">
          <div class="lable">昵称</div>
          <div class="value">{{ contact.nickname }}</div>
        </div>
        <div class="info-row flex items-center">
          <div class="lable">账号</div>
          <div class="value">{{ contact.account }}</div>
        </div>
      </div>

      <div class="oprate">
        <el-button type="primary" class="mx-auto !block w-[140px]" @click="handleGoSendMessage">发消息</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentInstance } from '@/hooks'
import useChatStore from '@/store/modules/chat'
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash-es'
import { defineEmits, defineProps } from 'vue'
import { useRouter } from 'vue-router'

interface Contact {
  remark: string
  sex: string
  desc: string
  avatar: string
  nickname: string
  account: string
  reciver_id: string
}

const props = defineProps<{
  contact: Contact
}>()

const emit = defineEmits<{
  (event: 'set-contact-info'): void
}>()

const chatStore = useChatStore()
const router = useRouter()
const { $api, $HTTP_CODE } = useCurrentInstance()

const handleGoSendMessage = debounce(() => {
  const hasChat = chatStore.chatList.some((chat) => {
    return chat.reciver_id === props.contact.reciver_id
  })

  if (!hasChat) {
    createChat(props.contact)
  } else {
    router.push({ path: '/chat/main' })
  }
}, 50)

const createChat = async (contact: Contact) => {
  const { reciver_id } = contact
  const params = {
    reciver_id,
    type: '0',
  }

  const res = await $api.chat.createChat(params)
  const { code, message } = res.data
  if (code === $HTTP_CODE.HTTP_SUCCESS_CODE) {
    await router.push({ path: '/chat/main' })
  } else {
    if (code === 400001002) {
      await router.push({ path: '/chat/main' })
    } else {
      ElMessage.error({
        message,
        duration: 3000,
      })
    }
  }
}
</script>

<style scoped>
@import './contact-detail.css';
</style>
