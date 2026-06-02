<script setup>
import { computed } from 'vue'
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Bell,
  BookOpenText,
  Boxes,
  Building2,
  Check,
  ChevronRight,
  Clock,
  Cloud,
  Copy,
  Database,
  ExternalLink,
  FileText,
  Globe2,
  KeyRound,
  Link2,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  Moon,
  Search,
  Send,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Terminal,
  Users,
  Webhook,
  Workflow,
  XCircle,
} from '@lucide/vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: 'h-4 w-4',
  },
})

const icons = {
  activity: Activity,
  alert: AlertTriangle,
  badge: BadgeCheck,
  bell: Bell,
  book: BookOpenText,
  boxes: Boxes,
  building: Building2,
  check: Check,
  chevron: ChevronRight,
  clock: Clock,
  cloud: Cloud,
  copy: Copy,
  database: Database,
  external: ExternalLink,
  file: FileText,
  globe: Globe2,
  key: KeyRound,
  link: Link2,
  list: ListChecks,
  lock: LockKeyhole,
  message: MessageSquareText,
  moon: Moon,
  search: Search,
  send: Send,
  server: Server,
  shield: ShieldCheck,
  smartphone: Smartphone,
  spark: Sparkles,
  sun: Sun,
  terminal: Terminal,
  users: Users,
  webhook: Webhook,
  workflow: Workflow,
  x: XCircle,
  warning: AlertTriangle,
}

const icon = computed(() => icons[props.name] || BookOpenText)
</script>

<template>
  <component :is="icon" :class="props.class" :stroke-width="1.9" aria-hidden="true" />
</template>
