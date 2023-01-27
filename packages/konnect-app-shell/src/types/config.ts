// This will need to be extended as properties are added
export interface KongUiConfig {
  env: 'local' | 'development' | 'production' | string
  api: {
    v1: {
      kauth: string
      [api: string]: any
    }
    v2: {
      global: string
      [api: string]: any
    }
    [version: string]: {
      [api: string]: string
    }
  }
  launchDarkly: {
    key: string
    platform_id: string
  }
}
