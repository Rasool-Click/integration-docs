<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SidebarNav from './SidebarNav.vue'
import EndpointSection from './EndpointSection.vue'
import AppIcon from './AppIcon.vue'
import { DOC_SECTIONS, ENDPOINT_GROUPS, ENDPOINTS, NAV_GROUPS, PERMISSIONS } from '../data/docs'
import logoNavy from '../assets/brand/wessaal-logo-on-navy.svg'
import mark from '../assets/brand/wessaal-mark.png'

const isDark = ref(false)
const activeSection = ref('overview')
const observer = ref(null)
const search = ref('')
const selectedGroup = ref('All')
const developerSearch = ref('')
const isDeveloperSearchFocused = ref(false)
const developerSearchWrapper = ref(null)
const mobileNavOpen = ref(false)

const endpointSections = computed(() => {
  const query = search.value.trim().toLowerCase()

  return ENDPOINTS.filter((endpoint) => {
    const groupMatches = selectedGroup.value === 'All' || endpoint.group === selectedGroup.value
    const searchable = `${endpoint.title} ${endpoint.description} ${endpoint.method} ${endpoint.path} ${endpoint.permission} ${endpoint.group}`.toLowerCase()
    return groupMatches && (!query || searchable.includes(query))
  })
})

const quickHighlights = computed(() => [
  {
    id: 'base',
    label: 'Base URL',
    value: 'https://app.wessaal.com/integration/v1',
    icon: 'server',
    mono: true,
  },
  {
    id: 'auth',
    label: 'Authentication',
    value: 'X-API-Key',
    icon: 'lock',
    mono: true,
  },
  {
    id: 'status',
    label: 'Status',
    value: 'Live',
    icon: 'activity',
    mono: false,
  },
])

const developerResults = computed(() => {
  const query = developerSearch.value.trim().toLowerCase()
  if (!query) return []

  const sectionMatches = DOC_SECTIONS.filter((section) => {
    const sectionText = [
      section.title,
      section.summary,
      ...(section.bullets || []),
      ...((section.cards || []).map((card) => `${card.label} ${card.value}`)),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return sectionText.includes(query)
  }).map((section) => ({
    id: section.id,
    href: `#${section.id}`,
    icon: section.icon || 'book',
    title: section.title,
    subtitle: section.summary,
    kind: 'Guide',
    targetSection: section.id,
  }))

  const endpointMatches = ENDPOINTS.filter((endpoint) => {
    const endpointText = `${endpoint.title} ${endpoint.description} ${endpoint.method} ${endpoint.path} ${endpoint.permission} ${endpoint.group}`.toLowerCase()
    return endpointText.includes(query)
  }).map((endpoint) => ({
    id: endpoint.id,
    href: `#${endpoint.id}`,
    icon: 'terminal',
    title: endpoint.title,
    subtitle: `${endpoint.method} ${endpoint.path}`,
    kind: 'Endpoint',
    targetSection: 'endpoints',
  }))

  return [...sectionMatches, ...endpointMatches].slice(0, 8)
})

const showDeveloperResults = computed(() => isDeveloperSearchFocused.value && developerSearch.value.trim().length > 0)

function setTheme(nextDark) {
  isDark.value = nextDark
  document.documentElement.classList.toggle('dark', nextDark)
}

function initTheme() {
  setTheme(false)
}

function handleOutsideClick(event) {
  if (!developerSearchWrapper.value?.contains(event.target)) {
    isDeveloperSearchFocused.value = false
  }
}

function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value
}

function closeMobileNav() {
  mobileNavOpen.value = false
}

function handleMobileNavKeydown(event) {
  if (event.key === 'Escape') closeMobileNav()
}

