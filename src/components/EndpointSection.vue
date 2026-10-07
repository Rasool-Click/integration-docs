<script setup>
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const BASE_URL = 'https://app.wessaal.com/integration/v1'

const languages = ['curl', 'node', 'php']
const activeLanguage = ref('curl')
const copied = ref(false)
const showResponse = ref(false)

const methodClasses = {
  GET: 'bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-500/30',
  POST: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-500/30',
  PUT: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30',
  DELETE: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-100 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30',
}

const endpointUrl = computed(() => `${BASE_URL}${props.section.path}`)

const requestBody = computed(() => props.section.bodyExample || null)
const responseBody = computed(() => props.section.responseExample || {
  success: true,
  data: {},
})

const formattedBody = computed(() => (requestBody.value ? JSON.stringify(requestBody.value, null, 2) : null))
const formattedResponse = computed(() => JSON.stringify(responseBody.value, null, 2))

function requiredLabel(param) {
  if (param.required === true) return 'Yes'
  return param.required || 'No'
}

function requiredClasses(param) {
  return param.required === true || typeof param.required === 'string'
    ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
}

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
  <section
    :id="section.id"
    class="scroll-mt-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:scroll-mt-28 dark:border-slate-800 dark:bg-brand-900/60"
  >
    <div class="p-5 sm:p-6">
      <!-- Header: badges + title + status -->
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="rounded-md px-2.5 py-1 font-mono text-xs font-semibold"
              :class="methodClasses[section.method] || 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'"
            >
              {{ section.method }}
            </span>
            <span class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {{ section.group }}
            </span>
            <span class="rounded-md font-mono text-xs text-slate-400 dark:text-slate-500">
              {{ section.permission }}
            </span>
          </div>
          <h3 class="mt-4 break-words text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">{{ section.title }}</h3>
        </div>
        <span class="rounded-md bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
          {{ section.responseStatus }}
        </span>
      </div>

      <!-- Description -->
      <p class="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">{{ section.description }}</p>

      <!-- Operational notes -->
      <ul v-if="section.notes?.length" class="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
        <li v-for="note in section.notes" :key="note">{{ note }}</li>
      </ul>

      <!-- Endpoint URL -->
      <div class="mt-5">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <span class="flex items-center gap-2">
            <AppIcon name="server" class="h-4 w-4" />
            Endpoint
          </span>
        </p>
        <code class="mt-2 block rounded-lg bg-slate-50 px-4 py-3 font-mono text-[13px] font-medium text-slate-900 ring-1 ring-inset ring-slate-200 dark:bg-brand-950/60 dark:text-white dark:ring-slate-800 break-words">{{ endpointUrl }}</code>
      </div>

      <!-- Parameters table -->
      <div v-if="section.parameters?.length" class="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <p class="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-brand-950/60 dark:text-slate-400">
          Parameters
        </p>
        <!-- Mobile: stacked parameter records -->
        <div class="divide-y divide-slate-100 sm:hidden dark:divide-slate-800">
          <div v-for="param in section.parameters" :key="param.name" class="px-4 py-3">
            <div class="flex flex-wrap items-center gap-1.5">
              <code class="font-mono text-xs font-semibold text-slate-900 dark:text-white">{{ param.name }}</code>
              <code class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">{{ param.type }}</code>
              <span
                class="ml-auto whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium"
                :class="requiredClasses(param)"
              >
                {{ requiredLabel(param) }}
              </span>
            </div>
            <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ param.description }}</p>
          </div>
        </div>
        <!-- sm and up: full parameter table (horizontally scrollable) -->
        <div class="hidden overflow-x-auto sm:block">
          <table class="min-w-[720px] text-left text-[15px]">
            <thead class="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
              <tr>
                <th class="px-4 py-2.5 font-semibold">Parameter</th>
                <th class="px-4 py-2.5 font-semibold">Type</th>
                <th class="px-4 py-2.5 font-semibold">Required</th>
                <th class="px-4 py-2.5 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="param in section.parameters" :key="param.name" class="align-top">
                <td class="px-4 py-3 font-mono text-xs font-medium text-slate-900 dark:text-white">{{ param.name }}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                  <code class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">{{ param.type }}</code>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium"
                    :class="requiredClasses(param)"
                  >
                    {{ requiredLabel(param) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ param.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Code example: full width, below endpoint content -->
      <div class="mt-6 overflow-hidden rounded-xl border border-brand-500/20 bg-[#111128]">
        <!-- Language tabs + copy -->
        <div class="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <div class="flex items-center gap-1" role="tablist" aria-label="Request example language">
            <button
              v-for="lang in languages"
              :key="lang"
              type="button"
              role="tab"
              :aria-selected="activeLanguage === lang"
              class="rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition"
              :class="activeLanguage === lang ? 'bg-white/10 text-white ring-1 ring-inset ring-white/20' : 'text-slate-400 hover:bg-white/10 hover:text-white'"
              @click="activeLanguage = lang"
            >
              {{ lang }}
            </button>
          </div>
          <button
            type="button"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-white/10"
            @click="copySnippet"
          >
            <AppIcon :name="copied ? 'check' : 'copy'" class="h-3.5 w-3.5" />
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
        </div>

        <!-- Request snippet -->
        <pre class="max-h-[240px] overflow-auto p-4 text-xs leading-6 text-slate-100"><code class="font-mono">{{ activeSnippet }}</code></pre>

        <!-- Example response toggle -->
        <div class="border-t border-white/10">
          <button
            type="button"
            class="flex w-full items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:text-white"
            @click="showResponse = !showResponse"
          >
            <span>Example response</span>
            <AppIcon
              name="chevron"
              class="h-3.5 w-3.5 transition-transform duration-200"
              :class="showResponse ? 'rotate-90' : ''"
            />
          </button>
        </div>

        <!-- Response body (hidden by default) -->
        <div v-if="showResponse" class="border-t border-white/10">
          <pre class="max-h-[220px] overflow-auto p-4 text-xs leading-6 text-slate-200"><code class="font-mono">{{ formattedResponse }}</code></pre>
        </div>
      </div>
    </div>
  </section>
</template>
