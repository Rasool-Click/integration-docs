<script setup>
import { computed, ref } from 'vue'
import { Check, Copy, ExternalLink, Info } from '@lucide/vue'

const props = defineProps({ section: { type: Object, required: true } })
const BASE_URL = 'https://app.wessaal.com/integration/v1'
const activeLanguage = ref('curl')
const copied = ref(false)
const languages = ['curl', 'JavaScript', 'PHP']
const fullUrl = computed(() => BASE_URL + props.section.path)
const hasResponse = computed(() => props.section.responseExample !== undefined && props.section.responseExample !== null)
const responsePreview = computed(() => hasResponse.value ? JSON.stringify(props.section.responseExample, null, 2) : '')
const prettyBody = computed(() => props.section.bodyExample ? JSON.stringify(props.section.bodyExample, null, 2) : null)
const methodClass = computed(() => ({
  GET: 'method-get',
  POST: 'method-post',
  PUT: 'method-put',
  PATCH: 'method-put',
  DELETE: 'method-delete',
}[props.section.method] || 'method-get'))

function phpLiteral(value, level = 0) {
  const pad = '  '.repeat(level)
  const inner = '  '.repeat(level + 1)
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    return '[\n' + value.map(v => inner + phpLiteral(v, level + 1)).join(',\n') + '\n' + pad + ']'
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
    if (!entries.length) return '[]'
    return '[\n' + entries.map(([key, v]) => inner + "'" + key + "' => " + phpLiteral(v, level + 1)).join(',\n') + '\n' + pad + ']'
  }
  if (typeof value === 'string') return "'" + value.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"
  if (value === null) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

const snippet = computed(() => {
  const url = fullUrl.value
  const method = props.section.method
  const body = prettyBody.value
  if (activeLanguage.value === 'curl') {
    const lines = [
      'curl --request ' + method + ' \\',
      "  --url '" + url + "' \\",
      "  --header 'X-API-Key: YOUR_API_KEY'" + (body ? ' \\' : ''),
    ]
    if (body) {
      lines.push("  --header 'Content-Type: application/json' \\")
      lines.push("  --data '" + body + "'")
    }
    return lines.join('\n')
  }
  if (activeLanguage.value === 'JavaScript') {
    const fields = [
      "method: '" + method + "',",
      "headers: {\n    'X-API-Key': process.env.WESSAAL_API_KEY," + (body ? "\n    'Content-Type': 'application/json'," : '') + '\n  },',
    ]
    if (body) fields.push('body: JSON.stringify(' + body.replace(/\n/g, '\n  ') + '),')
    return "const response = await fetch('" + url + "', {\n  " + fields.join('\n  ') + '\n});\n\nconst data = await response.json();'
  }
  const phpBody = props.section.bodyExample ? ', ' + phpLiteral(props.section.bodyExample, 1) : ''
  return "use Illuminate\\Support\\Facades\\Http;\n\n$response = Http::withHeaders([\n  'X-API-Key' => env('WESSAAL_API_KEY'),\n])\n  ->" + method.toLowerCase() + "('" + url + "'" + phpBody + ');\n\n$data = $response->json();'
})

async function copySnippet() {
  try {
    await navigator.clipboard.writeText(snippet.value)
    copied.value = true
    window.setTimeout(() => { copied.value = false }, 1500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="reference-layout">
    <article class="reference-main">
      <nav class="docs-breadcrumb" aria-label="Breadcrumb">
        <span>API Reference</span><span class="breadcrumb-slash">/</span><span>{{ section.group }}</span>
      </nav>
      <h1 class="reference-title">{{ section.title }}</h1>
      <p class="reference-intro">{{ section.description }}</p>
      <div class="endpoint-path">
        <span class="http-method" :class="methodClass">{{ section.method }}</span>
        <code>{{ section.path }}</code>
      </div>
      <div class="reference-block">
        <h2>Authentication</h2>
        <p>Include your API key in the <code>X-API-Key</code> request header. The key needs the following permission:</p>
        <div class="permission-code">{{ section.permission || 'Valid API key' }}</div>
      </div>
      <div v-if="section.parameters?.length" class="reference-block">
        <h2>Parameters</h2>
        <div class="parameter-list">
          <div v-for="param in section.parameters" :key="param.name" class="parameter-row">
            <div class="parameter-heading">
              <code class="parameter-name">{{ param.name }}</code>
              <code class="parameter-type">{{ param.type }}</code>
              <span v-if="param.required" class="parameter-required">{{ param.required === true ? 'Required' : 'Required ' + param.required }}</span>
              <span v-else class="parameter-optional">Optional</span>
            </div>
            <p>{{ param.description }}</p>
          </div>
        </div>
      </div>
      <div v-if="section.bodyExample" class="reference-block">
        <h2>Request body</h2>
        <p>Example JSON body for this operation. Replace values with your own data.</p>
        <pre class="inline-code"><code>{{ prettyBody }}</code></pre>
      </div>
      <div class="reference-block">
        <h2>Response</h2>
        <div class="response-status"><span class="response-dot" /> {{ section.responseStatus || 'Status varies by result' }}</div>
        <p v-if="hasResponse">The response shown is an illustration, not a live API result.</p>
        <p v-else>A response example has not been specified in the existing reference for this operation.</p>
      </div>
      <p class="reference-help"><Info :size="16" /> Examples use placeholder credentials. Never expose API keys in client-side code.</p>
    </article>

    <aside class="reference-code-panel" aria-label="Code examples">
      <div class="reference-code-sticky">
        <div class="code-panel-heading"><span>EXAMPLE REQUEST</span><span class="code-panel-file">HTTP</span></div>
        <div class="code-language-row">
          <div role="tablist" aria-label="Code language" class="code-language-tabs">
            <button v-for="language in languages" :key="language" type="button" role="tab"
              :aria-selected="activeLanguage === language"
              :class="['code-language-tab', { 'is-selected': activeLanguage === language }]"
              @click="activeLanguage = language">{{ language }}</button>
          </div>
          <button class="code-copy" type="button" @click="copySnippet" :aria-label="copied ? 'Copied snippet' : 'Copy code snippet'">
            <Check v-if="copied" :size="14" /><Copy v-else :size="14" /> {{ copied ? 'Copied' : 'Copy' }}
          </button>
        </div>
        <pre class="request-snippet"><code>{{ snippet }}</code></pre>
        <div class="code-response-section">
          <div class="code-panel-heading"><span>EXAMPLE RESPONSE</span><span class="code-panel-file">{{ section.responseStatus || 'JSON' }}</span></div>
          <pre v-if="hasResponse" class="response-snippet"><code>{{ responsePreview }}</code></pre>
          <p v-else class="response-missing">Response example not documented.</p>
        </div>
        <p class="code-note">Manage API keys from <a href="https://dashboard.wessaal.com/" target="_blank" rel="noopener noreferrer">WESSAAL Dashboard <ExternalLink :size="12" /></a>.</p>
      </div>
    </aside>
  </div>
</template>
