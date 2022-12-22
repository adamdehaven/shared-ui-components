import { Ref } from 'vue'

// This will need to be extended as properties are added
export interface KongUiConfig {
  env: string
  api: {
    v1: {
      kauth: string
      [api: string]: any
    },
    v2: {
      global: string
      [api: string]: any
    }
  }
}

export interface AppShellConfig {
  config: Ref<KongUiConfig | undefined>
  loading: Ref<boolean>
  error: Ref<boolean>
}
