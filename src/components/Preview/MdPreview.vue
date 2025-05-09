<template>
  <BackIcon />
  <Loading v-if="!html" />
  <div v-else class="md-preview" v-html="html"></div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/github.css'
import Loading from '@/components/Loading.vue'
import BackIcon from '@/components/BackIcon.vue'
const props = defineProps({ file: Object })
const html = ref('')
hljs.registerLanguage('js', javascript)
onMounted(async () => {
  if (!props.file || !props.file.url) {
    html.value = '<div style="color:#f56c6c;">未找到文件内容</div>'
    return
  }
  const md = new MarkdownIt({
    html: false,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang }).value + '</code></pre>'
        } catch (__) {}
      }
      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
    }
  })
  let text = ''
  try {
    text = await fetch(props.file.url).then(r => r.text())
  } catch (e) {
    html.value = '<div style="color:#f56c6c;">文件内容加载失败</div>'
    return
  }
  html.value = md.render(text)
  nextTick(() => {
    document.querySelectorAll('.md-preview pre code').forEach((block) => {
      hljs.highlightElement(block)
    })
  })
})
</script>
<style scoped>
.md-preview {
  max-width: 90vw;
  max-height: 60vh;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  font-size: 15px;
  color: #222;
  margin: 0 auto;
}
.md-preview h1, .md-preview h2, .md-preview h3 {
  margin: 1em 0 0.5em;
}
.md-preview pre {
  background: #f8f8f8;
  padding: 8px;
  border-radius: 6px;
  overflow-x: auto;
}
</style> 