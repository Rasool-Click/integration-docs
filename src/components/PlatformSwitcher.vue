<script setup>
import { storeToRefs } from 'pinia'
import AppIcon from './AppIcon.vue'
import { usePlatformStore } from '../stores/platform'

const platformStore = usePlatformStore()
const { selectedPlatform, platformOptions } = storeToRefs(platformStore)
const { setPlatform } = platformStore

const platformMeta = {
  linked: {
    icon: 'smartphone',
    accent: 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950',
    idle: 'text-emerald-700 dark:text-emerald-300',
  },
  official: {
    icon: 'cloud',
    accent: 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950',
    idle: 'text-amber-700 dark:text-amber-300',
  },
}
</script>

<template>
  <div class="inline-flex items-center rounded-lg border border-slate-300 bg-white/90 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900/80" role="tablist" aria-label="Platform switcher">
    <button
      v-for="item in platformOptions"
      :key="item.id"
      type="button"
      role="tab"
      :aria-selected="selectedPlatform === item.id"
      :aria-disabled="item.availability !== 'available'"
      :disabled="item.availability !== 'available'"
      class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-black uppercase tracking-wide transition sm:text-sm"
      :class="
        item.availability !== 'available'
          ? 'cursor-not-allowed bg-slate-100 text-slate-400 opacity-75 dark:bg-slate-800 dark:text-slate-500'
          : selectedPlatform === item.id
          ? `${platformMeta[item.id].accent} shadow-sm`
          : `bg-transparent ${platformMeta[item.id].idle} hover:bg-slate-100 dark:hover:bg-slate-800`
      "
      :title="item.availability === 'available' ? item.label : `${item.label} coming soon`"
      @click="setPlatform(item.id)"
    >
      <AppIcon :name="platformMeta[item.id].icon" class="h-4 w-4" />
      <span class="hidden md:inline">{{ item.label }}</span>
      <span v-if="item.availability !== 'available'" class="hidden rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700 md:inline dark:bg-amber-950 dark:text-amber-200">
        Soon
      </span>
    </button>
  </div>
</template>
