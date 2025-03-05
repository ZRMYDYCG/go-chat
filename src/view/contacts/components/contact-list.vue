<script setup lang="ts">
import GcColumn from '@/components/Column/index.vue'
import GcList from '@/components/List/index.vue'
import { useCurrentInstance, useLoadMore, usePageList } from '@/hooks'
import { onMounted, ref } from 'vue'

interface ContactItem {
  user_id: string | number
  nickname: string
  avatar: string
}

interface SearchForm {
  keywords: string
}

const emit = defineEmits<{
  (e: 'change', contactId: string | number, contact: ContactItem): void
  (e: 'add-contact'): void
  (e: 'show-new-contact'): void
}>()

const { $api } = useCurrentInstance()

// 表单类型
const searchFormMdl = ref<SearchForm>({
  keywords: '',
})

// 组件引用类型
const contactListRef = ref<InstanceType<typeof GcList> | null>(null)
const gcColumnRef = ref<InstanceType<typeof GcColumn> | null>(null)

// 联系人列表逻辑
const {
  list: contactList,
  loadding,
  getPageList,
} = usePageList<ContactItem>({
  getPageListApi: $api.contact.getContactList,
  searchParams: searchFormMdl,
})

// 加载更多逻辑
onMounted(async () => {
  await getPageList()
  if (contactList.value.length) {
    contactListRef.value?.handleChangeItem(contactList.value[0])
  }

  const container = gcColumnRef.value?.elScrollbar.wrapRef
  if (container) {
    useLoadMore({
      type: 'bottom',
      scrollBottomCallback: getPageList,
      container,
      distance: 150,
    })
  }
})

// 联系人切换处理
const handleChangeContactListItem = (contactId: string | number, contact: ContactItem) => {
  // console.log('联系人item切换', contactId, contact)
  emit('change', contactId, contact)
}
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
          <el-button circle size="small" title="添加好友" @click="$emit('add-contact')">
            <template #icon>
              <i class="ri-zoom-in-line"></i>
            </template>
          </el-button>

          <!-- <el-button circle size="small" title="新的朋友" @click="$emit('show-new-contact')">
            <template #icon>
              <i class="ri-user-received-line"></i>
            </template>
          </el-button> -->
        </div>
      </template>

      <template #scroll-header>
        <div class="list-title">通讯录</div>
      </template>
      <GcList
        ref="contactListRef"
        :list="contactList"
        :options="{
          key: 'user_id',
        }"
        @change="handleChangeContactListItem"
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
            </div>
          </div>
        </template>
      </GcList>
    </GcColumn>
  </div>
</template>

<style scoped>
.contact-list {
  width: 300px;
  height: 100vh;
  border-right: 1px solid #e0e4ea;
}

.contact-list .gc-column ::v-deep .gc-column__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 15px;
  border-bottom: 1px solid #e0e4ea;
}

.contact-list .gc-column .gc-column__header .oprate .el-button + .el-button {
  margin-left: 5px;
}

.contact-list .gc-column .list-title {
  font-size: 14px;
  color: #96a1b1;
  line-height: 45px;
  padding-left: 15px;
  margin-bottom: 5px;
}

.contact-list .gc-column ::v-deep .el-scrollbar .gc-list {
  padding-bottom: 30px;
}

.contact-list .gc-column ::v-deep .el-scrollbar .gc-list .gc-list__item .contact-item .user .avater {
  flex-shrink: 0;
  width: 45px;
  height: 45px;
  margin-right: 15px;
}

.contact-list .gc-column ::v-deep .el-scrollbar .gc-list .gc-list__item .contact-item .user .avater img {
  border-radius: 50%;
}

.contact-list .gc-column ::v-deep .el-scrollbar .gc-list .gc-list__item .contact-item .user .info {
  flex: 1;
}

.contact-list .gc-column ::v-deep .el-scrollbar .gc-list .gc-list__item .contact-item .user .info-top .nickname {
  flex: 1;
  width: 0;
  font-size: 15px;
  font-weight: 600;
}
</style>
