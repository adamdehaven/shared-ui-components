// This will need to be extended as properties are added
export interface KongUiConfig {
  env: 'local' | 'development' | 'production' | string
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
