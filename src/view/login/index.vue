<template>
  <div class="login">
    <el-form
      ref="loginFormRef"
      :model="formMdl"
      :rules="rules"
      label-position="left"
      label-width="0px"
      class="login-container"
    >
      <div class="logo">
        <img src="/logo.svg" alt="logo" />
        <h3>LightChat</h3>
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
        <el-button class="login-btn" type="primary" size="large" :loading="loading" @click.prevent="handleLogin">
          立即登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>

  <div :class="{ 'dark-mode': myColorMode === 'dark', 'light-mode': myColorMode === 'light' }">
    <!-- 页面内容 -->
    <button @click="changeTheme('dark')">切换到深色模式</button>
    <button @click="changeTheme('light')">切换到浅色模式</button>
    <button @click="changeTheme('auto')">跟随系统</button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { Unlock as IconUnlock, User as IconUser } from '@element-plus/icons-vue'
import { useColorMode } from '@vueuse/core'
import { ElMessage, type FormInstance } from 'element-plus'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const { system, store } = useColorMode()

const myColorMode = computed(() => (store.value === 'auto' ? system.value : store.value))

// 切换颜色模式的函数
const changeTheme = (val) => {
  // console.log(val)
  store.value = val
}

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

const handleLogin = async () => {
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

<style>
.login {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding: 150px 150px 30px;
}

.login-container {
  width: 330px;
  background-color: transparent;
}

.login-container .logo {
  text-align: center;
  margin: 0 auto 40px auto;
}

.login-container .logo img {
  display: inline-block;
  height: 60px;
  margin-right: 6px;
  vertical-align: middle;
}

.login-container .logo h3 {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
}

.login-container .login-btn {
  width: 100%;
  margin-top: 30px;
}
</style>