watch(mobileNavOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

async function goToDeveloperResult(result) {
  if (result.kind === 'Endpoint') {
    selectedGroup.value = 'All'
    search.value = ''
    await nextTick()
  }

  isDeveloperSearchFocused.value = false
  developerSearch.value = ''
  activeSection.value = result.targetSection

  window.requestAnimationFrame(() => {
    const target = document.getElementById(result.id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', result.href)
    }
  })
}

function goToFirstDeveloperResult() {
  if (!developerResults.value.length) return
  goToDeveloperResult(developerResults.value[0])
}

function setupScrollSpy() {
  const sections = document.querySelectorAll('[data-doc-section]')

  observer.value = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visible.length > 0) activeSection.value = visible[0].target.id
    },
    { threshold: [0.2, 0.45, 0.7], rootMargin: '-18% 0px -58% 0px' },
  )

  sections.forEach((section) => observer.value.observe(section))
}

onMounted(() => {
  initTheme()
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('keydown', handleMobileNavKeydown)
  setupScrollSpy()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('keydown', handleMobileNavKeydown)
  observer.value?.disconnect()
})

watch(endpointSections, () => {
  window.requestAnimationFrame(() => {
    observer.value?.disconnect()
    setupScrollSpy()
  })
})
</script>

<template>
  <div class="min-h-screen bg-brand-50/40 text-slate-700 dark:bg-brand-950 dark:text-slate-200">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 border-b border-white/10 bg-brand-900/95 backdrop-blur-xl"
      role="banner"
    >
      <div class="mx-auto max-w-[1680px] px-4 py-3.5 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <a href="#overview" class="flex min-w-0 items-center" aria-label="WESSAAL Developer Documentation">
            <img :src="logoNavy" alt="WESSAAL" class="hidden h-16 w-auto shrink-0 sm:block" />
            <img :src="mark" alt="WESSAAL" class="h-10 w-auto shrink-0 sm:hidden" />
          </a>

          <div ref="developerSearchWrapper" class="relative order-3 w-full md:order-2 md:max-w-xl md:flex-1">
            <label class="relative block" for="dev-search">
              <span class="sr-only">Search the developer documentation</span>
              <AppIcon name="search" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300/70" aria-hidden="true" />
              <input
                id="dev-search"
                v-model="developerSearch"
                type="search"
                placeholder="Search endpoints, guides, permissions"
                class="h-11 w-full rounded-lg border border-white/15 bg-white/10 pl-9 pr-9 text-sm font-medium text-white placeholder:text-brand-300/60 outline-none ring-0 transition focus:border-brand-400 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400"
                @focus="isDeveloperSearchFocused = true"
                @keydown.enter.prevent="goToFirstDeveloperResult"
                @keydown.esc="isDeveloperSearchFocused = false"
              />
              <button
                v-if="developerSearch"
                type="button"
                aria-label="Clear search"
                class="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-brand-300 hover:bg-white/10 hover:text-white"
                @click="developerSearch = ''"
              >
                <AppIcon name="x" class="h-4 w-4" aria-hidden="true" />
              </button>
            </label>

            <div
              v-if="showDeveloperResults"
              class="absolute left-0 right-0 z-50 mt-2 max-h-[340px] w-full overflow-auto rounded-xl border border-brand-100 bg-white p-2 shadow-xl"
            >
              <button
                v-for="result in developerResults"
                :key="result.id"
                type="button"
                class="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-brand-50"
                @click="goToDeveloperResult(result)"
              >
                <span class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-100 text-brand-600">
                  <AppIcon :name="result.icon" class="h-4 w-4" />
                </span>
                <span class="min-w-0">
                  <span class="block truncate text-sm font-semibold text-slate-900">{{ result.title }}</span>
                  <span class="block truncate text-xs text-slate-500">{{ result.subtitle }}</span>
                </span>
                <span class="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                  {{ result.kind }}
                </span>
              </button>

              <p v-if="developerResults.length === 0" class="px-3 py-2 text-sm font-medium text-slate-500">
                No results. Try an endpoint name, path, or section title.
              </p>
            </div>
          </div>

          <div class="order-2 flex shrink-0 items-center gap-1.5 md:order-3">
            <button
              type="button"
              class="grid h-11 w-11 place-items-center rounded-lg text-brand-200 transition hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Open documentation menu"
              aria-controls="mobile-nav-drawer"
              :aria-expanded="mobileNavOpen"
              @click="toggleMobileNav"
            >
              <AppIcon name="menu" class="h-5 w-5" />
            </button>
            <button
              type="button"
              class="grid h-11 w-11 place-items-center rounded-lg text-brand-200 transition hover:bg-white/10 hover:text-white"
              :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
              :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
              @click="setTheme(!isDark)"
            >
              <AppIcon :name="isDark ? 'sun' : 'moon'" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile navigation drawer -->
    <transition name="drawer">
      <div
        v-if="mobileNavOpen"
        class="fixed inset-0 z-50 lg:hidden"
        role="presentation"
      >
        <div
          class="absolute inset-0 bg-brand-950/60 backdrop-blur-sm"
          aria-hidden="true"
          @click="closeMobileNav"
        ></div>
        <aside
          id="mobile-nav-drawer"
          class="mobile-drawer-panel absolute inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl dark:bg-brand-950"
          role="dialog"
          aria-modal="true"
          aria-label="Documentation sections"
        >
          <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <img :src="mark" alt="WESSAAL" class="h-9 w-auto" />
            <button
              type="button"
              class="grid h-10 w-10 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close documentation menu"
              @click="closeMobileNav"
            >
              <AppIcon name="x" class="h-5 w-5" />
            </button>
          </div>
          <nav class="flex-1 space-y-6 px-3 py-5" aria-label="Documentation sections">
            <div v-for="group in NAV_GROUPS" :key="group.label">
              <p class="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {{ group.label }}
              </p>
              <div class="mt-2.5 grid gap-1">
                <a
                  v-for="item in group.items"
                  :key="item.id"
                  :href="`#${item.id}`"
                  class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                  :class="activeSection === item.id ? 'bg-brand-100/80 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300' : ''"
                  @click="closeMobileNav"
                >
                  <AppIcon :name="item.icon || 'book'" class="h-[18px] w-[18px] shrink-0" />
                  {{ item.label }}
                </a>
              </div>
            </div>
          </nav>
        </aside>
      </div>
    </transition>

    <main id="main-content">
      <!-- Hero -->
      <section class="relative border-b border-white/10 bg-brand-900" aria-labelledby="intro-heading">
        <div class="mx-auto max-w-[1680px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div class="max-w-4xl">
            <h1 id="intro-heading" class="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              WESSAAL Linked Devices API
            </h1>
            <p class="mt-3 max-w-2xl text-lg leading-8 text-brand-100">
              Send WhatsApp messages through connected devices, track delivery, and manage contacts, templates, and workspaces — all authenticated with a single API key.
            </p>

            <dl class="mt-6 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3">
              <div
                v-for="highlight in quickHighlights"
                :key="highlight.id"
                class="bg-brand-900/80 p-4 sm:p-5"
              >
                <dt class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-300">
                  <AppIcon :name="highlight.icon" class="h-4 w-4" />
                  {{ highlight.label }}
                </dt>
                <dd
                  class="mt-1.5 text-[15px] font-semibold text-white"
                  :class="highlight.mono ? 'break-words font-mono text-[14px] font-medium' : ''"
                >
                  {{ highlight.value }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div class="mx-auto grid max-w-[1680px] grid-cols-[minmax(0,1fr)] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside class="hidden lg:block" aria-label="Sidebar Navigation">
          <SidebarNav :groups="NAV_GROUPS" :active-section="activeSection" />
        </aside>

        <div class="min-w-0 space-y-8">
          <!-- Doc sections -->
          <section
            v-for="section in DOC_SECTIONS"
            :id="section.id"
            :key="section.id"
            data-doc-section
            class="scroll-mt-36 md:scroll-mt-28"
          >
            <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {{ section.title }}
            </h2>

            <p class="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              {{ section.summary }}
            </p>

            <div v-if="section.cards" class="mt-6 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-3">
              <article
                v-for="card in section.cards"
                :key="card.label"
                class="bg-white p-4 dark:bg-brand-900/60"
              >
                <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <AppIcon :name="card.icon" class="h-4 w-4 text-brand-500 dark:text-brand-300" />
                  {{ card.label }}
                </p>
                <p class="mt-2 break-words font-mono text-sm font-semibold text-slate-900 dark:text-white">{{ card.value }}</p>
              </article>
            </div>

            <div v-if="section.code" class="mt-6 overflow-hidden rounded-xl border border-brand-500/20 bg-[#111128]">
              <div class="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2">
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Example</p>
              </div>
              <pre class="max-w-full overflow-auto p-4 text-[13px] leading-6 text-slate-100"><code class="font-mono">{{ section.code }}</code></pre>
            </div>

            <ol v-if="section.steps" class="mt-6 space-y-0">
              <li
                v-for="(step, index) in section.steps"
                :key="step.title"
                class="relative flex gap-4 pb-6 last:pb-0"
              >
                <span v-if="index < section.steps.length - 1" class="absolute left-[15px] top-9 h-full w-px bg-slate-200 dark:bg-slate-800" aria-hidden="true"></span>
                <span class="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brand-200 bg-white text-sm font-bold text-brand-600 dark:border-brand-500/40 dark:bg-brand-900 dark:text-brand-300">
                  {{ index + 1 }}
                </span>
                <div class="pt-0.5">
                  <h3 class="text-[15px] font-semibold text-slate-900 dark:text-white">{{ step.title }}</h3>
                  <p class="mt-1.5 text-[15px] leading-7 text-slate-600 dark:text-slate-300">{{ step.text }}</p>
                </div>
              </li>
            </ol>

            <ul v-if="section.bullets" class="mt-6 space-y-3">
              <li
                v-for="item in section.bullets"
                :key="item"
                class="flex items-start gap-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300"
              >
                <AppIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-brand-500 dark:text-brand-300" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </section>

          <!-- Endpoint reference -->
          <section id="endpoints" data-doc-section class="scroll-mt-36 md:scroll-mt-28">
            <div class="mb-6">
              <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    API Reference
                  </h2>
                  <p class="mt-2 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    Live routes for the Linked Devices API. Permission names match the scopes applied to your API key.
                  </p>
                </div>
                <div class="grid w-full gap-2 sm:grid-cols-[minmax(0,1fr)_170px] lg:w-auto lg:min-w-[430px]">
                  <label class="relative block" for="endpoint-search">
                    <span class="sr-only">Search endpoints</span>
                    <AppIcon name="search" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                      id="endpoint-search"
                      v-model="search"
                      type="search"
                      placeholder="Search endpoints"
                      class="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm font-medium text-slate-800 outline-none ring-0 focus:border-brand-500 focus-ring dark:border-slate-700 dark:bg-brand-900 dark:text-white"
                    />
                  </label>
                  <label for="endpoint-group" class="sr-only">Filter by group</label>
                  <select
                    id="endpoint-group"
                    v-model="selectedGroup"
                    class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium outline-none focus:border-brand-500 focus-ring dark:border-slate-700 dark:bg-brand-900 dark:text-white"
                  >
                    <option v-for="group in ENDPOINT_GROUPS" :key="group" :value="group">{{ group }}</option>
                  </select>
                </div>
              </div>

              <div class="mt-6 flex flex-wrap items-center gap-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Permissions</span>
                <span
                  v-for="permission in PERMISSIONS"
                  :key="permission.key"
                  class="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-brand-900/60 dark:text-slate-300"
                  :title="permission.label"
                >
                  {{ permission.key }}
                </span>
              </div>
            </div>

            <div class="space-y-4">
              <EndpointSection
                v-for="endpoint in endpointSections"
                :id="endpoint.id"
                :key="endpoint.id"
                :section="endpoint"
                data-doc-section
              />
            </div>

            <p
              v-if="endpointSections.length === 0"
              class="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-brand-900/40 dark:text-slate-400"
            >
              No endpoints match the current filters.
            </p>
          </section>
        </div>
      </div>

      <footer class="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-brand-950">
        <div class="mx-auto flex max-w-[1680px] flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8 dark:text-slate-400">
          <p>WESSAAL Developer Documentation — Linked Devices API</p>
          <p class="font-mono">GET · POST · PUT · DELETE</p>
        </div>
      </footer>
    </main>
  </div>
</template>
