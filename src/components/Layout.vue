<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, ChevronRight,
  Code2, Command, Copy, ExternalLink, FileText, KeyRound, Menu, MessageSquare,
  Search, Server, ShieldCheck, Terminal, X, Zap,
} from '@lucide/vue'
import EndpointSection from './EndpointSection.vue'
import { DOC_SECTIONS, ENDPOINTS, PERMISSIONS } from '../data/docs'

const BASE_URL = 'https://app.wessaal.com/integration/v1'
const docs = DOC_SECTIONS
const endpoints = ENDPOINTS.filter(endpoint => (endpoint.platform || 'linked') === 'linked')
const groupNames = ['Health', 'Messages', 'Instances', 'Contacts', 'Templates', 'Workspaces']
const endpointGroups = groupNames
  .map(name => ({ name, items: endpoints.filter(item => item.group === name) }))
  .filter(group => group.items.length)

const activeId = ref('overview')
const sidebarOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const copied = ref(false)
const collapsedGroups = ref({})
const searchItems = [
  ...docs.map(item => ({ id: item.id, title: item.title, desc: item.summary, group: 'Guides' })),
  ...endpoints.map(item => ({ id: item.id, title: item.title, desc: item.method + ' ' + item.path, group: item.group, method: item.method })),
]
const results = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return searchItems.slice(0, 8)
  return searchItems.filter(item => (
    (item.title + ' ' + item.desc + ' ' + item.group).toLowerCase().includes(q)
  )).slice(0, 12)
})
const activeDoc = computed(() => docs.find(item => item.id === activeId.value))
const activeEndpoint = computed(() => endpoints.find(item => item.id === activeId.value))
const isHome = computed(() => activeId.value === 'overview')
const index = computed(() => searchItems.findIndex(item => item.id === activeId.value))
const prevPage = computed(() => index.value > 0 ? searchItems[index.value - 1] : null)
const nextPage = computed(() => index.value < searchItems.length - 1 ? searchItems[index.value + 1] : null)

