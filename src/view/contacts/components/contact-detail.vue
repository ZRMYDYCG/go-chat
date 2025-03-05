<script lang="ts" setup>
interface Contact {
  remark: string
  sex: number | string
  desc: string
  avatar: string
  nickname: string
  account: string
  [key: string]: any
}

interface Props {
  contact?: Contact
}

// 定义 props 和 emits
const emit = defineEmits(['set-contact-info'])

import { withDefaults } from 'vue'
withDefaults(defineProps<Props>(), {
  contact: () => ({
    remark: '',
    sex: '',
    desc: '',
    avatar: '',
    nickname: '',
    account: '',
  }),
})
</script>

<template>
  <div class="contact-detail">
    <div class="contact-detail-wrapper">
      <div class="base-info flex items-center justify-between">
        <div class="left">
          <div class="nickname flex items-center">
            <span>{{ contact.remark }}</span>
            <img v-if="String(contact.sex) === '0'" class="sex" src="~@/assets/default_avatar.png" alt="" />
            <img v-if="String(contact.sex) === '1'" class="sex" src="~@/assets/default_avatar.png" alt="" />
            <el-button circle size="small" class="ml-[5px]" title="资料设置" @click="$emit('set-contact-info')">
              <template #icon>
                <i class="ri-edit-box-line"></i>
              </template>
            </el-button>
          </div>
          <div class="desc">{{ contact.desc }}</div>
        </div>

        <div class="right">
          <div class="avater">
            <img :src="contact.avater" alt="" />
          </div>
        </div>
      </div>

      <div class="other-info">
        <div class="info-row flex items-center">
          <div class="lable">名称</div>
          <div class="value">{{ contact.nickname }}</div>
        </div>
        <div class="info-row flex items-center">
          <div class="lable">账号</div>
          <div class="value">{{ contact.account }}</div>
        </div>
      </div>

      <div class="oprate">
        <el-button type="primary" class="mx-auto !block w-[140px]">发消息</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './contact-detail.css';
</style>
