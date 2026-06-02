<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  activeSection: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <aside class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white/92 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/82">
    <p class="px-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
      Docs
    </p>
    <nav class="mt-3 space-y-1" aria-label="Documentation sections">
      <a
        v-for="item in items"
        :key="item.id"
        :href="`#${item.id}`"
        class="group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-bold transition"
        :class="
          activeSection === item.id
            ? 'bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
        "
      >
        <span class="flex min-w-0 items-center gap-2">
          <AppIcon :name="item.icon || 'book'" class="h-4 w-4 shrink-0" />
          <span class="truncate">{{ item.label }}</span>
        </span>
        <AppIcon name="chevron" class="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-60" />
      </a>
    </nav>
  </aside>
</template>
