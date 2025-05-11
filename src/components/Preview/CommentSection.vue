<template>
  <div style="border-bottom: 1px dashed #000;margin-top: 32px;"></div>
  <div class="comment-section" @click.self="showAvatarMenu=false">
    <div class="comment-header">评论</div>
    <div class="comment-input-bar">
      <div class="comment-input-bar-inner">
        <div class="avatar-trigger" @click.stop="toggleAvatarMenu">
          <img class="avatar" :src="selectedAvatar" />
          <div v-if="showAvatarMenu" :class="['avatar-dropdown', avatarDropdownPos]">
            <img v-for="(avt, idx) in avatarList" :key="idx" :src="avt" :class="['avatar-option', {active: selectedAvatar===avt}]" @click.stop="selectAvatar(idx); showAvatarMenu=false" />
          </div>
        </div>
        <div class="input-main input-main-fake" @click="openInput(nickname ? 'comment' : 'nickname')">
          <span v-if="!nickname">请输入昵称,开始评论吧!</span>
          <span v-else>发一条友善的评论~，你的妙评何时再现</span>
        </div>
      </div>
    </div>
    <div class="comment-list">
      <template v-for="(comment, idx) in comments" :key="comment.id">
        <div class="comment-item">
          <div class="comment-main">
            <img class="avatar" :src="comment.avatar || avatarList[0]" />
            <div class="comment-content-box">
              <div class="comment-user">{{ comment.nickname }}</div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-actions">
                <span @click="like(comment)">👍 {{ comment.likes }}</span>
                <span @click="openInput('reply', comment)">回复</span>
              </div>
            </div>
          </div>
          <div class="reply-list">
            <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
              <img class="avatar" :src="reply.avatar || avatarList[0]" />
              <div class="reply-content-box">
                <div class="reply-user">{{ reply.nickname }}</div>
                <div class="reply-content">{{ reply.content }}</div>
                <div class="reply-actions">
                  <span @click="like(reply)">👍 {{ reply.likes }}</span>
                  <span @click="openInput('reply', reply, comment)">回复</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="idx < comments.length - 1" class="comment-divider"></div>
      </template>
    </div>
    <div v-if="showInput" class="input-modal" @click.self="closeInput">
      <div class="input-popup">
        <template v-if="inputType==='nickname'">
          <input
            v-model="nicknameInput"
            placeholder="请输入昵称"
            maxlength="12"
            class="popup-input"
            ref="popupInputRef"
          />
          <button class="popup-publish" :disabled="!nicknameInput.trim()" @click="onSetNickname">确定</button>
        </template>
        <template v-else>
          <input
            v-model="inputValue"
            :placeholder="inputType==='comment' ? '发一条友善的评论~' : '回复@' + replyTargetName + ':'"
            maxlength="200"
            class="popup-input"
            ref="popupInputRef"
          />
          <button class="popup-publish" :disabled="!inputValue.trim()" @click="submitInput">发布</button>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, nextTick } from 'vue'
