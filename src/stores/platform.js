import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const PLATFORM_CONFIG = {
  linked: {
    id: 'linked',
    label: 'Linked Devices API',
    shortLabel: 'Linked Devices',
    status: 'Live',
    description: 'Production API for workspaces that send through connected WhatsApp devices.',
    baseUrl: 'https://app.wessaal.com/integration/v1',
    authLabel: 'API key',
    authHeader: 'X-API-Key',
    authExample: 'X-API-Key: sk_live_your_key',
    availability: 'available',
  },
  official: {
    id: 'official',
    label: 'Official API',
    shortLabel: 'Official',
    status: 'Live',
    description: 'Production API for tenants sending through Wessaal Official WhatsApp Cloud accounts.',
    baseUrl: 'https://official.wessaal.com/api/official/v1',
    authLabel: 'API key',
    authHeader: 'X-API-Key',
    authExample: 'X-API-Key: apitk_your_key',
    availability: 'available',
  },
}

export const usePlatformStore = defineStore('platform', () => {
  const selectedPlatform = ref('linked')

  const platformOptions = computed(() => Object.values(PLATFORM_CONFIG))
  const platformConfig = computed(() => PLATFORM_CONFIG[selectedPlatform.value])
  function setPlatform(platformId) {
    if (PLATFORM_CONFIG[platformId]) {
      selectedPlatform.value = platformId
    }
  }

  return {
    selectedPlatform,
    platformOptions,
    platformConfig,
    setPlatform,
  }
})
