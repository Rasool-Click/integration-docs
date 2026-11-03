<script setup>
import { useHead } from '@unhead/vue'

useHead({
  titleTemplate: '%s | WESSAAL Developers',
  title: 'API Documentation',
  meta: [
    { name: 'description', content: 'WESSAAL developer documentation: authentication, quickstart, API endpoints and code examples.' },
    { property: 'og:title', content: 'WESSAAL API Documentation' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://docs.wessaal.com/' },
    { property: 'og:description', content: 'WESSAAL developer documentation: authentication, quickstart, API endpoints and code examples.' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: 'https://docs.wessaal.com/' },
  ],
})
</script>

<template>
  <RouterView />
</template>
