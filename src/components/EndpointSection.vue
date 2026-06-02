<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppIcon from './AppIcon.vue'
import { usePlatformStore } from '../stores/platform'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const platformStore = usePlatformStore()
const { selectedPlatform, platformConfig } = storeToRefs(platformStore)

const languages = ['curl', 'node', 'php']
const activeLanguage = ref('curl')
const copied = ref(false)

const methodClasses = {
  GET: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:ring-sky-800',
  POST: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800',
  PUT: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-800',
  DELETE: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:ring-rose-800',
}

const endpointPlatform = computed(() => props.section.platform || 'linked')
const endpointAvailable = computed(() => selectedPlatform.value === endpointPlatform.value)
const endpointUrl = computed(() => {
  if (!endpointAvailable.value) return `${props.section.platformLabel || 'Other platform'} endpoint`
  if (!platformConfig.value.baseUrl) return 'Endpoint contract pending'
  return `${platformConfig.value.baseUrl}${props.section.path}`
})

const requestBody = computed(() => props.section.bodyExample || null)
const responseBody = computed(() => props.section.responseExample || {
  success: true,
  data: {},
})

const formattedBody = computed(() => (requestBody.value ? JSON.stringify(requestBody.value, null, 2) : null))
const formattedResponse = computed(() => JSON.stringify(responseBody.value, null, 2))

function toPhpValue(value, depth = 0) {
  const pad = '    '.repeat(depth)
  const nextPad = '    '.repeat(depth + 1)

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `[\n${value.map((item) => `${nextPad}${toPhpValue(item, depth + 1)}`).join(',\n')}\n${pad}]`
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
    if (entries.length === 0) return '[]'
    return `[\n${entries.map(([key, item]) => `${nextPad}'${key}' => ${toPhpValue(item, depth + 1)}`).join(',\n')}\n${pad}]`
  }

  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (value === null) return 'null'
  return String(value)
}

function generateSnippet(language) {
  if (!endpointAvailable.value) {
    return `Select the ${props.section.platformLabel || endpointPlatform.value} platform to use this endpoint.`
  }

  const url = endpointUrl.value
  const body = formattedBody.value

  if (language === 'curl') {
    const lines = [`curl -X ${props.section.method} "${url}" \\`, '  -H "X-API-Key: sk_live_your_key"']
    if (body) {
      lines.push('  -H "Content-Type: application/json" \\')
      lines.push(`  -d '${body}'`)
    }
    return lines.join('\n')
  }

  if (language === 'node') {
    const options = [
      `method: '${props.section.method}',`,
      `headers: {${body ? "\n    'Content-Type': 'application/json',\n    " : ' '}'X-API-Key': process.env.WESSAAL_API_KEY${body ? ',\n  ' : ' '}},`,
    ]
    if (body) options.push(`body: JSON.stringify(${body.replace(/\n/g, '\n  ')}),`)

    return `const response = await fetch('${url}', {
  ${options.join('\n  ')}
});

const payload = await response.json();`
  }

  const phpBody = requestBody.value ? toPhpValue(requestBody.value, 2) : null

  return `$response = Http::withHeaders([
    'X-API-Key' => env('WESSAAL_API_KEY'),
])${body ? `->asJson()` : ''}
    ->${props.section.method.toLowerCase()}('${url}'${phpBody ? `, ${phpBody}` : ''});

$payload = $response->json();`
}

const activeSnippet = computed(() => generateSnippet(activeLanguage.value))

async function copyText(value) {
  if (!value) return false
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    await navigator.clipboard.writeText(value)
    return true
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  textarea.remove()
  return ok
}

async function copySnippet() {
  if (await copyText(activeSnippet.value)) {
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1200)
  }
}
</script>

<template>
  <section :id="section.id" class="scroll-mt-28 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
    <div class="grid gap-0 xl:grid-cols-[minmax(0,1fr)_520px]">
      <div class="p-5 sm:p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-md px-2.5 py-1 font-mono text-xs font-black ring-1"
                :class="methodClasses[section.method] || 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700'"
              >
                {{ section.method }}
              </span>
              <span class="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-black text-slate-600 dark:border-slate-700 dark:text-slate-300">
                {{ section.group }}
              </span>
              <span class="rounded-md border border-slate-200 px-2.5 py-1 font-mono text-xs font-bold text-slate-500 dark:border-slate-700 dark:text-slate-400">
                {{ section.permission }}
              </span>
            </div>
            <h3 class="mt-4 text-xl font-black tracking-tight text-slate-950 dark:text-white">{{ section.title }}</h3>
          </div>
          <span class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            {{ section.responseStatus }}
          </span>
        </div>

        <p class="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{{ section.description }}</p>

        <div
          v-if="!endpointAvailable"
          class="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
        >
          <div class="flex items-start gap-3">
            <AppIcon name="clock" class="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              This endpoint belongs to the {{ section.platformLabel || 'other' }} platform. Switch platforms to view the matching production URL and copy-ready snippets.
            </p>
          </div>
        </div>

        <div class="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
          <p class="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <AppIcon name="server" class="h-4 w-4" />
            Endpoint
          </p>
          <p class="mt-2 break-all font-mono text-sm font-bold text-slate-950 dark:text-white">{{ endpointUrl }}</p>
        </div>

        <div v-if="section.parameters?.length" class="mt-5 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th class="px-4 py-3 font-black">Parameter</th>
                <th class="px-4 py-3 font-black">Type</th>
                <th class="px-4 py-3 font-black">Required</th>
                <th class="px-4 py-3 font-black">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
              <tr v-for="param in section.parameters" :key="param.name">
                <td class="px-4 py-3 font-mono text-xs font-bold text-slate-950 dark:text-white">{{ param.name }}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ param.type }}</td>
                <td class="px-4 py-3">
                  <span
                    class="rounded-md px-2 py-1 text-xs font-black"
                    :class="
                      param.required === true || typeof param.required === 'string'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300'
                    "
                  >
                    {{ param.required === true ? 'Yes' : param.required || 'No' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ param.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="border-t border-slate-200 bg-slate-950 xl:border-l xl:border-t-0 dark:border-slate-800">
        <div class="sticky top-24">
          <div class="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <div class="flex items-center gap-1">
              <button
                v-for="lang in languages"
                :key="lang"
                type="button"
                class="rounded-md px-2.5 py-1 text-xs font-black capitalize transition"
                :class="activeLanguage === lang ? 'bg-white text-slate-950' : 'text-slate-400 hover:bg-white/10 hover:text-white'"
                @click="activeLanguage = lang"
              >
                {{ lang }}
              </button>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs font-black text-white hover:bg-white/10"
              @click="copySnippet"
            >
              <AppIcon :name="copied ? 'check' : 'copy'" class="h-3.5 w-3.5" />
              {{ copied ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="max-h-[420px] overflow-auto p-4 text-[12px] leading-5 text-slate-100"><code class="font-mono">{{ activeSnippet }}</code></pre>
          <div class="border-t border-white/10 p-4">
            <p class="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">Example response</p>
            <pre class="max-h-[260px] overflow-auto rounded-lg bg-black/30 p-3 text-[12px] leading-5 text-slate-200"><code class="font-mono">{{ formattedResponse }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