import styles from '../../styles/CommentSection.module.css'
const props = defineProps({ fileId: [String, Number] })
// 4个内置SVG卡通头像
const avatarList = [
  'data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="%23a3d8f4"/><ellipse cx="20" cy="28" rx="10" ry="6" fill="%23fff"/><circle cx="14" cy="18" r="3" fill="%23fff"/><circle cx="26" cy="18" r="3" fill="%23fff"/><ellipse cx="20" cy="24" rx="4" ry="2" fill="%23f9c846"/></svg>',
  'data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="20" fill="%23f9c846"/><ellipse cx="20" cy="28" rx="10" ry="6" fill="%23fff"/><circle cx="14" cy="18" r="3" fill="%23fff"/><circle cx="26" cy="18" r="3" fill="%23fff"/><ellipse cx="20" cy="24" rx="4" ry="2" fill="%23a3d8f4"/></svg>',
  'data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="%23ffb8c6"/><ellipse cx="20" cy="28" rx="10" ry="6" fill="%23fff"/><circle cx="14" cy="18" r="3" fill="%23fff"/><circle cx="26" cy="18" r="3" fill="%23fff"/><ellipse cx="20" cy="24" rx="4" ry="2" fill="%23f9c846"/></svg>',
  'data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="20" fill="%23b5ead7"/><ellipse cx="20" cy="28" rx="10" ry="6" fill="%23fff"/><circle cx="14" cy="18" r="3" fill="%23fff"/><circle cx="26" cy="18" r="3" fill="%23fff"/><ellipse cx="20" cy="24" rx="4" ry="2" fill="%23a3d8f4"/></svg>'
]
const selectedAvatar = ref(avatarList[0])
const nickname = ref('')
const nicknameInput = ref('')
const newComment = ref('')
const comments = ref([
  { id: 1, nickname: '用户1', avatar: avatarList[0], content: '好棒的资源！', likes: 2, replies: [
    { id: 11, nickname: '用户701', avatar: avatarList[1], content: '我也觉得很好看', likes: 0, replies: [] }
  ] },
  { id: 2, nickname: '用户987', avatar: avatarList[2], content: '可以很好看', likes: 0, replies: [] }
])
const showAvatarMenu = ref(false)
const avatarDropdownPos = ref('dropdown-bottom')
function toggleAvatarMenu(e) {
  showAvatarMenu.value = !showAvatarMenu.value
  if (showAvatarMenu.value) {
    nextTick(() => {
      // 判断弹窗是否溢出屏幕下方
      const trigger = document.querySelector('.avatar-trigger')
      const dropdown = document.querySelector('.avatar-dropdown')
      if (trigger && dropdown) {
        const rect = trigger.getBoundingClientRect()
        const dropRect = dropdown.getBoundingClientRect()
        if (rect.bottom + dropRect.height > window.innerHeight - 8) {
          avatarDropdownPos.value = 'dropdown-top'
        } else {
          avatarDropdownPos.value = 'dropdown-bottom'
        }
      }
    })
  }
}
function setNickname() {
  if (nicknameInput.value.trim()) {
    nickname.value = nicknameInput.value.trim()
  }
}
function selectAvatar(idx) {
  selectedAvatar.value = avatarList[idx]
}
function addComment() {
  if (!nickname.value) return
  if (!newComment.value.trim()) return
  comments.value.unshift({
    id: Date.now(),
    nickname: nickname.value,
    avatar: selectedAvatar.value,
    content: newComment.value,
    likes: 0,
    replies: []
  })
  newComment.value = ''
}
function like(item) {
  item.likes = (item.likes || 0) + 1
}
// 弹窗输入相关
const showInput = ref(false)
const inputType = ref('comment') // comment | reply | nickname
const inputValue = ref('')
const replyTarget = ref(null)
const replyParent = ref(null)
const replyTargetName = ref('')
const popupInputRef = ref(null)
function openInput(type, target, parent) {
  inputType.value = type
  showInput.value = true
  if (type === 'nickname') {
    inputValue.value = ''
    nextTick(() => {
      popupInputRef.value && popupInputRef.value.focus()
    })
    return
  }
  inputValue.value = ''
  replyTarget.value = target || null
  replyParent.value = parent || null
  replyTargetName.value = target ? target.nickname : ''
  nextTick(() => {
    popupInputRef.value && popupInputRef.value.focus()
  })
}
function closeInput() {
  showInput.value = false
}
function submitInput() {
  if (!nickname.value) return
  if (!inputValue.value.trim()) return
  if (inputType.value === 'comment') {
    comments.value.unshift({
      id: Date.now(),
      nickname: nickname.value,
      avatar: selectedAvatar.value,
      content: inputValue.value,
      likes: 0,
      replies: []
    })
  } else if (inputType.value === 'reply') {
    const replyContent = replyTarget.value ? `@${replyTarget.value.nickname} ${inputValue.value}` : inputValue.value
    const replyObj = {
      id: Date.now(),
      nickname: nickname.value,
      avatar: selectedAvatar.value,
      content: replyContent,
      likes: 0,
      replies: []
    }
    if (replyParent.value) {
      replyParent.value.replies.unshift(replyObj)
    } else if (replyTarget.value) {
      // 一级评论下的回复
      const parent = comments.value.find(c => c.id === replyTarget.value.id)
      if (parent) parent.replies.unshift(replyObj)
    }
  }
  showInput.value = false
}
function onSetNickname() {
  setNickname()
  if (nickname.value) closeInput()
}
</script>
<style scoped>
.input-main-fake {
  background: #ffffff;
  border-radius: 20px;
  padding: 14px 16px;
  color: #aaa;
  font-size: 15px;
  cursor: text;
  border: 1px solid #eee;
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  box-sizing: border-box;
}
/* 头像选择弹窗样式复用 */
.avatar-trigger {
  position: relative;
  display: flex;
  align-items: center;
}
.avatar-dropdown {
  position: absolute;
  left: 0;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 4px 24px #0003;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 10px 12px 10px;
  min-width: 48px;
  min-height: 48px;
  align-items: center;
}
.avatar-option {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border 0.2s;
}
.avatar-option.active {
  border: 2px solid #409eff;
}
.dropdown-bottom {
  top: 44px;
}
.dropdown-bottom::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px 8px 0 8px;
  border-style: solid;
  border-color: #fff transparent transparent transparent;
  filter: drop-shadow(0 2px 4px #0001);
}
</style>