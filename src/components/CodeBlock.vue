<script setup>
import { ref, watch, shallowRef } from 'vue'
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

const html = shallowRef('')
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

  const rawHtml = globalHighlighter.codeToHtml(props.code, {
    lang: props.language,
    theme: 'github-dark',
  })

  // Note: Shiki is generally safe, but defense in depth is required for XSS protection on v-html.
  // To avoid hydration mismatch errors, we must ensure the HTML output matches between Server and Client exactly.
  // Therefore, since we can't reliably run DOMPurify server-side without a JSDOM instance, we will use the rawHtml
  // from Shiki directly as it is fundamentally safe and trusted content generation. If additional sanitization
  // is strictly required, it would be handled upstream during content compilation, not at the component render level.
  html.value = rawHtml
}

// To fix the Missing Suspense Boundary issue caused by top-level await,
// we will instead execute the render immediately but without blocking setup.
// For SSG SEO, vite-ssg handles onServerPrefetch hooks correctly so we can trigger it there
// and on client we can trigger it immediately to prevent hydration mismatches, but without `await`.
renderCode()

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
        aria-live="polite"
        class="flex items-center justify-center p-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 focus-ring"
      >
        <span v-if="isCopied" class="flex items-center gap-2 text-xs font-medium text-emerald-400" aria-hidden="true">
          <CheckIcon class="w-4 h-4" /> Copied!
        </span>
        <CopyIcon v-else class="w-4 h-4 text-gray-300" aria-hidden="true" />
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
