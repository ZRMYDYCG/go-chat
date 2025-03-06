<script setup lang="ts">
import GcColumn from '@/components/Column/index.vue'
import GcList from '@/components/List/index.vue'
import { useCurrentInstance, useLoadMore, usePageList } from '@/hooks'
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

const handleChangeContactListItem = (contactId: string, contact: Contact) => {
  emit('change', contactId, contact)
}

const filterContactList = computed(() => {
  return contactList.value.filter((contact) => {
    return new RegExp(searchFormMdl.value.keywords).test(contact.remark)
  })
})

const handleOparete = (command: string, contact: Contact) => {
  switch (command) {
    case 'delete':
      deleteContact(contact)
      break
  }
}

const deleteContact = async (contact: Contact) => {
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

    handleRefresh()
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
  <div class="contact-list">
    <GcColumn ref="gcColumnRef">
      <template #header>
        <div class="search">
          <el-input v-model="searchFormMdl.keywords" placeholder="搜索" clearable>
            <template #prefix>
              <i class="ri-search-line"></i>
            </template>
          </el-input>
        </div>

        <div class="oprate">
          <el-button circle size="small" title="添加好友" @click="emit('add-contact')">
            <template #icon>
              <i class="ri-zoom-in-line"></i>
            </template>
          </el-button>
        </div>
      </template>

      <template #scroll-header>
        <div class="list-title">通讯录</div>
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
              <div class="avater">
                <img :src="formatServerFilePath(item.avatar)" alt="" />
              </div>
              <div class="info">
                <div class="info-top flex items-center justify-between">
                  <p class="remark truncate">{{ item.remark }}</p>
                </div>
              </div>
            </div>
            <div class="oprate" @click.stop>
              <el-dropdown :teleported="false" placement="top" @command="handleOparete($event, item)">
                <el-button link> 删除 </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
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

<style scoped>
@import './contact-list.css';
</style>
