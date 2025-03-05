<script setup lang="ts">
import { useAsyncComponent } from '@/hooks'
import { ref, type Component } from 'vue'
import ContactDetail from './components/contact-detail.vue'
import ContactList from './components/contact-list.vue'

// 类型定义
interface Contact {
  id: string
  [key: string]: any
}

// 好友选择逻辑
const activeContact = ref<Contact | null>(null)
const handleContactChange = (contactId: string, contact: Contact) => {
  activeContact.value = contact
}

// 异步组件类型扩展
interface DialogExposedMethods {
  open: () => void
}

// 添加好友弹窗逻辑
let addContactDialogTrigger: (() => void) | null = null
const { AsyncComponent: AddContactDialogAsyncComp } = useAsyncComponent<Component>({
  component: () => import('./components/add-contact-dialog.vue'),
  wait: () =>
    new Promise<void>((resolve) => {
      addContactDialogTrigger = resolve
    }),
})
const addContactDialogRef = ref<DialogExposedMethods | null>(null)
const handleShowAddContactDialog = async () => {
  addContactDialogTrigger?.()
  addContactDialogRef.value?.open()
}

// 设置资料弹窗逻辑
let setContactInfoDialogTrigger: (() => void) | null = null
const { AsyncComponent: SetContactInfoDialogAsyncComp } = useAsyncComponent<Component>({
  component: () => import('./components/set-contect-info-dialog.vue'),
  wait: () =>
    new Promise<void>((resolve) => {
      setContactInfoDialogTrigger = resolve
    }),
})
const setContactInfoDialogRef = ref<DialogExposedMethods | null>(null)
const handleShowSetContactInfoDialog = () => {
  setContactInfoDialogTrigger?.()
  setContactInfoDialogRef.value?.open()
}
</script>

<template>
  <div class="contacts flex">
    <!-- 好友列表 -->
    <ContactList @change="handleContactChange" @add-contact="handleShowAddContactDialog"></ContactList>
    <!-- 好友详情 -->
    <ContactDetail
      v-if="activeContact"
      :contact="activeContact"
      @set-contact-info="handleShowSetContactInfoDialog"
    ></ContactDetail>
    <!-- 添加好友弹窗 -->
    <component :is="AddContactDialogAsyncComp" ref="addContactDialogRef"></component>
    <!-- 设置好友资料弹窗 -->
    <component :is="SetContactInfoDialogAsyncComp" ref="setContactInfoDialogRef"></component>
  </div>
</template>

<style scoped></style>
