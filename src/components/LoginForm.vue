<template>
  <div>
    <h2 class="form-title">欢迎登录</h2>
    <p class="form-desc">请使用您的账号登录系统</p>
    <form class="login-form" @submit.prevent="$emit('login')">
      <div class="form-group">
        <div class="input-group modern" :class="{focused: emailFocused, error: emailError}">
          <span class="input-icon">
            <svg :class="{active: emailFocused || form.email}" width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h11A2.5 2.5 0 0 1 18 4.5v11A2.5 2.5 0 0 1 15.5 18h-11A2.5 2.5 0 0 1 2 15.5v-11Zm1.75.75 6.25 5.25 6.25-5.25" stroke-width="1.5" stroke="#bbb" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="请输入邮箱"
            required
            @focus="$emit('update:emailFocused', true)"
            @blur="$emit('update:emailFocused', false); $emit('validate-email')"
            :class="{error: emailError}"
          />
        </div>
        <div v-if="emailError" class="input-error">{{ emailError }}</div>
      </div>
      <div class="form-group">
        <div class="input-group modern" :class="{focused: codeFocused}">
          <span class="input-icon">
            <svg :class="{active: codeFocused || form.code}" width="22" height="22" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#bbb" stroke-width="1.5"/><path d="M10 6v4l2 2" stroke="#bbb" stroke-width="1.5" stroke-linecap="round"/></svg>
          </span>
          <input
            id="code"
            v-model="form.code"
            type="text"
            maxlength="6"
            placeholder="请输入验证码"
            required
            @focus="$emit('update:codeFocused', true)"
            @blur="$emit('update:codeFocused', false)"
          />
          <button type="button" class="send-code-modern" :disabled="sending || !form.email || !isEmailValid" @click="$emit('send-code')">
            <span v-if="!sending">发送验证码</span>
            <span v-else>{{countdown}}s</span>
          </button>
        </div>
      </div>
      <div class="form-options">
        <label class="remember-me">
          <input type="checkbox" v-model="form.remember" />
          <span>记住我</span>
        </label>
        <a href="#" class="forgot-password">忘记密码？</a>
      </div>
      <button type="submit" class="login-button" :disabled="!form.code">登录</button>
    </form>
    <div class="login-footer">
      <p>还没有账号？<a href="#" @click.prevent="$emit('switch')">立即注册</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  emailFocused: {
    type: Boolean,
    default: false
  },
  codeFocused: {
    type: Boolean,
    default: false
  },
  emailError: {
    type: String,
    default: ''
  },
  sending: {
    type: Boolean,
    default: false
  },
  countdown: {
    type: Number,
    default: 60
  },
  isEmailValid: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:emailFocused',
  'update:codeFocused',
  'validate-email',
  'send-code',
  'login',
  'switch'
])
</script> 