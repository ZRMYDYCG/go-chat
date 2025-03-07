<template>
  <div class="login flex justify-center p-[150px] pb-[30px]">
    <el-form
      ref="loginFormRef"
      :model="formMdl"
      :rules="rules"
      label-position="left"
      label-width="0px"
      class="login-container w-[330px] bg-transparent"
    >
      <div class="logo mx-auto mb-[10px] text-center">
        <img class="vertical-align mr-[6px] inline-block h-[60px]" src="/logo.svg" alt="logo" />
        <h3 class="text-[20px]">LightChat</h3>
      </div>

      <el-form-item prop="account">
        <el-input
          v-model.trim="formMdl.account"
          type="text"
          size="large"
          :prefix-icon="IconUser"
          auto-complete="off"
          placeholder="账号"
          @keyup.enter="handleLogin"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model.trim="formMdl.password"
          type="password"
          size="large"
          :prefix-icon="IconUnlock"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn mt-[30px] w-full"
          type="primary"
          size="large"
          :loading="loading"
          @click.prevent="handleLogin"
        >
          立即登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { Unlock as IconUnlock, User as IconUser } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 登录表单引用
const loginFormRef = ref<FormInstance | null>(null)
const loading = ref(false)
const formMdl = ref({
  account: '',
  password: '',
})

async function handleLogin() {
  if (loading.value) return

  const validateStatus = await new Promise<boolean>((resolve) => {
    if (!loginFormRef.value) return resolve(false)
    loginFormRef.value.validate((valid) => {
      resolve(valid)
    })
  })

  if (!validateStatus) return

  loading.value = true
  userStore
    .accountLogin(formMdl.value)
    .then(() => {
      ElMessage.success({
        message: '登录成功',
        duration: 3000,
      })

      // 跳转默认页
      router.push({ path: '/chat/main' })
    })
    .catch((message: string) => {
      ElMessage.error({
        message,
        duration: 3000,
      })
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 150)
    })
}
</script>

<style scoped></style>
