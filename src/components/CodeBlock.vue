<script setup>
import { ref, watch, onMounted, shallowRef } from 'vue'
import { getHighlighter } from 'shiki'
import { CheckIcon, CopyIcon } from '@lucide/vue'

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'json',
  },
})

const html = ref('')
const isCopied = ref(false)

// Use a singleton pattern to reuse the Shiki highlighter instance across all code blocks
// This avoids severe memory leaks when rendering numerous blocks.
let globalHighlighter = null

const renderCode = async () => {
  if (!globalHighlighter) {
    globalHighlighter = await getHighlighter({
      themes: ['github-dark'],
      langs: ['json', 'bash', 'javascript', 'html', 'vue'],
    })
  }

  html.value = globalHighlighter.codeToHtml(props.code, {
    lang: props.language,
    theme: 'github-dark',
  })
}

onMounted(() => {
  renderCode()
})

watch(() => props.code, renderCode)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>

<template>
  <div class="relative group rounded-lg overflow-hidden bg-[#24292e]">
    <div class="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        @click="copyToClipboard"
        :aria-label="isCopied ? 'Copied to clipboard' : 'Copy code to clipboard'"
        class="flex items-center justify-center p-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
      >
        <span v-if="isCopied" class="flex items-center gap-2 text-xs font-medium text-emerald-400">
          <CheckIcon class="w-4 h-4" /> Copied!
        </span>
        <CopyIcon v-else class="w-4 h-4 text-gray-300" />
      </button>
    </div>

    <div
      class="p-4 overflow-x-auto text-sm font-mono [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0"
      v-html="html"
    ></div>
  </div>
</template>

<style>
/* Scoped overrides for shiki if necessary */
.shiki {
  background-color: transparent !important;
}
</style>
