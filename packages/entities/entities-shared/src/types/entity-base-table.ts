import { RouteLocationRaw } from 'vue-router'
import { Field } from './index'

export interface BaseTableHeaders {
  [key: string]: Field
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
