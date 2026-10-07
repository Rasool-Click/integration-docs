<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  groups: {
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
  <aside class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
    <nav class="space-y-6" aria-label="Documentation sections">
      <div v-for="group in groups" :key="group.label">
        <p class="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {{ group.label }}
        </p>
        <div class="mt-2.5 space-y-1 border-l border-slate-200 dark:border-slate-800">
          <a
            v-for="item in group.items"
            :key="item.id"
            :href="`#${item.id}`"
            class="relative flex items-center justify-between border-l-2 py-2 pl-4 text-[15px] transition -ml-px"
            :class="
              activeSection === item.id
                ? 'border-brand-500 bg-brand-100/70 font-semibold text-brand-700 dark:border-brand-300 dark:bg-brand-500/15 dark:text-brand-300'
                : 'border-transparent font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
            "
          >
            <span class="flex min-w-0 items-center gap-2.5">
              <AppIcon :name="item.icon || 'book'" class="h-[18px] w-[18px] shrink-0" />
              <span class="truncate">{{ item.label }}</span>
            </span>
          </a>
        </div>
      </div>
    </nav>
  </aside>
</template>
