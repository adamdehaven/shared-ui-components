<template>
  <KCard class="kong-ui-entity-base-table">
    <template #body>
      <KTable
        :empty-state-action-button-icon="query ? '' : 'plus'"
        :empty-state-action-message="query ? t('baseTable.emptyState.noSearchResultsCtaText') : emptyStateOptions.ctaText"
        :empty-state-action-route="query ? '' : emptyStateOptions.ctaPath"
        :empty-state-icon="query ? 'stateNoSearchResults' : 'stateGruceo'"
        empty-state-icon-size="96"
        :empty-state-message="query ? t('baseTable.emptyState.noSearchResultsMessage') : emptyStateOptions.message"
        :empty-state-title="query ? t('baseTable.emptyState.noSearchResultsTitle') : emptyStateOptions.title"
        :enable-client-sort="enableClientSort"
        :error-state-title="errorMessage"
        :fetcher="fetcher"
        :fetcher-cache-key="String(fetcherCacheKey)"
        :has-error="!!errorMessage"
        :headers="headers"
        :initial-fetcher-params="initialFetcherParams"
        :is-loading="isLoading"
        :row-attrs="rowAttrs"
        :search-input="query"
        @ktable-empty-state-cta-clicked="clearSearchInput"
        @row:click="handleRowClick"
      >
        <template #toolbar>
          <div class="toolbar-container">
            <slot name="toolbar-filter" />
            <div
              v-if="$slots['toolbar-button']"
              class="toolbar-button-container"
            >
              <slot name="toolbar-button" />
            </div>
          </div>
        </template>
        <template
          v-for="(_, key) in tableHeaders"
          :key="key"
          #[key]="{ row, rowKey, rowValue }"
        >
          <slot
            :name="key"
            :row="row"
            :row-key="rowKey"
            :row-value="rowValue"
          />
        </template>
        <template #actions="{ row, rowKey, rowValue }">
          <div
            class="actions-container"
            :data-testid="row.name"
          >
            <KDropdownMenu
              :kpop-attributes="{ placement: 'bottomEnd' }"
            >
              <KButton
                class="non-visual-button"
                data-testid="overflow-actions-button"
                size="small"
              >
                <template #icon>
                  <KIcon
                    color="var(--black-400, #3c4557)"
                    icon="more"
                    size="16"
                  />
                </template>
              </KButton>
              <template #items>
                <slot
                  name="actions"
                  :row="row"
                  :row-key="rowKey"
                  :row-value="rowValue"
                />
              </template>
            </KDropdownMenu>
          </div>
        </template>
      </KTable>
    </template>
  </KCard>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import composables from '../../composables'
import type {
  BaseTableHeaders,
  EmptyStateOptions,
  FetcherParams,
  FetcherResponse,
  InternalHeader,
} from '../../types'

const { i18n: { t } } = composables.useI18n()

const props = defineProps({
  // table header configuration
  tableHeaders: {
    type: Object as PropType<BaseTableHeaders>,
    required: true,
    default: () => ({}),
  },
  // fetcher function
  fetcher: {
    type: Function as PropType<(params: FetcherParams) => Promise<FetcherResponse>>,
    required: true,
    default: async () => ({
      data: [],
      total: 0,
    }),
  },
  initialFetcherParams: {
    type: Object as PropType<Partial<Omit<FetcherParams, 'query'>>>,
    default: null,
  },
  // cache key for the fetcher
  fetcherCacheKey: {
    type: Number,
    default: 1,
  },
  // whether the table is loading
  isLoading: {
    type: Boolean,
    default: false,
  },
  // search query
  query: {
    type: String,
    default: '',
  },
  // Enable client-side sort (e.g. for Koko endpoints that do not support sort)
  enableClientSort: {
    type: Boolean,
    default: false,
  },
  // whether to show the actions column
  enableEntityActions: {
    type: Boolean,
    default: true,
  },
  // options for the empty state
  emptyStateOptions: {
    type: Object as PropType<EmptyStateOptions>,
    default: () => ({}),
  },
  // error message to show in the error state
  // this prop being set (or empty) determines if the KTable is in an error state
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'click:row', row: object) : void,
  (e: 'clear-search-input') : void,
}>()

const headers = computed<Array<InternalHeader>>(() => {
  const arr = []
  const fieldKeys = Object.keys(props.tableHeaders)
  fieldKeys.forEach(key => {
    const field = props.tableHeaders[key]

    arr.push({
      label: field.label ?? key,
      key,
      sortable: field.sortable ?? false,
    })
  })

  if (props.enableEntityActions) {
    arr.push({
      key: 'actions',
      hideLabel: true,
    })
  }

  return arr
})

const rowAttrs = (row: { id: string, name: string }) => ({
  'data-rowid': row.id,
  'data-testid': row.name,
})

const clearSearchInput = () => {
  emit('clear-search-input')
}

const handleRowClick = (_: MouseEvent, row: object) => {
  emit('click:row', row)
}
</script>

<style lang="scss" scoped>
.toolbar-container {
  align-items: center;
}

.toolbar-button-container {
  margin-left: auto;
}

.actions-container {
  float: right;

  :deep(.k-dropdown-item-trigger) {
    margin-bottom: 0;
    margin-top: 0;
  }
}
</style>
