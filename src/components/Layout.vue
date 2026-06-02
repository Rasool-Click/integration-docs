<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import PlatformSwitcher from './PlatformSwitcher.vue'
import SidebarNav from './SidebarNav.vue'
import EndpointSection from './EndpointSection.vue'
import AppIcon from './AppIcon.vue'
import { DOC_SECTIONS, ENDPOINT_GROUPS, ENDPOINTS, NAV_ITEMS, PERMISSIONS } from '../data/docs'
import { usePlatformStore } from '../stores/platform'
import logoUrl from '../assets/wessaal-logo.svg'

const platformStore = usePlatformStore()
const { selectedPlatform, platformConfig } = storeToRefs(platformStore)

const isDark = ref(false)
const activeSection = ref('overview')
const observer = ref(null)
const search = ref('')
const selectedGroup = ref('All')

const endpointSections = computed(() => {
  const query = search.value.trim().toLowerCase()

  return ENDPOINTS.filter((endpoint) => {
    const platformMatches = (endpoint.platform || 'linked') === selectedPlatform.value
    const groupMatches = selectedGroup.value === 'All' || endpoint.group === selectedGroup.value
    const searchable = `${endpoint.title} ${endpoint.description} ${endpoint.method} ${endpoint.path} ${endpoint.permission} ${endpoint.group}`.toLowerCase()
    return platformMatches && groupMatches && (!query || searchable.includes(query))
  })
})

const quickHighlights = computed(() => [
  {
    id: 'base',
    label: 'Base URL',
    value: platformConfig.value.baseUrl || 'Pending backend contract',
    icon: 'server',
    mono: Boolean(platformConfig.value.baseUrl),
  },
  {
    id: 'auth',
    label: 'Authentication',
    value: platformConfig.value.authHeader,
    icon: 'lock',
    mono: selectedPlatform.value === 'linked',
  },
  {
    id: 'status',
    label: 'Platform Status',
    value: platformConfig.value.status,
    icon: selectedPlatform.value === 'linked' ? 'activity' : 'clock',
    mono: false,
  },
])

function setTheme(nextDark) {
  isDark.value = nextDark
  document.documentElement.classList.toggle('dark', nextDark)
  localStorage.setItem('wessaal-docs-theme', nextDark ? 'dark' : 'light')
}

function initTheme() {
  const saved = localStorage.getItem('wessaal-docs-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  setTheme(saved ? saved === 'dark' : prefersDark)
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
  setupScrollSpy()
})

onBeforeUnmount(() => {
  observer.value?.disconnect()
})

watch([selectedPlatform, endpointSections], () => {
  window.requestAnimationFrame(() => {
    observer.value?.disconnect()
    setupScrollSpy()
  })
})
</script>