function navigate(id) {
  if (!searchItems.some(item => item.id === id)) id = 'overview'
  activeId.value = id
  sidebarOpen.value = false
  searchOpen.value = false
  searchQuery.value = ''
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '#' + id)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
}
function syncHash() {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (searchItems.some(item => item.id === id)) activeId.value = id
}
async function showSearch() {
  searchQuery.value = ''
  searchOpen.value = true
  sidebarOpen.value = false
  await nextTick()
  searchInput.value?.focus()
}
function closeSearch() { searchOpen.value = false; searchQuery.value = '' }
function handleKeyboard(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    showSearch()
  }
  if (event.key === 'Escape') {
    closeSearch()
    sidebarOpen.value = false
  }
}
function toggleGroup(name) {
  collapsedGroups.value = { ...collapsedGroups.value, [name]: !collapsedGroups.value[name] }
}
async function copyBaseUrl() {
  try {
    await navigator.clipboard.writeText(BASE_URL)
    copied.value = true
    window.setTimeout(() => { copied.value = false }, 1500)
  } catch { copied.value = false }
}
onMounted(() => {
  syncHash()
  window.addEventListener('hashchange', syncHash)
  window.addEventListener('keydown', handleKeyboard)
})
onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncHash)
  window.removeEventListener('keydown', handleKeyboard)
})
watch([sidebarOpen, searchOpen], ([isNav, isSearch]) => {
  if (typeof document !== 'undefined') document.body.style.overflow = isNav || isSearch ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <div class="developer-shell">
    <a class="skip-link" href="#docs-content">Skip to content</a>

    <header class="developer-topbar">
      <div class="topbar-brand">
        <button class="topbar-menu icon-button" type="button" aria-label="Open navigation" @click="sidebarOpen = true"><Menu :size="19" /></button>
        <a href="#overview" class="brand-home" aria-label="WESSAAL Developers home" @click.prevent="navigate('overview')">
          <img src="/brand/WESSAAL_Primary_On_Light.svg" alt="WESSAAL" />
        </a>
        <span class="brand-separator" />
        <span class="brand-title">Developers</span>
        <span class="brand-product">API Docs</span>
      </div>

      <div class="topbar-actions">
        <button type="button" class="header-search" @click="showSearch" aria-label="Search documentation">
          <Search :size="17" /><span>Search documentation</span>
          <kbd>⌘ K</kbd>
        </button>
        <button type="button" class="search-mobile icon-button" @click="showSearch" aria-label="Search documentation"><Search :size="19" /></button>
        <span class="topbar-action-divider" />
        <a class="topbar-link" href="https://wessaal.com/en/" target="_blank" rel="noopener noreferrer">Website <ArrowUpRight :size="14" /></a>
        <a class="topbar-dashboard" href="https://dashboard.wessaal.com/" target="_blank" rel="noopener noreferrer">Dashboard <ArrowUpRight :size="14" /></a>
      </div>
    </header>

    <div class="developer-layout">
      <div v-if="sidebarOpen" class="sidebar-backdrop" @click="sidebarOpen = false" />
      <aside :class="['developer-sidebar', { 'sidebar-open': sidebarOpen }]" aria-label="Documentation navigation">
        <div class="sidebar-mobile-top"><span>Documentation</span><button class="icon-button" type="button" aria-label="Close navigation" @click="sidebarOpen = false"><X :size="20" /></button></div>
        <div class="sidebar-version"><span class="version-dot" /> WESSAAL API <span class="version-text">v1</span></div>
        <nav class="sidebar-scroll" aria-label="Documentation pages">
          <div class="sidebar-group">
            <p class="sidebar-group-label">GET STARTED</p>
            <button :class="['sidebar-item', { selected: activeId === 'overview' }]" @click="navigate('overview')"><BookOpen :size="17" /><span>Introduction</span></button>
            <button :class="['sidebar-item', { selected: activeId === 'authentication' }]" @click="navigate('authentication')"><KeyRound :size="17" /><span>Authentication</span></button>
            <button :class="['sidebar-item', { selected: activeId === 'quickstart' }]" @click="navigate('quickstart')"><Zap :size="17" /><span>Quickstart</span></button>
            <button :class="['sidebar-item', { selected: activeId === 'responses' }]" @click="navigate('responses')"><ShieldCheck :size="17" /><span>Responses & errors</span></button>
          </div>
          <div class="sidebar-group reference-group">
            <div class="sidebar-reference-heading"><p class="sidebar-group-label">API REFERENCE</p><span>{{ endpoints.length }}</span></div>
            <div v-for="group in endpointGroups" :key="group.name" class="endpoint-nav-group">
              <button type="button" class="sidebar-group-toggle" :aria-expanded="!collapsedGroups[group.name]" @click="toggleGroup(group.name)">
                <span>{{ group.name }}</span>
                <ChevronDown :size="14" :class="{ 'chevron-collapsed': collapsedGroups[group.name] }" />
              </button>
              <div v-if="!collapsedGroups[group.name]" class="endpoint-nav-items">
                <button v-for="item in group.items" :key="item.id" :class="['endpoint-nav-item', { selected: activeId === item.id }]" @click="navigate(item.id)" :title="item.method + ' ' + item.path">
                  <span :class="['nav-method', 'nav-' + item.method.toLowerCase()]">{{ item.method }}</span><span class="endpoint-nav-name">{{ item.title }}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div class="sidebar-footer">
          <a href="mailto:info@wessaal.com">Need help? <ArrowUpRight :size="14" /></a>
        </div>
      </aside>

      <main id="docs-content" class="developer-content">
        <template v-if="activeEndpoint">
          <EndpointSection :key="activeEndpoint.id" :section="activeEndpoint" />
        </template>
        <template v-else-if="isHome">
          <div class="docs-guide-layout">
            <article class="docs-article">
              <div class="docs-breadcrumb"><span>Documentation</span><ChevronRight :size="14" /><span>Introduction</span></div>
              <p class="intro-eyebrow">WESSAAL DEVELOPERS</p>
              <h1 class="intro-title">Integrate with WESSAAL</h1>
              <p class="intro-lead">Everything you need to connect your application with the WESSAAL messaging API. Explore the API, authenticate requests, and start building with practical examples.</p>
              <div class="intro-rule" />
              <h2 class="section-title">Start building</h2>
              <p class="section-description">A straightforward path from your first API key to your first request.</p>

              <div class="getting-started-list">
                <button type="button" @click="navigate('authentication')" class="getting-started-link">
                  <span class="start-icon"><KeyRound :size="20" /></span>
                  <span class="start-copy"><strong>Authentication</strong><small>Configure your API key and request headers.</small></span>
                  <ArrowRight :size="17" />
                </button>
                <button type="button" @click="navigate('quickstart')" class="getting-started-link">
                  <span class="start-icon"><Terminal :size="20" /></span>
                  <span class="start-copy"><strong>Quickstart</strong><small>Make your first request in a few steps.</small></span>
                  <ArrowRight :size="17" />
                </button>
                <button type="button" @click="navigate('send-message')" class="getting-started-link">
                  <span class="start-icon"><MessageSquare :size="20" /></span>
                  <span class="start-copy"><strong>Send a message</strong><small>Review the request body and sample response.</small></span>
                  <ArrowRight :size="17" />
                </button>
              </div>

              <h2 class="section-title lower-title">API essentials</h2>
              <div class="essentials-grid">
                <div class="essential-item"><Server :size="18" /><strong>REST API</strong><p>Make HTTPS requests using JSON payloads.</p></div>
                <div class="essential-item"><ShieldCheck :size="18" /><strong>Scoped keys</strong><p>Keys are checked against required permissions.</p></div>
                <div class="essential-item"><Code2 :size="18" /><strong>Examples</strong><p>Copy request samples for cURL, JavaScript and PHP.</p></div>
              </div>

              <div class="article-footnote">This portal documents the Linked Devices integration API. Verify the contract and availability before production integration.</div>
            </article>

            <aside class="guide-side" aria-label="First request example">
              <div class="guide-side-inner">
                <div class="side-heading"><span>BASE URL</span><button type="button" @click="copyBaseUrl" :aria-label="copied ? 'Copied base URL' : 'Copy base URL'"><Check v-if="copied" :size="14" /><Copy v-else :size="14" /></button></div>
                <div class="base-url"><code>{{ BASE_URL }}</code></div>
                <div class="side-divider" />
                <div class="side-heading"><span>YOUR FIRST REQUEST</span><span class="example-language">cURL</span></div>
                <pre class="guide-code"><code><span class="token-cmd">curl</span> --request GET \
  --url '{{ BASE_URL }}/ping' \
  --header 'X-API-Key: YOUR_API_KEY'</code></pre>
                <div class="side-divider" />
                <div class="side-heading"><span>EXAMPLE RESPONSE</span><span class="example-language">200 OK</span></div>
                <pre class="guide-code"><code>{
  "success": true,
  "message": "pong"
}</code></pre>
                <p class="code-disclaimer">Illustrative response based on existing documentation.</p>
              </div>
            </aside>
          </div>
        </template>
        <template v-else-if="activeDoc">
          <div class="docs-guide-layout">
            <article class="docs-article guide-article">
              <div class="docs-breadcrumb"><span>Guides</span><ChevronRight :size="14" /><span>{{ activeDoc.title }}</span></div>
              <h1 class="reference-title">{{ activeDoc.title }}</h1>
              <p class="reference-intro">{{ activeDoc.summary }}</p>
              <div class="intro-rule" />
              <template v-if="activeDoc.id === 'authentication'">
                <h2 class="section-title">Authenticate every request</h2>
                <p class="section-description">Add your key using the <code>X-API-Key</code> header. Keep the key on a trusted server, not in browser JavaScript.</p>
                <div class="auth-fact"><KeyRound :size="17" /><div><strong>Header</strong><code>X-API-Key: YOUR_API_KEY</code></div></div>
                <h2 class="section-title lower-title">Key security</h2>
                <ul class="doc-bullet-list"><li v-for="bullet in activeDoc.bullets" :key="bullet">{{ bullet }}</li></ul>
                <button class="inline-next" @click="navigate('quickstart')">Continue to quickstart <ArrowRight :size="16" /></button>
              </template>
              <template v-else-if="activeDoc.id === 'quickstart'">
                <h2 class="section-title">Your first request</h2>
                <div class="quickstep-list">
                  <button v-for="(step, i) in activeDoc.steps" :key="step.title" class="quickstep" @click="navigate(['ping','me','instances-list','send-message','message-status'][i])">
                    <span class="quickstep-index">{{ String(i + 1).padStart(2,'0') }}</span>
                    <span><strong>{{ step.title }}</strong><small>{{ step.text }}</small></span>
                    <ArrowUpRight :size="17" />
                  </button>
                </div>
              </template>
              <template v-else-if="activeDoc.id === 'responses'">
                <h2 class="section-title">HTTP status codes</h2>
                <p class="section-description">The current reference lists these result types. Exact response shapes can vary by operation.</p>
                <div class="status-code-list">
                  <div v-for="bullet in activeDoc.bullets" :key="bullet" class="status-code-row">
                    <span class="status-number">{{ bullet.split(' ')[0] }}</span><p>{{ bullet.slice(bullet.indexOf(' ')+1) }}</p>
                  </div>
                </div>
              </template>
            </article>
            <aside class="guide-side" aria-label="Request context">
              <div class="guide-side-inner">
                <div class="side-heading"><span>ENDPOINT</span><span class="example-language">v1</span></div>
                <div class="base-url"><code>{{ BASE_URL }}</code></div>
                <div class="side-divider" />
                <div class="side-heading"><span>AUTH HEADER</span><span class="example-language">REQUIRED</span></div>
                <pre class="guide-code"><code>X-API-Key: YOUR_API_KEY</code></pre>
                <div class="side-divider" />
                <p class="guide-note">Documentation examples use placeholders. Never paste a live secret into public code or screenshots.</p>
                <button type="button" class="guide-link" @click="navigate('ping')">Explore the API reference <ArrowRight :size="15" /></button>
              </div>
            </aside>
          </div>
        </template>

        <div v-if="prevPage || nextPage" class="docs-pagination">
          <button type="button" v-if="prevPage" @click="navigate(prevPage.id)"><span>PREVIOUS</span><strong><ChevronRight class="flip-arrow" :size="15" /> {{ prevPage.title }}</strong></button>
          <span v-else />
          <button type="button" v-if="nextPage" @click="navigate(nextPage.id)"><span>NEXT</span><strong>{{ nextPage.title }} <ChevronRight :size="15" /></strong></button>
        </div>
        <footer class="docs-bottom-footer"><span>WESSAAL Developer Documentation</span><a href="mailto:info@wessaal.com">Support <ArrowUpRight :size="13" /></a></footer>
      </main>
    </div>

    <div v-if="searchOpen" class="search-modal-backdrop" @click.self="closeSearch">
      <div class="search-dialog" role="dialog" aria-modal="true" aria-label="Search documentation">
        <div class="search-dialog-bar"><Search :size="20" /><input ref="searchInput" v-model="searchQuery" type="search" autocomplete="off" placeholder="Search guides, endpoints, parameters..." @keydown.enter="results.length && navigate(results[0].id)" /><button type="button" aria-label="Close search" @click="closeSearch"><X :size="19" /></button></div>
        <div class="search-results">
          <p class="search-results-title">{{ searchQuery ? 'SEARCH RESULTS' : 'QUICK ACCESS' }}</p>
          <button v-for="item in results" :key="item.id" type="button" @click="navigate(item.id)" class="search-result">
            <span class="search-result-icon"><FileText :size="17" /></span>
            <span class="search-result-text"><strong>{{ item.title }}</strong><small>{{ item.group }} <span v-if="item.method"> · {{ item.desc }}</span></small></span>
            <ChevronRight :size="16" />
          </button>
          <p v-if="!results.length" class="search-empty">No matching documentation pages.</p>
        </div>
        <div class="search-footer"><kbd>ESC</kbd> Close <span><kbd>↵</kbd> Open</span></div>
      </div>
    </div>
  </div>
</template>
