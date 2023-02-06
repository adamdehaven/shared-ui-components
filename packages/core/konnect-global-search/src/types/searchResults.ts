import type { KonnectSearchIndexType } from '../types/'
import type { RouteLocationRaw } from 'vue-router'

export interface SearchResultSource {
  name: string
  email: string
  version: string
  path: string
  label: string
  value: string
  id: string
  service_package: {
    name: string
    version: string
  },
  service_version: {
    version: string
  }
}
export interface SearchResult {
  index: KonnectSearchIndexType
  source: SearchResultSource
}

export interface SearchResultsResponse {
  data: SearchResult[]
  count: number
}

export interface SelectedSearchItem {
  to: RouteLocationRaw
  url: string
}
