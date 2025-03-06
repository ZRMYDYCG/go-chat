<template>
  <div class="contacts flex">
    <!-- 好友列表 -->
    <ContactList
      ref="contactListRef"
      @change="handleContactChange"
      @add-contact="handleShowAddFriendDialog"
    ></ContactList>

    <!-- 好友详情 -->
    <ContactDetail
      v-if="activeContact"
      :contact="activeContact"
      @set-contact-info="handleShowSetContactInfoDialog"
    ></ContactDetail>

    <!-- 添加好友弹窗 -->
    <component
      :is="AddFriendDialogAsyncComp"
      ref="addFriendDialogAsyncCompRef"
      @create-success="handleCreateContactSuccess"
    ></component>

    <!-- 设置好友资料弹窗 -->
    <component
      :is="SetContactInfoDialogAsyncComp"
      ref="setContactInfoDialogRef"
      :active-contact="activeContact"
      @set-success="handleSetContactSuccess"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { useAsyncComponent } from '@/hooks'
import { ref } from 'vue'
import ContactDetail from './components/contact-detail.vue'
import ContactList from './components/contact-list.vue'

// 获取最新选中的好友
const activeContact = ref<any>(null)
const handleContactChange = (contactId, contact) => {
  activeContact.value = contact
}

// 好友列表引用
const contactListRef = ref<InstanceType<typeof ContactList> | null>(null)

// 添加好友弹窗相关
const addFriendDialogAsyncCompRef = ref<InstanceType<typeof AddFriendDialogAsyncComp> | null>(null)
let addFriendDialogAsyncCompTrigger: () => void = () => {}
const { AsyncComponent: AddFriendDialogAsyncComp } = useAsyncComponent({
  component: () => import('@/view/contacts/components/add-contact-dialog.vue'),
  wait: async () => {
    await new Promise((resolve) => {
      addFriendDialogAsyncCompTrigger = resolve as () => void
    })
  },
})

const handleShowAddFriendDialog = () => {
  addFriendDialogAsyncCompTrigger()
  addFriendDialogAsyncCompRef.value?.open()
}

// 添加好友成功回调
const handleCreateContactSuccess = () => {
  contactListRef.value?.handleRefresh()
}

// 设置好友资料弹窗相关
const setContactInfoDialogRef = ref<InstanceType<typeof SetContactInfoDialogAsyncComp> | null>(null)
let setContactInfoDialogTrigger: () => void = () => {}
const { AsyncComponent: SetContactInfoDialogAsyncComp } = useAsyncComponent({
  component: () => import('@/view/contacts/components/set-contect-info-dialog.vue'),
  wait: async () => {
    await new Promise((resolve) => {
      setContactInfoDialogTrigger = resolve as () => void
    })
  },
})

const handleShowSetContactInfoDialog = () => {
  setContactInfoDialogTrigger()
  setContactInfoDialogRef.value?.open()
}

// 设置联系人资料成功回调
const handleSetContactSuccess = () => {
  contactListRef.value?.handleRefresh()
}
</script>

<style scoped></style>
