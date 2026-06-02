import { watchEffect, onBeforeUnmount } from 'vue'

export function useJsonLd(activeSection, endpointSections) {
  watchEffect(() => {
    // Remove existing script if it exists
    let script = document.getElementById('json-ld-schema')

    // Find if the active section corresponds to an endpoint
    const endpoint = endpointSections.value.find(e => e.id === activeSection.value)

    if (endpoint) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'APIReference',
        name: endpoint.title,
        description: endpoint.description,
        httpMethod: endpoint.method,
        target: {
          '@type': 'EntryPoint',
          urlTemplate: endpoint.path,
        },
        category: endpoint.platformLabel || 'Linked Devices',
      }

      if (!script) {
        script = document.createElement('script')
        script.id = 'json-ld-schema'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }

      script.textContent = JSON.stringify(schema, null, 2)
    } else {
      if (script) {
        script.remove()
      }
    }
  })

  onBeforeUnmount(() => {
    const script = document.getElementById('json-ld-schema')
    if (script) {
      script.remove()
    }
  })
}
