<template>
  <div
    v-if="activeGeoCode && searchApiUrl"
    class="kong-ui-konnect-global-search"
  >
    <div class="search-container">
      <NavbarDropdownMenu
        class="dropdown-search-filter"
        data-testid="search-dropdown-toggle"
        :options="searchOptions"
        @change="changeSearchOption"
      />
      <SearchAutocomplete
        :active-geo-code="activeGeoCode"
        :search-api-url="searchApiUrl"
        :selected-option="optionToIndexMapping(selectedSearchOption)"
        :should-navigate="shouldNavigate"
        @selected="emitSelected"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { NavbarDropdownMenu } from '@kong-ui-public/app-layout'
import type { NavbarDropdownMenuItem } from '@kong-ui-public/app-layout'
import composables from '../composables'
import SearchAutocomplete from './SearchAutocomplete.vue'
import { SelectedSearchItem } from '../types'

const { i18n: { t } } = composables.useI18n()

const emit = defineEmits(['selected'])

const emitSelected = (searchResult: SelectedSearchItem) => {
  emit('selected', searchResult)
}

defineProps({
  searchApiUrl: {
    type: String,
    required: true,
  },
  activeGeoCode: {
    type: String,
    required: true,
  },
  /** true: Navigate via `window.location.assign` when a search result is selected */
  /** false: Emit a `@selected` event and let application handle navigation via router.push or refresh */
  shouldNavigate: {
    type: Boolean,
    default: true,
  },
})

const searchOptions = [
  {
    label: t('global_search.search_options.all'),
    value: '',
    selected: true,
  },
  {
    label: t('global_search.search_options.services'),
    value: 'service_packages,service_versions',
    selected: false,
  },
  {
    label: t('global_search.search_options.users'),
    value: 'users',
    selected: false,
  },
  {
    label: t('global_search.search_options.developers'),
    value: 'developers',
    selected: false,
  },
  {
    label: t('global_search.search_options.documents'),
    value: 'service_package_documents,service_version_documents',
    selected: false,
  },
]

// Default to 'All'
const selectedSearchOption: Ref<NavbarDropdownMenuItem> = ref(searchOptions[0])

const changeSearchOption = (option: NavbarDropdownMenuItem) => {
  selectedSearchOption.value = option
}

const optionToIndexMapping = (option: NavbarDropdownMenuItem) => {
  return searchOptions.filter(opt => opt.label === option.label)[0]?.value || ''
}
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.kong-ui-konnect-global-search {
  --KInputBorder: transparent;
  --KInputDisabledBackground: var(--white);
  background-color: var(--kong-ui-konnect-global-search-background-color, rgba(#fff, 0.1));
  border-radius: 100px;
  display: flex;
  width: 100%;

  .search-container {
    display: flex;
    padding: 0;
    padding-right: 16px;
    width: 100%;

    .dropdown-search-filter {
      :deep(.dropdown-trigger) {
        .k-button {
          background-color: transparent;
          border-bottom-right-radius: 0;
          border-top-right-radius: 0;
          color: var(--kong-ui-konnect-global-search-filter-color, var(--steel-200, #dae3f2));
          font-weight: 500;
          height: 44px;
          padding-right: var(--spacing-sm, 12px);
          --KButtonOutlineColor: var(--kong-ui-konnect-global-search-secondary-color, var(--steel-300, #a3b6d9));
        }
      }
    }
  }
}
</style>
