<template>
  <div class="login-bg">
    <div class="decor decor1"></div>
    <div class="decor decor2"></div>
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <div class="login-icon">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="28" fill="url(#paint0_linear)"/>
              <path d="M28 30c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7zm0 3c-5.33 0-16 2.668-16 8v3h32v-3c0-5.332-10.67-8-16-8z" fill="#fff"/>
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#667eea"/>
                  <stop offset="1" stop-color="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <transition name="flip-form" mode="out-in">
          <LoginForm
            v-if="!isRegister"
            v-model:emailFocused="emailFocused"
            v-model:codeFocused="codeFocused"
            :form="form"
            :emailError="emailError"
            :sending="sending"
            :countdown="countdown"
            :isEmailValid="isEmailValid"
            @validate-email="validateEmail"
            @send-code="sendCode"
            @login="handleLogin"
            @switch="isRegister = true"
          />
          <RegisterForm
            v-else
            v-model:emailFocused="emailFocused"
            v-model:codeFocused="codeFocused"
            v-model:pwdFocused="pwdFocused"
            v-model:repwdFocused="repwdFocused"
            v-model:showPwd="showPwd"
            v-model:showRepwd="showRepwd"
            :form="form"
            :emailError="emailError"
            :pwdError="pwdError"
            :repwdError="repwdError"
            :sending="sending"
            :countdown="countdown"
            :isEmailValid="isEmailValid"
            :canRegister="canRegister"
            @validate-email="validateEmail"
            @validate-pwd="validatePwd"
            @validate-repwd="validateRepwd"
            @send-code="sendCode"
            @register="handleRegister"
            @switch="isRegister = false"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import '@/styles/Login.scss'

const router = useRouter()
const isRegister = ref(false)

const form = reactive({
  email: 'test@example.com',
  code: '123456',
  password: '',
  repwd: '',
  remember: false
})

const emailFocused = ref(false)
const codeFocused = ref(false)
const pwdFocused = ref(false)
const repwdFocused = ref(false)
const showPwd = ref(false)
const showRepwd = ref(false)
const emailError = ref('')
const pwdError = ref('')
const repwdError = ref('')
const sending = ref(false)
const countdown = ref(60)
let timer: any = null

const isEmailValid = computed(() => {
  return /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(form.email)
})

function validateEmail() {
  if (!form.email) {
    emailError.value = ''
    return
  }
  if (!isEmailValid.value) {
    emailError.value = '请输入正确的邮箱格式'
  } else {
    emailError.value = ''
  }
}

function validatePwd() {
  if (!form.password) {
    pwdError.value = ''
    return
  }
  if (form.password.length < 6) {
    pwdError.value = '密码至少6位'
  } else {
    pwdError.value = ''
  }
}

function validateRepwd() {
  if (!form.repwd) {
    repwdError.value = ''
    return
  }
  if (form.repwd !== form.password) {
    repwdError.value = '两次输入的密码不一致'
  } else {
    repwdError.value = ''
  }
}

const canRegister = computed(() => {
  return !!(
    isEmailValid.value &&
    form.code &&
    form.password.length >= 6 &&
    form.password === form.repwd &&
    !emailError.value &&
    !pwdError.value &&
    !repwdError.value
  )
})

const sendCode = () => {
  if (sending.value) return
  sending.value = true
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      sending.value = false
    }
  }, 1000)
}

const handleLogin = () => {
  // 登录逻辑
  console.log('登录', form)
  router.push('/home')
}

const handleRegister = () => {
  // 注册逻辑
  console.log('注册', form)
}
</script> 