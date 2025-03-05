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
import { computed, ref } from 'vue'

const { $api } = useCurrentInstance()

const dialogVisible = ref(true)
const formRef = ref<InstanceType<any> | null>(null)
const formMdl = ref({
  remark: '',
  desc: '',
})

const isNoneValues = computed(() => {
  return Object.values(formMdl.value).every((value) => {
    return [null, ''].includes(value)
  })
})

const handleSetInfo = () => {
  // console.log('handleSetInfo')
}

const handleClosed = () => {
  formRef.value?.resetFields()
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
