<script setup>
import { useHead } from '@unhead/vue'

useHead({
  titleTemplate: '%s - WESSAAL Developers',
  title: 'Home',
  meta: [
    { name: 'description', content: 'WESSAAL Linked Devices API — authenticate, send WhatsApp messages, manage contacts, templates, and workspaces through connected devices.' },
    { property: 'og:title', content: 'WESSAAL Developer Documentation' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://wessaal.com/docs/' },
    { property: 'og:description', content: 'WESSAAL Linked Devices API — authenticate, send, track, and manage through connected devices.' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: 'https://wessaal.com/docs/' },
  ],
})
</script>

<template>
  <RouterView />
</template>
