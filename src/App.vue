<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

const route = useRoute()
const origin = 'https://docs.wessaal.com'
const metadata = {
  '/': {
    title: 'WESSAAL API Documentation',
    description: 'WESSAAL Linked Devices REST API developer docs with scoped API keys, messages, contacts and integration guidance.',
    heading: 'Integrate with WESSAAL',
  },
  '/quickstart': {
    title: 'WESSAAL API Quickstart',
    description: 'Make your first WESSAAL Linked Devices API request: validate your API key, choose an instance and queue a message.',
    heading: 'Quickstart',
  },
  '/authentication': {
    title: 'WESSAAL API Key Authentication',
    description: 'Authenticate WESSAAL Linked Devices API requests using X-API-Key, least-privilege permissions and key rotation.',
    heading: 'Authentication',
  },
  '/endpoints': {
    title: 'WESSAAL API Endpoints Reference',
    description: 'Reference GET and POST endpoints for WESSAAL messaging, instances, groups, contacts, templates and delivery status.',
    heading: 'API Endpoints',
  },
  '/webhooks': {
    title: 'WESSAAL Webhooks and Delivery Status',
    description: 'Understand webhook availability and reliable delivery-status polling for WESSAAL Linked Devices integrations.',
    heading: 'Webhooks and delivery events',
  },
}
const path = computed(() => route.path.replace(/\/$/, '') || '/')
const page = computed(() => metadata[path.value] || metadata['/'])
const canonical = computed(() => origin + (path.value === '/' ? '/' : path.value + '/'))
useHead(() => ({
  title: page.value.title,
  meta: [
    { name: 'description', content: page.value.description },
    { property: 'og:title', content: page.value.title },
    { property: 'og:description', content: page.value.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: canonical.value },
    { name: 'twitter:card', content: 'summary' },
  ],
  link: [{ rel: 'canonical', href: canonical.value }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: page.value.heading,
        description: page.value.description,
        url: canonical.value,
        inLanguage: 'en',
        author: { '@type': 'Organization', name: 'WESSAAL', url: 'https://wessaal.com/' },
        publisher: { '@type': 'Organization', name: 'WESSAAL', url: 'https://wessaal.com/' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Documentation', item: origin + '/' },
          ...(path.value === '/' ? [] : [{
            '@type': 'ListItem', position: 2, name: page.value.heading, item: canonical.value,
          }]),
        ],
      },
    ]),
  }],
}))
</script>

<template>
  <RouterView />
</template>
