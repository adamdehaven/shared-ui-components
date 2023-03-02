/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** A Konnect PAT (Personal Access Token) to send in the Authorization header */
  readonly VITE_KONNECT_PAT: string
  readonly VITE_KONG_MANAGER_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
