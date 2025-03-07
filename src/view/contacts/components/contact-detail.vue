<template>
  <div class="contact-detail h-[100vh] flex-1">
    <div class="contact-detail-wrapper mx-auto w-[400px]">
      <div class="base-info flex items-center justify-between border-b-[1px] border-gray-200 pt-[100px] pb-[45px]">
        <div class="left mr-[30px]">
          <div class="nickname flex items-center text-[18px]">
            <span>{{ contact.remark }}</span>
            <img v-if="String(contact.sex) === '0'" class="sex ml-[5px] w-[18px]" src="@/assets/female.png" alt="" />
            <img v-if="String(contact.sex) === '1'" class="sex ml-[5px] w-[18px]" src="@/assets/male.png" alt="" />
            <el-button circle size="small" class="ml-[5px]" title="资料设置" @click="$emit('set-contact-info')">
              <template #icon>
                <el-icon>
                  <EditPen />
                </el-icon>
              </template>
            </el-button>
          </div>
          <div class="desc mt-[5px] text-[14px] break-all text-[#96a1b1]">{{ contact.desc }}</div>
        </div>

        <div class="right">
          <div class="avater h-[45px] w-[45px] shrink-0">
            <img class="rounded-full" :src="$common.formatServerFilePath(contact.avatar)" />
          </div>
        </div>
      </div>

      <div class="other-info pt-[40px] pb-[30px]">
        <div class="info-row flex items-center">
          <div class="lable mr-[30px] text-[#96a1b1]">昵称</div>
          <div class="value">{{ contact.nickname }}</div>
        </div>
        <div class="info-row flex items-center">
          <div class="lable mr-[30px] text-[#96a1b1]">账号</div>
          <div class="value">{{ contact.account }}</div>
        </div>
      </div>

      <div class="oprate mt-[60px]">
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

<style scoped></style>
