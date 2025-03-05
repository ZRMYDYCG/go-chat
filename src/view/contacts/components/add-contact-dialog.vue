<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加好友"
    width="500"
    :modal="false"
    :close-on-click-modal="true"
    @closed="handleClosed"
  >
    <GCColumn ref="gcColumnRef" v-loading="loading" class="!h-[400px]">
      <template #header>
        <el-form ref="searchFormRef" :model="searchFormMdl" class="search" @submit.prevent="handleSearchFriend">
          <el-form-item prop="keywords">
            <el-input v-model="searchFormMdl.keywords" placeholder="搜索" clearable>
              <template #prefix>
                <i class="ri-search-line"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </template>

      <!-- S 搜素结果 -->
      <GCList
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
      </GCList>
      <!-- E 搜素结果 -->
    </GCColumn>
  </el-dialog>
</template>

<script setup lang="ts">
import GCColumn from '@/components/Column/index.vue'
import GCList from '@/components/List/index.vue'
import { useCurrentInstance, useLoadMore, usePageList } from '@/hooks'
import type { ElForm } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'

interface ContactItem {
  user_id: string | number
  avatar: string
  nickname: string
}

const { proxy } = useCurrentInstance()
const $api = proxy.$api

const dialogVisible = ref(false)
const loading = ref(false)

const searchFormRef = ref<InstanceType<typeof ElForm>>()
const searchFormMdl = reactive({
  keywords: '',
})

const {
  list: contactList,
  loading: listLoading,
  getPageList,
  initData,
  handleRefresh,
} = usePageList<ContactItem>({
  getPageListApi: $api.contact.getContactList,
  searchParams: searchFormMdl,
})

const gcColumnRef = ref<InstanceType<typeof GCColumn>>()

// 加载更多逻辑
onMounted(() => {
  nextTick(() => {
    const scrollContainer = gcColumnRef.value?.$el?.querySelector('.el-scrollbar__wrap')
    if (scrollContainer) {
      useLoadMore({
        type: 'bottom',
        scrollBottomCallback: getPageList,
        container: scrollContainer,
        distance: 150,
      })
    }
  })
})

const handleSearchFriend = () => {
  handleRefresh()
}

const handleAdd = (contact: ContactItem) => {
  // console.log('添加为好友', contact)
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
