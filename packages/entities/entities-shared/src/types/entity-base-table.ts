import { RouteLocationRaw } from 'vue-router'

export interface BaseTableHeaders {
  [key: string]: {
    label?: string
    searchable?: boolean
    sortable?: boolean
  }
}

export interface EmptyStateOptions {
  ctaPath?: RouteLocationRaw
  ctaText?: string
  message: string
  title: string
  showCta?: boolean
}

export interface FetcherParams {
  page: number
  pageSize: number
  offset: number
  sortColumnKey: string
  sortColumnOrder: 'asc' | 'desc'
  query: string
}

export interface FetcherResponse {
  data: any[]
  total: number
}

interface InternalHeaderForFields {
  key: string
  label: string
  sortable: boolean
}

interface InternalHeaderForActions {
  key: string
  hideLabel: boolean
}

export type InternalHeader = InternalHeaderForFields | InternalHeaderForActions
