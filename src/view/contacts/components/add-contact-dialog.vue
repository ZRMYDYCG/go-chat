<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加好友"
    width="500"
    :modal="false"
    :close-on-click-modal="true"
    @closed="handleClosed"
  >
    <GcColumn ref="gcColumnRef" v-loading="loading" class="!h-[400px]">
      <template #header>
        <el-form ref="searchFormRef" :model="searchFormMdl" class="search" @submit.prevent="handleSearchFriend">
          <el-form-item prop="account">
            <el-input v-model="searchFormMdl.account" placeholder="搜索" clearable>
              <template #prefix>
                <i class="ri-search-line"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </template>

      <GcList
        ref="contactListRef"
        :list="contactList"
        :options="{
          key: 'user_id',
        }"
      >
        <template #default="{ item }">
          <div class="contact-item flex w-[100%]">
            <div class="user flex w-[100%] items-center">
              <div class="avater">
                <img :src="item.avatar" alt="" />
              </div>
              <div class="info">
                <div class="info-top flex items-center justify-between">
                  <p class="nickname truncate">{{ item.nickname }}</p>
                </div>
              </div>
              <div class="oprate">
                <el-button size="small" @click="handleAdd(item)">加为好友</el-button>
              </div>
            </div>
          </div>
        </template>
      </GcList>
    </GcColumn>
  </el-dialog>
</template>

<script setup lang="ts">
import GcColumn from '@/components/Column/index.vue'
import GcList from '@/components/List/index.vue'
import { useCurrentInstance, useLoadMore, usePageList } from '@/hooks'
import { formatServerFilePath } from '@/utils/helper/common.ts'
import { ElButton, ElForm, ElInput, ElMessage } from 'element-plus'
import { debounce } from 'lodash-es'
import { nextTick, onMounted, ref } from 'vue'

interface Contact {
  user_id: string
  nickname: string
  avatar: string
}

interface SearchForm {
  account: string
}

const emit = defineEmits(['create-success'])

const { $api, $HTTP_CODE } = useCurrentInstance()

const dialogVisible = ref(true)
const searchFormRef = ref<InstanceType<typeof ElForm>>()
const searchFormMdl = ref<SearchForm>({
  account: '',
})

const {
  list: contactList,
  loadding,
  getPageList,
  initData,
} = usePageList<any>({
  getPageListApi: $api.contact.getContactList,
  searchParams: searchFormMdl,
})

const handleSearchFriend = async () => {
  loadding.value = true
  const params = {
    ...searchFormMdl.value,
  }
  const res = await $api.user
    .searchUserList({
      params,
    })
    .finally(() => {
      loadding.value = false
    })

  const { code, data, message } = res.data
  if (code === $HTTP_CODE.HTTP_SUCCESS_CODE) {
    contactList.value = data.rows.map((contact: Contact) => {
      contact.avatar = formatServerFilePath(contact.avatar)
      return contact
    })
  }
}

const gcColumnRef = ref(null)
onMounted(() => {
  nextTick(() => {
    useLoadMore({
      type: 'bottom',
      scrollBottomCallback: getPageList,
      container: gcColumnRef.value?.elScrollbar.wrapRef,
      distance: 150,
    })
  })
})

const createLoading = ref(false)
const handleAdd = debounce((contact: Contact) => {
  createContact(contact)
}, 50)

const createContact = async (contact: Contact) => {
  if (createLoading.value) {
    return false
  }

  createLoading.value = true
  const { id: reciver_id } = contact
  const params = {
    reciver_id,
  }

  const res = await $api.contact.createContact(params).finally(() => {
    createLoading.value = false
  })

  const { code, message } = res.data
  if (code === $HTTP_CODE.HTTP_SUCCESS_CODE) {
    ElMessage.success({
      message,
      duration: 3000,
    })

    close()
    emit('create-success')
  } else {
    ElMessage.error({
      message,
      duration: 3000,
    })
  }
}

const handleClosed = () => {
  searchFormRef.value?.resetFields()
  initData()
}

const open = () => {
  dialogVisible.value = true
}

const close = () => {
  dialogVisible.value = false
}

defineExpose({
  open,
  close,
})
</script>

<style scoped>
@import './add-contact-dialog.css';
</style>
