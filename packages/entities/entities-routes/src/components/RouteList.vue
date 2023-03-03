<template>
  <div class="kong-ui-entities-routes-list">
    <EntityBaseTable
      :empty-state-options="emptyStateOptions"
      :enable-client-sort="enableClientSort"
      enable-entity-actions
      :error-message="state.errorMessage"
      :fetcher="fetcher"
      :initial-fetcher-params="{ sortColumnKey: 'name', sortColumnOrder: 'asc' }"
      :is-loading="state.isLoading"
      :query="filterQuery"
      :table-headers="tableHeaders"
      @clear-search-input="clearFilter"
      @click:row="rowClick"
    >
      <template
        v-if="state.hasData || filterQuery"
        #toolbar-filter
      >
        <EntityFilter
          v-model="filterQuery"
          :config="filterConfig"
        />
      </template>
      <template
        v-if="state.hasData || filterQuery"
        #toolbar-button
      >
        <PermissionsWrapper :auth-function="() => canCreate()">
          <KButton
            appearance="primary"
            icon="plus"
          >
            {{ t('routes.list.toolbar_actions.new_route') }}
          </KButton>
        </PermissionsWrapper>
      </template>
      <template #name="{ rowValue }">
        <b class="entity-name">{{ rowValue }}</b>
      </template>
      <template #protocols="{ rowValue }">
        <KBadge
          v-for="protocol in rowValue"
          :key="protocol"
          @click.stop
        >
          {{ protocol }}
        </KBadge>
      </template>
      <template #methods="{ rowValue }">
        <KBadge
          v-for="method in rowValue"
          :key="method"
          @click.stop
        >
          {{ method }}
        </KBadge>
      </template>
      <template #actions="{ row }">
        <KDropdownItem
          data-testid="action-entity-view"
          @click="rowClick(row)"
        >
          {{ t('actions.view') }}
        </KDropdownItem>
        <PermissionsWrapper :auth-function="() => canEdit(row)">
          <KDropdownItem
            data-testid="action-entity-edit"
            @click="editRow(row)"
          >
            {{ t('actions.edit') }}
          </KDropdownItem>
        </PermissionsWrapper>
        <PermissionsWrapper :auth-function="() => canDelete(row)">
          <KDropdownItem
            data-testid="action-entity-delete"
            has-divider
            is-dangerous
            @click="deleteRow(row)"
          >
            {{ t('actions.delete') }}
          </KDropdownItem>
        </PermissionsWrapper>
      </template>
    </EntityBaseTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, PropType, watch } from 'vue'
import composables from '../composables'
import endpoints from '../routes-endpoints'
import type { KonnectRouteListConfig, KongManagerRouteListConfig } from '../types'
import type { AxiosError } from 'axios'
import { EntityBaseTable, EntityFilter, PermissionsWrapper, useAxios } from '@kong-ui/entities-shared'
import type { BaseTableHeaders, EmptyStateOptions, FetcherParams, FetcherResponse, ExactMatchFilterConfig, FilterFields, FuzzyMatchFilterConfig } from '@kong-ui/entities-shared'
import '@kong-ui/entities-shared/dist/style.css'

const emit = defineEmits<{
  (e: 'error', error: AxiosError): void,
  (e: 'loading', isLoading: boolean): void,
}>()

// Component props - This structure must exist in ALL entity components, with the exclusion of unneeded action props (e.g. if you don't need `canDelete`, just exclude it)
const props = defineProps({
  /** The base konnect or kongManger config. Pass additional config props in the shared entity component as needed. */
  config: {
    type: Object as PropType<KonnectRouteListConfig | KongManagerRouteListConfig>,
    required: true,
    validator: (config: KonnectRouteListConfig | KongManagerRouteListConfig): boolean => {
      if (!config || !['konnect', 'kongManager'].includes(config?.app)) return false
      if (config.app === 'kongManager' && !config.isExactMatch && !config.filterSchema) return false
      return true
    },
  },
  /** An asynchronous function, that returns a boolean, that evaluates if the user can create a new entity */
  canCreate: {
    type: Function as PropType<() => Promise<boolean>>,
    required: false,
    default: async () => true,
  },
  /** An asynchronous function, that returns a boolean, that evaluates if the user can delete a given entity */
  canDelete: {
    type: Function as PropType<(row: object) => Promise<boolean>>,
    required: false,
    default: async () => true,
  },
  /** An asynchronous function, that returns a boolean, that evaluates if the user can edit a given entity */
  canEdit: {
    type: Function as PropType<(row: object) => Promise<boolean>>,
    required: false,
    default: async () => true,
  },
  /** An asynchronous function, that returns a boolean, that evaluates if the user can retrieve (view details) a given entity */
  canRetrieve: {
    type: Function as PropType<(row: object) => Promise<boolean>>,
    required: false,
    default: async () => true,
  },
})

const state = reactive({
  isLoading: false,
  errorMessage: '', // this property being set (or empty) determines if the KTable is in an error state
  hasData: false,
})

const { i18n: { t } } = composables.useI18n()

