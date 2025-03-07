<script setup lang="ts">
import GcColumn from '@/components/Column/index.vue'
import GcList from '@/components/List/index.vue'
import { useCurrentInstance, useLoadMore, usePageList } from '@/hooks'
import useChatStore from '@/store/modules/chat.ts'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

interface Contact {
  reciver_id: string
  avatar: string
  remark: string
  id: string
}

const emit = defineEmits(['change', 'add-contact', 'show-new-contact'])

const { $api, $HTTP_CODE, $common } = useCurrentInstance()
const { formatServerFilePath } = $common

const chatStore = useChatStore()

const searchFormMdl = ref({
  keywords: '',
})

const contactListRef = ref(null)

const {
  list: contactList,
  loadding,
  getPageList,
  handleRefresh,
} = usePageList<Contact>({
  getPageListApi: $api.contact.getContactList,
  searchParams: searchFormMdl,
})

onMounted(async () => {
  await getPageList()
  contactList.value.length && contactListRef.value.handleChangeItem(contactList.value[0])
})

const gcColumnRef = ref(null)
onMounted(() => {
  useLoadMore({
    type: 'bottom',
    scrollBottomCallback: getPageList,
    container: gcColumnRef.value?.elScrollbar.wrapRef,
    distance: 150,
  })
})

function handleChangeContactListItem(contactId: string, contact: Contact) {
  emit('change', contactId, contact)
}

const filterContactList = computed(() => {
  return contactList.value.filter((contact) => {
    return new RegExp(searchFormMdl.value.keywords).test(contact.remark)
  })
})

async function handleOparete(command: string, contact: Contact) {
  switch (command) {
    case 'delete':
      await deleteContact(contact)
      break
  }
}

async function deleteContact(contact: Contact) {
  const { id } = contact

  const params = {
    id,
  }
  const res = await $api.contact.deleteContact({ params })
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

defineExpose({
  formatServerFilePath,
  searchFormMdl,
  contactList,
  loadding,
  handleRefresh,
  contactListRef,
  gcColumnRef,
  handleChangeContactListItem,
  filterContactList,
  handleOparete,
})
</script>

<template>
  <div class="contact-list h-[100vh] w-[300px] border-r border-[#e0e4ea] dark:border-gray-700 dark:bg-gray-900">
    <GcColumn ref="gcColumnRef">
      <template #header>
        <div class="search">
          <el-input v-model="searchFormMdl.keywords" placeholder="搜索" clearable class="dark:bg-gray-800">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>

        <div class="oprate">
          <el-button circle size="small" title="添加好友" class="dark:bg-gray-800" @click="emit('add-contact')">
            <template #icon>
              <el-icon>
                <Plus />
              </el-icon>
            </template>
          </el-button>
        </div>
      </template>

      <template #scroll-header>
        <div class="list-title bg-white pl-[15px] text-[14px] leading-[45px] dark:bg-gray-900 dark:text-gray-400">
          通讯录
        </div>
      </template>
      <GcList
        ref="contactListRef"
        :list="filterContactList"
        :options="{
          key: 'reciver_id',
        }"
        @change="handleChangeContactListItem"
      >
        <template #default="{ item }">
          <div class="contact-item flex w-[100%]">
            <div class="user flex w-[100%] items-center">
              <div class="avater mr-[15px] h-[45px] w-[45px] shrink-0">
                <img class="rounded-full" :src="formatServerFilePath(item.avatar)" alt="" />
              </div>
              <div class="info flex-1">
                <div class="info-top flex items-center justify-between">
                  <p class="remark w-0 flex-1 truncate text-[15px] font-semibold dark:text-black">
                    {{ item.remark }}
                  </p>
                </div>
                <p class="text-[12px] dark:text-gray-400">在线</p>
              </div>
            </div>
          </div>
        </template>
      </GcList>
    </GcColumn>
  </div>
</template>

<style scoped>
:deep(.gc-column__header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 15px;
  border-bottom: 1px solid #e0e4ea;
}

:deep(.el-scrollbar .gc-list) {
  padding-bottom: 30px;
}
</style>