<template>
  <div class="min-h-screen bg-[#f6f8f4] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f6f8f4]/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div class="mx-auto max-w-[1680px] px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <a href="#overview" class="flex min-w-0 items-center gap-3" aria-label="Wessaal Developer Documentation">
            <img :src="logoUrl" alt="Wessaal" class="h-10 w-auto shrink-0" />
            <span class="hidden h-7 w-px bg-slate-300 dark:bg-slate-700 sm:block" />
            <span class="hidden sm:block">
              <span class="block text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Developer Docs</span>
              <span class="block text-sm font-black text-slate-950 dark:text-white">Integration APIs</span>
            </span>
          </a>

          <div class="flex items-center gap-2">
            <a
              href="#endpoints"
              class="hidden items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-black text-slate-800 shadow-sm hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:inline-flex"
            >
              <AppIcon name="search" class="h-4 w-4" />
              Browse endpoints
            </a>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-black text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              @click="setTheme(!isDark)"
            >
              <AppIcon :name="isDark ? 'sun' : 'moon'" class="h-4 w-4" />
              {{ isDark ? 'Light' : 'Dark' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div class="mx-auto grid max-w-[1680px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_560px] lg:px-8 lg:py-10">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800">
                Linked Devices live
              </span>
              <span class="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-800">
                Official live
              </span>
            </div>
            <h1 class="mt-5 max-w-5xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Production documentation for Wessaal integration developers.
            </h1>
            <p class="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Real Linked Devices and Official API documentation generated from the current Laravel route contracts, with each platform kept separate for developers.
            </p>

            <div class="mt-6 grid gap-3 sm:grid-cols-3">
              <article
                v-for="highlight in quickHighlights"
                :key="highlight.id"
                class="rounded-xl border border-slate-200 bg-[#f6f8f4] p-4 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <p class="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <AppIcon :name="highlight.icon" class="h-4 w-4" />
                  {{ highlight.label }}
                </p>
                <p
                  class="mt-2 text-sm font-black text-slate-950 dark:text-white"
                  :class="highlight.mono ? 'break-all font-mono text-[12px]' : ''"
                >
                  {{ highlight.value }}
                </p>
              </article>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-[#f6f8f4] p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p class="mb-3 flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
              <AppIcon name="workflow" class="h-4 w-4" />
              Select platform
            </p>
            <PlatformSwitcher />
          </div>
        </div>
      </section>

      <div class="mx-auto grid max-w-[1680px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div class="hidden lg:col-span-3 lg:block">
          <SidebarNav :items="NAV_ITEMS" :active-section="activeSection" />
        </div>

        <div class="space-y-6 lg:col-span-9">
          <section
            v-for="section in DOC_SECTIONS"
            :id="section.id"
            :key="section.id"
            data-doc-section
            class="scroll-mt-28 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80 sm:p-6"
          >
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                  <AppIcon :name="section.icon || 'book'" class="h-4 w-4" />
                  {{ section.eyebrow || 'Documentation' }}
                </p>
                <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{{ section.title }}</h2>
              </div>
            </div>
            <p class="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">{{ section.summary }}</p>

            <div v-if="section.cards" class="mt-5 grid gap-3 sm:grid-cols-3">
              <article
                v-for="card in section.cards"
                :key="card.label"
                class="rounded-lg border border-slate-200 bg-[#f6f8f4] p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <p class="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <AppIcon :name="card.icon" class="h-4 w-4" />
                  {{ card.label }}
                </p>
                <p class="mt-2 font-mono text-sm font-black text-slate-950 dark:text-white">{{ card.value }}</p>
              </article>
            </div>

            <pre v-if="section.code" class="mt-5 overflow-auto rounded-lg bg-slate-950 p-4 text-[13px] leading-6 text-slate-100"><code class="font-mono">{{ section.code }}</code></pre>

            <ol v-if="section.steps" class="mt-5 grid gap-3 md:grid-cols-5">
              <li
                v-for="(step, index) in section.steps"
                :key="step.title"
                class="rounded-lg border border-slate-200 bg-[#f6f8f4] p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <span class="grid h-7 w-7 place-items-center rounded-md bg-slate-950 text-xs font-black text-white dark:bg-white dark:text-slate-950">{{ index + 1 }}</span>
                <h3 class="mt-3 text-sm font-black text-slate-950 dark:text-white">{{ step.title }}</h3>
                <p class="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{{ step.text }}</p>
              </li>
            </ol>

            <ul v-if="section.bullets" class="mt-5 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <li v-for="item in section.bullets" :key="item" class="flex items-start gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-900/80">
                <AppIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </section>

          <section id="endpoints" data-doc-section class="scroll-mt-28 space-y-4">
            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80 sm:p-6">
              <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p class="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                    <AppIcon name="terminal" class="h-4 w-4" />
                    Endpoint reference
                  </p>
                  <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{{ platformConfig.shortLabel }} endpoints</h2>
                  <p class="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    These are the live routes for the selected platform. Permission names match the API key middleware scopes.
                  </p>
                </div>
                <div class="grid gap-2 sm:grid-cols-[minmax(0,280px)_190px]">
                  <label class="relative block">
                    <AppIcon name="search" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      v-model="search"
                      type="search"
                      placeholder="Search endpoints"
                      class="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm font-bold outline-none ring-0 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </label>
                  <select
                    v-model="selectedGroup"
                    class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option v-for="group in ENDPOINT_GROUPS" :key="group" :value="group">{{ group }}</option>
                  </select>
                </div>
              </div>

              <div class="mt-5 grid gap-2 md:grid-cols-3">
                <article
                  v-for="permission in PERMISSIONS"
                  :key="permission.key"
                  class="rounded-lg border border-slate-200 bg-[#f6f8f4] p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <p class="font-mono text-xs font-black text-slate-950 dark:text-white">{{ permission.key }}</p>
                  <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{{ permission.label }}</p>
                </article>
              </div>
            </div>

            <EndpointSection
              v-for="endpoint in endpointSections"
              :id="endpoint.id"
              :key="endpoint.id"
              :section="endpoint"
              data-doc-section
            />

            <p
              v-if="endpointSections.length === 0"
              class="rounded-xl border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
            >
              No endpoints match the current filters.
            </p>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
