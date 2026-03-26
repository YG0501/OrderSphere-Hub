<template>
  <div class="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded shadow">
    <h2 class="text-2xl font-bold mb-4 text-center">注册</h2>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <input
          v-model="form.username"
          type="text"
          class="input"
          placeholder="用户名"
          required
        />
        <input
          v-model="form.password"
          type="password"
          class="input"
          placeholder="密码"
          required
          aria-describedby="password-strength"
        />
        <input
          v-model="form.confirm_password"
          type="password"
          class="input"
          placeholder="请再次输入密码"
          required
        />
        <!-- 密码复杂度进度条 -->
        <div class="mt-2">
          <div class="w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div
              :style="{ width: passwordStrength.width }"
              :class="passwordStrength.colorClass"
              class="h-2 transition-all"
              role="progressbar"
              :aria-valuenow="passwordStrength.score"
              aria-valuemin="0"
              aria-valuemax="3"
            ></div>
          </div>
          <p id="password-strength" class="text-xs mt-1" :class="passwordStrength.textClass">
            {{ passwordStrength.text }}
          </p>
          <p v-if="isPasswordTooShort" class="text-xs mt-1 text-red-600">密码至少为6位</p>
        </div>
      </div>

      <div>
        <p v-if="passwordMismatch" class="text-red-500 text-xs mt-1">
          两次输入的密码不一致
        </p>
      </div>

      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="btn-primary"
        >
          注册
        </button>
      </div>

      <p class="text-center text-sm mt-3">
        已有账号？
        <router-link to="/login" class="text-blue-600 hover:underline">去登录</router-link>
      </p>

      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
      <p v-if="success" class="text-green-600 text-sm mt-2">{{ success }}</p>
    </form>
  </div>
</template>

<script setup>
import {reactive, computed, ref} from 'vue'

const form = reactive({
  username: '',
  password: '',
  confirm_password: ''
})

// 密码强度计算（你之前要求的均匀分布版本）
function calcPasswordScore(pw) {
  if (!pw) return 0

  let raw = 0

  if (pw.length >= 6) raw++
  if (/[A-Za-z]/.test(pw) && /[0-9]/.test(pw)) raw++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) raw++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) raw++

  if (raw <= 1) return 0
  if (raw === 2) return 1
  if (raw === 3) return 2
  return 3
}

const passwordStrength = computed(() => {
  const pw = form.password

  // 密码为空则返回“空状态”
  if (!pw) {
    return {
      width: '0%',
      colorClass: '',
      text: '',
      textClass: '',
      score: 0
    }
  }

  const score = calcPasswordScore(pw)

  const map = [
    { width: '33%', colorClass: 'bg-red-500', text: '弱', textClass: 'text-red-600' },
    { width: '66%', colorClass: 'bg-yellow-500', text: '中', textClass: 'text-yellow-600' },
    { width: '100%', colorClass: 'bg-green-500', text: '强', textClass: 'text-green-600' },
    { width: '100%', colorClass: 'bg-green-700', text: '非常强', textClass: 'text-green-700' }
  ]

  return { ...map[score], score }
})

const error = ref('')
const success = ref('')

const isPasswordTooShort = computed(() => form.password.length > 0 && form.password.length < 6)
const passwordMismatch = computed(() => form.confirm_password && form.password !== form.confirm_password)

async function onSubmit() {
  error.value = ''
  success.value = ''

  if (passwordMismatch.value) {
    error.value = '两次输入的密码不一致'
    return
  }

  try {
    const res = await fetch('http://127.0.0.1:8000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (!res.ok) {
      const data = await res.json()
      error.value = data.detail || '注册失败'
      return
    }

    success.value = '注册成功，请前往登录'
  } catch (e) {
    error.value = '网络错误'
  }
}
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded mb-3;
}
.btn-primary {
  @apply w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition;
}
</style>