const fields = {
  name: { label: t('routes.list.table_headers.name'), searchable: true, sortable: true },
  protocols: { label: t('routes.list.table_headers.protocols'), searchable: true },
  hosts: { label: t('routes.list.table_headers.hosts'), searchable: true },
  methods: { label: t('routes.list.table_headers.methods'), searchable: true },
  paths: { label: t('routes.list.table_headers.paths'), searchable: true },
  id: { label: t('routes.list.table_headers.id'), sortable: true },
}

const filterQuery = ref<string>('')
const filterConfig = computed<InstanceType<typeof EntityFilter>['$props']['config']>(() => {
  const isExactMatch = (props.config.app === 'konnect' || props.config.isExactMatch)
  const { name, protocols, hosts, methods, paths, id } = fields
  const filterFields: FilterFields = isExactMatch ? { name, id } : { name, protocols, hosts, methods, paths }

  if (isExactMatch) {
    return {
      isExactMatch,
      fields: filterFields,
      placeholder: t('search.placeholder'),
    } as ExactMatchFilterConfig
  }

  return {
    isExactMatch,
    fields: filterFields,
    schema: props.config.filterSchema,
  } as FuzzyMatchFilterConfig
})

const enableClientSort = computed((): boolean => props.config.app === 'konnect')
const emptyStateOptions: EmptyStateOptions = {
  ctaPath: '', // TODO: Add CTA path
  ctaText: t('actions.create'),
  message: t('routes.list.empty_state.description'),
  title: t('routes.list.empty_state.title'),
}

const tableHeaders: BaseTableHeaders = fields

const { axiosInstance } = useAxios({
  headers: props.config?.requestHeaders,
})

const buildRequestUrl = (fetcherParams: FetcherParams): string => {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page, pageSize, offset, sortColumnKey, sortColumnOrder, query } = fetcherParams
  let url = `${props.config.apiBaseUrl}${endpoints.list[props.config.app]}`

  if (props.config.app === 'konnect') {
    url = url.replace(/{controlPlaneId}/gi, props.config?.controlPlaneId || '')
  } else if (props.config.app === 'kongManager') {
    url = url.replace(/{workspace}/gi, props.config?.workspace || '')
  }

  // This is done within a try/catch block in case there is an error in constructing the URL; the fallback value will still fetch but without the params
  try {
    // Construct a URL object, adding the current `window.location.origin` if the path begins with a slash
    const baseRequestUrl = props.config.apiBaseUrl.startsWith('/') ? new URL(`${window.location.origin}${url}`) : new URL(url)

    let urlWithParams: URL = new URL(baseRequestUrl.href)
    if (props.config.app === 'konnect') {
      // TODO: append the search, sort, and pagination paths/query strings as needed
      urlWithParams = new URL(query ? `${baseRequestUrl.href}/${query}/` : baseRequestUrl.href)
    } else if (props.config.app === 'kongManager') {
      // TODO: append the search, sort, and pagination paths/query strings as needed
      new URLSearchParams(filterQuery.value).forEach((value, key) => {
        urlWithParams.searchParams.append(key, value)
      })
    }

    if (props.config.app === 'kongManager' || !query) {
      urlWithParams.searchParams.append('size', String(pageSize))
    }

    return urlWithParams.href
  } catch (err) {
    // Fallback to returning the URL without the added params
    return url
  }
}

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetcher = async (fetcherParams: FetcherParams): Promise<FetcherResponse> => {
  try {
    state.isLoading = true
    state.errorMessage = ''

    const requestUrl = buildRequestUrl(fetcherParams)
    const { data } = await axiosInstance.get(requestUrl)
    let tableData

    if (data.data && Array.isArray(data.data)) {
      tableData = data.data
    } else {
      // Single object is returned, so wrap in an array
      tableData = [data]
    }

    state.hasData = !!tableData.length

    return {
      data: tableData,
      total: tableData.length,
    }
  } catch (error: any) {
    state.hasData = false

    // If response is 404, and there is a filterQuery, show no results instead of error
    if (filterQuery.value && error.response.status === 404) {
      state.errorMessage = ''

      return {
        data: [],
        total: 0,
      }
    }

    state.errorMessage = t('routes.list.error')

    // Emit the error for the host app
    emit('error', error)
  } finally {
    state.isLoading = false
  }
}

const clearFilter = (): void => {
  state.isLoading = true
  filterQuery.value = ''
}

const rowClick = (row: Record<string, any>): void => {
  console.log(`clicked: ${JSON.stringify(row)}`)
}

const editRow = (row: typeof tableHeaders): void => {
  console.log(`edit: ${row.name}`)
}

const deleteRow = (row: typeof tableHeaders): void => {
  console.log(`delete: ${row.name}`)
}

watch(() => state.isLoading, (isLoading: boolean) => {
  // Emit the loading state for the host app
  emit('loading', isLoading)
}, { immediate: true })
</script>

<style lang="scss" scoped>
.kong-ui-entities-routes-list {
  width: 100%;

  .table-toolbar {
    display: flex;
    width: 100%;
  }

  .create-button {
    margin-left: auto;
  }
}
</style>
