<template>
  <div
    v-if="activeGeoCode && searchApiUrl"
    class="kong-ui-konnect-global-search"
  >
    <div class="search-container container">
      <div class="search-icon" />
      <NavbarDropdownMenu
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
  display: flex;
  margin-left: 12px!important;
  width: 100%;

  .search-container {
    display: flex;
    margin-left: 34px;
    padding: 0;
    width: 100%;

    .search-icon {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M6 12c-3.3137085 0-6-2.6862915-6-6s2.6862915-6 6-6 6 2.6862915 6 6c0 1.29583043-.410791 2.49571549-1.1092521 3.47653436l1.2305724 1.23057244 2.8232632 2.8338633c.3897175.3911808.3947266 1.0192147.005164 1.4087774-.3868655.3868655-1.014825.3873148-1.4087774-.005164l-2.8338633-2.8232632-1.23057244-1.2305724C8.49571549 11.589209 7.29583043 12 6 12zm4-6c0-2.209139-1.790861-4-4-4S2 3.790861 2 6s1.790861 4 4 4 4-1.790861 4-4z'/%3E%3C/svg%3E");
      background-position: 0 50%;
      background-repeat: no-repeat;
      // generated using https://codepen.io/sosuke/pen/Pjoqqp
      filter: invert(31%) sepia(11%) saturate(2713%) hue-rotate(180deg) brightness(88%) contrast(85%);
      float: left;
      margin: 8px 12px 8px 0;
      min-width: 16px;
    }
  }
}
</style>
