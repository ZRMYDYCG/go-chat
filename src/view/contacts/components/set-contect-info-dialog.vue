<template>
  <el-dialog
    v-model="dialogVisible"
    title="资料设置"
    width="500"
    :modal="false"
    :close-on-click-modal="true"
    @closed="handleClosed"
  >
    <el-form ref="formRef" :model="formMdl" label-position="top" class="search" @submit.prevent="handleSetInfo">
      <el-form-item prop="remark" label="备注">
        <el-input v-model="formMdl.remark" placeholder="添加备注名" clearable />
      </el-form-item>

      <el-form-item prop="desc" label="描述">
        <el-input v-model="formMdl.desc" type="textarea" :rows="3" resize="none" placeholder="添加描述信息" clearable />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="text-center">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :disabled="isNoneValues" @click="handleSetInfo"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useCurrentInstance } from '@/hooks'
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'

interface ActiveContact {
  remark?: string
  desc?: string
  [key: string]: any
}

const props = defineProps<{
  activeContact: ActiveContact
}>()

const emit = defineEmits<{
  (e: 'set-success'): void
}>()

const { $api, $HTTP_CODE } = useCurrentInstance()

const dialogVisible = ref(true)

const formRef = ref<any>(null)
const formMdl = ref<ActiveContact>({
  ...props.activeContact,
})

watch(
  () => props.activeContact,
  (newContact) => {
    formMdl.value = {
      ...newContact,
    }
  },
)

const isNoneValues = computed(() => {
  return Object.values(formMdl.value).every((value) => {
    return [null, ''].includes(value)
  })
})

const loadding = ref(false)

function handleSetInfo() {
  setContactInfo()
}

async function setContactInfo() {
  loadding.value = true
  const params = {
    ...formMdl.value,
  }
  try {
    const res = await $api.contact.setContactInfo(params)
    const { code, message } = res.data
    if (code === $HTTP_CODE.HTTP_SUCCESS_CODE) {
      ElMessage.success({
        message,
        duration: 3000,
      })

      // 关闭弹窗
      close()

      // 刷新联系人列表
      emit('set-success')
    } else {
      ElMessage.error({
        message,
        duration: 3000,
      })
    }
  } catch (error) {
    ElMessage.error({
      message: '网络错误，请稍后重试',
      duration: 3000,
    })
  } finally {
    loadding.value = false
  }
}

// 弹窗关闭
function handleClosed() {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 打开弹窗
function open() {
  dialogVisible.value = true
}

// 关闭弹窗
function close() {
  dialogVisible.value = false
}

defineExpose({
  open,
  close,
})
</script>
