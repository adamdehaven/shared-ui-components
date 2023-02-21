<template>
  <div class="global-search">
    <div class="global-search-icon">
      <KIcon
        color="var(--kong-ui-konnect-global-search-secondary-color, var(--steel-300, #a3b6d9))"
        icon="search"
        size="20"
      />
    </div>
    <KSelect
      appearance="select"
      autosuggest
      clearable
      data-testid="filter-select"
      :items="filteredSuggestions"
      :loading="loadingSelect"
      :placeholder="t('global_search.search')"
      width="100%"
      @query-change="search"
      @selected="onSelected"
    >
      <template #item-template="{ item }">
        <SearchAutocompleteEntityItem
          :entity="item"
          :query="query"
        />
      </template>
      <template #loading>
        <p
          class="loading-search"
          data-testid="global-search-loading"
        >
          {{ t('global_search.loading') }}
        </p>
      </template>
      <template #empty>
        <div :data-testid="error ? 'global-search-error-state' : 'global-search-empty-state'">
          <p class="no-search-result">
            {{ error ? t('global_search.errors.general.label') : t('global_search.no_results.label') }}
          </p>
          <p class="try-again-search">
            {{ error ? t('global_search.errors.general.description') : t('global_search.no_results.description') }}
          </p>
        </div>
      </template>
    </KSelect>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import composables from '../composables'
import SearchAutocompleteEntityItem from './SearchAutocompleteEntityItem.vue'
import { SelectedSearchItem, SearchResult, KonnectSearchIndexType } from '../types'

const SECTION_ITEMS_LIMIT = 5

const props = defineProps({
  searchApiUrl: {
    type: String,
    required: true,
  },
  activeGeoCode: {
    type: String,
    required: true,
  },
  shouldNavigate: {
    type: Boolean,
    default: true,
  },
  selectedOption: {
    type: String,
    default: '',
    validator: (val: string) => {
      const KonnectSearchIndexTypeValues = Object.values(KonnectSearchIndexType)
      let validated = true

      val.split(',').every(splitVal => {
        if (!KonnectSearchIndexTypeValues.includes(splitVal as KonnectSearchIndexType) && val !== '') {
          validated = false

          return false
        }
        return true
      })

      return validated
    },
  },
})

const win = composables.useWindow()
const { i18n: { t } } = composables.useI18n()

const servicePackageId = computed(() => String(win.getUrlSearchParams()?.get('service') || ''))
const loadingSelect = ref(false)

const { results: data, error, fetchSearchResults } = composables.useSearchApi(props.searchApiUrl)

const debounceSearch = (initialQuery: string, delay = 300) => {
  let timeout: any
  const query = ref(initialQuery)
  const search = (q: string): void => {
    clearTimeout(timeout)
    timeout = setTimeout(async () => {
      query.value = q
      try {
        loadingSelect.value = true
        await fetchSearchResults(props.selectedOption, query.value)
      } catch (err) {
        throw new Error('Could not fetch search results')
      } finally {
        loadingSelect.value = false
      }
    }, delay)
  }

  return {
    query,
    search,
  }
}

const { query, search } = debounceSearch(win.getUrlSearchParams()?.get('search') || '')

// Use hidden clear button to clear the selection after user clicks an item
// Need setTimeout to give time for the clearButtonElem to render before we can click it
const getSelectedItemCancelBtn = (): void => {
  setTimeout(() => {
    // eslint-disable-next-line no-case-declarations
    const clearButtonEle = document.querySelector('.global-search .k-select-input .cursor-pointer')

    const clickEvent = new MouseEvent('click', {
      bubbles: false,
      cancelable: false,
    })

    clearButtonEle && clearButtonEle.dispatchEvent(clickEvent)
  }, 250)
}

const emit = defineEmits(['selected'])

const getSelectionResult = (item: any) => {
  let selectionResult: SelectedSearchItem | null = null

  switch (item.index) {
    case 'service_packages':
      selectionResult = {
        to: {
          name: 'root-show-service-package',
          params: { service: item.source.id },
        },
        url: `/${props.activeGeoCode}/servicehub/${item.source.id}`,
      }
      break
    case 'service_versions':
      selectionResult = {
        to: {
          name: 'show-service-version',
          params: {
            service: item.source.service_package.id,
            version: item.source.id,
          },
        },
        url: `/${props.activeGeoCode}/servicehub/${item.source.service_package.id}/versions/${item.source.id}`,
      }
      break
    case 'developers':
      selectionResult = {
        to: {
          name: 'show-developer',
          params: {
            developer: item.source.id,
          },
        },
        url: `/${props.activeGeoCode}/portal/developers/${item.source.id}`,
      }
      break
    case 'users':
      selectionResult = {
        to: {
          name: 'show-user',
          params: {
            user: item.source.id,
          },
        },
        url: `/global/organization/users/${item.source.id}`,
      }
      break
    case 'service_package_documents':
      if (servicePackageId.value !== item.source.service_package.id) {
        selectionResult = {
          to: {
            name: 'root-show-service-package',
            params: { service: item.source.service_package.id },
          },
          url: `${props.activeGeoCode}/servicehub/${item.source.service_package.id}`,
        }
      }
      break
    case 'service_version_documents':
      selectionResult = {
        to: {
          name: 'show-service-version',
          params: {
            service: item.source.service_version.service_package.id,
            version: item.source.service_version.id,
          },
        },
        url: `/${props.activeGeoCode}/servicehub/${item.source.service_version.service_package.id}/versions/${item.source.service_version.id}`,
      }
      break
  }

  return selectionResult
}

