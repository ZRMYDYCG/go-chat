<template>
  <div class="regist">
    <el-form
      ref="registerFormRef"
      :model="formMdl"
      :rules="rules"
      label-position="left"
      label-width="0px"
      class="regist-container"
    >
      <div class="logo">
        <img src="@/assets/logo.png" alt="logo" />
        <h3>GoChat</h3>
      </div>

      <el-form-item prop="account">
        <el-input
          v-model.trim="formMdl.account"
          type="text"
          size="large"
          :prefix-icon="IconUser"
          auto-complete="off"
          placeholder="账号"
          @keyup.enter="handleRegister"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model.trim="formMdl.password"
          type="password"
          size="large"
          :prefix-icon="IconUnlock"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleRegister"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="large"
          plain
          class="regist-btn"
          :loading="loading"
          @click.prevent="handleRegister"
        >
          立即注册
        </el-button>
        <div class="go-login flex-1">
          <router-link to="/login" class="float-right"> 已有账号，去登录 </router-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user.ts'
import { Unlock as IconUnlock, User as IconUser } from '@element-plus/icons-vue'
import { ElMessage, type ElForm } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const router = useRouter()
const userStore = useUserStore()

const registerFormRef = ref<InstanceType<typeof ElForm>>()
const loading = ref(false)
const formMdl = reactive<any>({
  account: '',
  password: '',
})

const handleRegister = async () => {
  if (loading.value) return

  const valid = await registerFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.accountRegister(formMdl)
    ElMessage.success({ message: '注册成功', duration: 3000 })
    await router.push('/login')
  } catch (error: any) {
    ElMessage.error({ message: error?.message || '注册失败', duration: 3000 })
  } finally {
    setTimeout(() => (loading.value = false), 150)
  }
}
</script>

<style scoped>
.regist {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding: 150px 150px 30px;
}

.regist-container {
  width: 330px;
  background-color: transparent;
}

.regist-container .logo {
  text-align: center;
  margin: 0 auto 40px auto;
}

.regist-container .logo img {
  display: inline-block;
  height: 60px;
  margin-right: 6px;
  vertical-align: middle;
}

.regist-container .logo h3 {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
}

.regist-btn {
  width: 100%;
  margin-top: 30px;
}

.go-login {
  font-size: 12px;
}

.float-right {
  float: right;
}

.flex-1 {
  flex: 1;
}
</style>
