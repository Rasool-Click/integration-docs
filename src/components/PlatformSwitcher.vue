<script setup>
import { storeToRefs } from 'pinia'
import AppIcon from './AppIcon.vue'
import { usePlatformStore } from '../stores/platform'

const platformStore = usePlatformStore()
const { selectedPlatform, platformOptions } = storeToRefs(platformStore)

const platformMeta = {
  linked: {
    icon: 'smartphone',
    accent: 'border-emerald-300 bg-emerald-50 text-emerald-900 ring-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-100 dark:ring-emerald-900',
    status: 'bg-emerald-600 text-white',
  },
  official: {
    icon: 'cloud',
    accent: 'border-sky-300 bg-sky-50 text-sky-950 ring-sky-100 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-100 dark:ring-sky-900',
    status: 'bg-sky-600 text-white',
  },
}
</script>

<template>
  <div class="grid gap-3 md:grid-cols-2">
    <button
      v-for="item in platformOptions"
      :key="item.id"
      type="button"
      class="group rounded-xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      :class="
        selectedPlatform === item.id
          ? `${platformMeta[item.id].accent} shadow-sm ring-4`
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300 dark:hover:border-slate-700'
      "
      @click="selectedPlatform = item.id"
    >
      <span class="flex items-start justify-between gap-3">
        <span class="flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-lg bg-white shadow-sm dark:bg-slate-900">
            <AppIcon :name="platformMeta[item.id].icon" class="h-5 w-5" />
          </span>
          <span>
            <span class="block text-sm font-extrabold">{{ item.label }}</span>
            <span class="mt-0.5 block text-xs leading-5 opacity-75">{{ item.description }}</span>
          </span>
        </span>
        <span class="rounded-md px-2 py-1 text-[11px] font-black uppercase tracking-wide" :class="platformMeta[item.id].status">
          {{ item.status }}
        </span>
      </span>
    </button>
  </div>
</template>
