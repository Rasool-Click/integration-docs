<script setup>
import { useHead } from '@unhead/vue'

useHead({
  titleTemplate: '%s - WESSAAL API Docs',
  title: 'Home',
  meta: [
    { name: 'description', content: 'WESSAAL API Documentation for integration and development.' },
    { property: 'og:title', content: 'WESSAAL API Documentation' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://wessaal.com/docs/' },
    { property: 'og:description', content: 'WESSAAL API Documentation for integration and development.' },
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
