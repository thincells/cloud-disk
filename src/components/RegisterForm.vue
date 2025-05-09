<template>
  <div>
    <h2 class="form-title">注册账号</h2>
    <p class="form-desc">请填写信息完成注册</p>
    <form class="login-form" @submit.prevent="$emit('register')">
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
      <div class="form-group">
        <div class="input-group modern" :class="{focused: pwdFocused, error: pwdError}">
          <span class="input-icon">
            <svg :class="{active: pwdFocused || form.password}" width="22" height="22" viewBox="0 0 20 20" fill="none"><rect x="4" y="8" width="12" height="8" rx="2" stroke="#bbb" stroke-width="1.5"/><path d="M10 12v2" stroke="#bbb" stroke-width="1.5" stroke-linecap="round"/><path d="M7 8V6a3 3 0 1 1 6 0v2" stroke="#bbb" stroke-width="1.5"/></svg>
          </span>
          <input
            :type="showPwd ? 'text' : 'password'"
            v-model="form.password"
            placeholder="请输入密码"
            required
            @focus="$emit('update:pwdFocused', true)"
            @blur="$emit('update:pwdFocused', false); $emit('validate-pwd')"
            :class="{error: pwdError}"
          />
          <span class="pwd-toggle" @click="$emit('update:showPwd', !showPwd)">
            <svg v-if="showPwd" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" stroke="#764ba2" stroke-width="1.5"/><circle cx="10" cy="10" r="3" stroke="#764ba2" stroke-width="1.5"/></svg>
            <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" stroke="#bbb" stroke-width="1.5"/><path d="M7.5 12.5 12.5 7.5" stroke="#bbb" stroke-width="1.5"/></svg>
          </span>
        </div>
        <div v-if="pwdError" class="input-error">{{ pwdError }}</div>
      </div>
      <div class="form-group">
        <div class="input-group modern" :class="{focused: repwdFocused, error: repwdError}">
          <span class="input-icon">
            <svg :class="{active: repwdFocused || form.repwd}" width="22" height="22" viewBox="0 0 20 20" fill="none"><rect x="4" y="8" width="12" height="8" rx="2" stroke="#bbb" stroke-width="1.5"/><path d="M10 12v2" stroke="#bbb" stroke-width="1.5" stroke-linecap="round"/><path d="M7 8V6a3 3 0 1 1 6 0v2" stroke="#bbb" stroke-width="1.5"/></svg>
          </span>
          <input
            :type="showRepwd ? 'text' : 'password'"
            v-model="form.repwd"
            placeholder="请再次输入密码"
            required
            @focus="$emit('update:repwdFocused', true)"
            @blur="$emit('update:repwdFocused', false); $emit('validate-repwd')"
            :class="{error: repwdError}"
          />
          <span class="pwd-toggle" @click="$emit('update:showRepwd', !showRepwd)">
            <svg v-if="showRepwd" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" stroke="#764ba2" stroke-width="1.5"/><circle cx="10" cy="10" r="3" stroke="#764ba2" stroke-width="1.5"/></svg>
            <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" stroke="#bbb" stroke-width="1.5"/><path d="M7.5 12.5 12.5 7.5" stroke="#bbb" stroke-width="1.5"/></svg>
          </span>
        </div>
        <div v-if="repwdError" class="input-error">{{ repwdError }}</div>
      </div>
      <button type="submit" class="login-button" :disabled="!canRegister">注册</button>
    </form>
    <div class="login-footer">
      <p>已有账号？<a href="#" @click.prevent="$emit('switch')">返回登录</a></p>
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
  pwdFocused: {
    type: Boolean,
    default: false
  },
  repwdFocused: {
    type: Boolean,
    default: false
  },
  showPwd: {
    type: Boolean,
    default: false
  },
  showRepwd: {
    type: Boolean,
    default: false
  },
  emailError: {
    type: String,
    default: ''
  },
  pwdError: {
    type: String,
    default: ''
  },
  repwdError: {
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
  },
  canRegister: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:emailFocused',
  'update:codeFocused',
  'update:pwdFocused',
  'update:repwdFocused',
  'update:showPwd',
  'update:showRepwd',
  'validate-email',
  'validate-pwd',
  'validate-repwd',
  'send-code',
  'register',
  'switch'
])
</script> 