const onSelected = (item: any) => {
  if (!item) {
    return
  }

  const selectionResult = getSelectionResult(item)

  if (selectionResult != null) {
    getSelectedItemCancelBtn()
    emit('selected', selectionResult)
    if (props.shouldNavigate) {
      win.setLocationAssign(selectionResult.url)
    }
  }
  return false
}

const sectionConfigs = {
  service_packages: {
    limit: SECTION_ITEMS_LIMIT,
    label: 'Services',
  },
  service_versions: {
    limit: SECTION_ITEMS_LIMIT,
    label: 'Versions',
  },
  developers: {
    limit: SECTION_ITEMS_LIMIT,
    label: 'Developers',
  },
  users: {
    limit: SECTION_ITEMS_LIMIT,
    label: 'Users',
  },
  service_package_documents: {
    limit: SECTION_ITEMS_LIMIT,
    label: 'Service Documents',
  },
  service_version_documents: {
    limit: SECTION_ITEMS_LIMIT,
    label: 'Version Documents',
  },
}

function getSuggestionValue(suggestion: SearchResult) {
  const suggestionValueMapping = {
    [KonnectSearchIndexType.ServicePackage]: suggestion.source.name,
    [KonnectSearchIndexType.ServiceVersion]: suggestion.source.version,
    [KonnectSearchIndexType.User]: suggestion.source.email,
    [KonnectSearchIndexType.ServicePackageDocuments]: suggestion.source.path,
    [KonnectSearchIndexType.ServiceVersionDocuments]: suggestion.source.path,
    [KonnectSearchIndexType.Developers]: suggestion.source.email,
  }

  return suggestionValueMapping[suggestion.index] || suggestion.source?.name
}

// Adding return type of any[] since we can't import the SelectItem[] interface from Kongponents
const filteredSuggestions = computed((): any[] => {
  const filtered: Object[] = []
  const suggestions = data.value?.data
  const refactoredArray: Object[] = []

  if (suggestions && suggestions.length > 0) {
    Object.keys(sectionConfigs).forEach(entity => {
      const filteredSection = suggestions.filter(suggestion => {
        return suggestion.index === entity
      })

      if (filteredSection.length > 0) {
        filtered.push({
          name: entity,
          label: entity,
          value: entity,
          data: filteredSection,
        })
      }
    })

    filtered.map(entityItem => {
      // @ts-ignore
      entityItem.data.map(filteredEntityItem => {
        filteredEntityItem.source.label = filteredEntityItem.source?.full_name || filteredEntityItem.source?.name || filteredEntityItem.source?.email
        filteredEntityItem.source.name = filteredEntityItem.source?.full_name || filteredEntityItem.source?.name || filteredEntityItem.source?.email
        filteredEntityItem.label = getSuggestionValue(filteredEntityItem)
        filteredEntityItem.value = filteredEntityItem.source.id
        refactoredArray.push(filteredEntityItem)
        return true
      })
      return true
    })

    return refactoredArray
  }

  return filtered
})

// Watch the selected option. When it changes, init a new search request to update the results list
watch(() => props.selectedOption, () => {
  // Pass the query or a space ' ' to trigger new results
  search(query.value || ' ')
}, { deep: true })

onMounted(() => {
  // Do one initial search on mount so that the dropdown shows available options when opened
  // Pass the query or a space ' ' to trigger new results
  search(' ')
})
</script>

<style lang="scss" scoped>
.global-search {
  border-left: 1px solid var(--black-10, rgba(0, 0, 0, 0.1));
  padding-left: 12px;
  position: relative;
  width: 100%;

  .global-search-icon {
    align-items: center;
    display: flex;
    height: 100%;
    left: 12px;
    line-height: 1;
    pointer-events: none;
    position: absolute;
    top: 0;
    z-index: 1;
  }

  :deep(.k-select) {
    .k-select-input {
      --KInputColor: var(--kong-ui-konnect-global-search-input-color, var(--white, #fff));
      --KInputPlaceholderColor: var(--kong-ui-konnect-global-search-secondary-color, var(--steel-300, #a3b6d9));
      background-color: transparent;
      border: none;

      &.select-input-container > .kong-icon.kong-icon-chevronDown {
        // Requirement from Design
        display: none !important;
      }

      .k-input {
        background-color: transparent;
        padding-left: 32px;
      }
    }
  }

  // Hiding it for better user experience otherwise the button flashes visible during the KSelectItem selection toggle; can't use display: none since we must be able to simulate a click
  .k-button.clear-selection-icon {
    visibility: hidden !important;
  }

  // Changed display to none since we are deselecting the selected KSelectItem right before navigation
  .kong-icon.selected-item-icon {
    display: none !important;
  }

  .k-popover-content .k-select-list li.k-select-item div.d-block {
    button {
      display: initial !important;
      line-height: 0 !important;
    }
  }

  .loading-search,
  .no-search-result {
    font-size: 16px;
    line-height: 1.1;
    margin: 0;
    padding: 12px;
  }

  .loading-search {
    font-weight: 500;
  }

  .no-search-result {
    font-weight: 600;
    padding-bottom: 0;
  }

  .try-again-search {
    font-size: 13px;
    font-weight: 400;
    line-height: 1.2;
    padding: 0 12px;
  }
}
</style>
