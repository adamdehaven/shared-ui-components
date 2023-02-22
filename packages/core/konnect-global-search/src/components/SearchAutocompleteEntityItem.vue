<template>
  <div v-if="entity">
    <div
      class="search-autocomplete-entity-item suggestion-item"
    >
      <div class="entity-item-container">
        <KIcon
          class="search-result-icon"
          color="var(--grey-500)"
          :icon="entityIcon"
          size="12"
          :view-box="iconViewBox"
        />
        <div class="entity-item-name">
          <span v-if="!query">{{ entityMatchingSource }}</span>
          <!-- eslint-disable vue/no-v-html -->
          <span
            v-else
            v-html="getQueryMatchHtml(query, entityMatchingSource)"
          />
        </div>
      </div>
      <div class="entity-item-path">
        {{ entityType }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import type { SearchResult } from '../types'
import { KonnectSearchIndexType } from '../types'

const props = defineProps({
  entity: {
    type: Object as PropType<SearchResult>,
    default: () => null,
  },
  query: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    default: '',
  },
})

const escapeUnsafeCharacters = (unescapedCodeString: string): string => {
  return unescapedCodeString
    .replace(/&/g, '&amp')
    .replace(/'/g, '&apos')
    .replace(/"/g, '&quot')
    .replace(/>/g, '&gt')
    .replace(/</g, '&lt')
}

const entitySourceMapping = {
  [KonnectSearchIndexType.ServicePackage]: props.entity.source.name,
  [KonnectSearchIndexType.ServiceVersion]: props.entity.source.service_package?.name + ' › ' + props.entity.source.version,
  [KonnectSearchIndexType.User]: props.entity.source.email,
  [KonnectSearchIndexType.ServicePackageDocuments]: props.entity.source.service_package?.name + ' › ' + props.entity.source.path,
  [KonnectSearchIndexType.ServiceVersionDocuments]: props.entity.source.service_version?.version + ' › ' + props.entity.source.path,
  [KonnectSearchIndexType.Developers]: props.entity.source.email,
}
// Replace unsafe HTML
const entityMatchingSource = escapeUnsafeCharacters(entitySourceMapping[props.entity.index] || props.entity.source.id)

const entityTypeMapping = {
  [KonnectSearchIndexType.ServicePackage]: 'Service',
  [KonnectSearchIndexType.ServiceVersion]: 'Service › Version',
  [KonnectSearchIndexType.User]: 'User',
  [KonnectSearchIndexType.ServicePackageDocuments]: 'Service › Document',
  [KonnectSearchIndexType.ServiceVersionDocuments]: 'Service › Version › Document',
  [KonnectSearchIndexType.Developers]: 'Developer',
}
const entityType = entityTypeMapping[props.entity.index] || 'Service'

const entityIconMapping = {
  [KonnectSearchIndexType.ServicePackage]: 'serviceHub',
  [KonnectSearchIndexType.ServiceVersion]: 'serviceHub',
  [KonnectSearchIndexType.User]: 'people',
  [KonnectSearchIndexType.ServicePackageDocuments]: 'serviceDocument',
  [KonnectSearchIndexType.ServiceVersionDocuments]: 'serviceDocument',
  [KonnectSearchIndexType.Developers]: 'people',
}
const entityIcon:string = entityIconMapping[props.entity.index] || 'services'

const iconViewBoxMapping = {
  [KonnectSearchIndexType.ServicePackage]: '0 0 18 18',
  [KonnectSearchIndexType.ServiceVersion]: '0 0 18 18',
  [KonnectSearchIndexType.User]: '0 0 18 12',
  [KonnectSearchIndexType.ServicePackageDocuments]: '0 0 12 12',
  [KonnectSearchIndexType.ServiceVersionDocuments]: '0 0 12 12',
  [KonnectSearchIndexType.Developers]: '0 0 18 12',
}
const iconViewBox = iconViewBoxMapping[props.entity.index] || '0 0 18 18'

/**
 *  Matches characters of suggestion against the search query
 * @param text search query
 * @param suggestion autosuggest list item suggestion
 * @returns the original suggestion in a span OR finds each matching character of suggestion from query text and wraps in a bold tag
 */
const getQueryMatchHtml = (text: string, suggestion:string) => {
  const regex = new RegExp('(' + encodeURIComponent(text) + ')', 'gi')
  const parts = suggestion.split(regex)

  for (let i = 1; i < parts.length; i += 2) {
    parts[i] = `<b>${parts[i]}</b>`
  }

  return parts.join('')
}
</script>

<style lang="scss" scoped>
.search-autocomplete-entity-item.suggestion-item {
  display: flex;
  justify-content: space-between;

  .entity-item-container {
    align-items: center;
    display: flex;
    overflow: hidden;
    padding-right: 16px;
  }

  .search-result-icon {
    flex-shrink: 0;
    height: auto;
    margin-right: 16px;
    position: relative;
    right: 0;
  }
}

.suggestion-item {
  cursor: pointer;
  padding-left: 8px;
  padding-right: 20px;
}
</style>

<style lang="scss">
.entity-item-name {
  font-size: var(--type-sm, 14px);
  font-weight: 500;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-autocomplete-entity-item .entity-item-path {
  color: var(--grey-500);
  font-size: var(--type-sm, 14px);
  font-weight: 400;
  line-height: 16px;
  margin-bottom: auto;
  margin-right: 14px;
  margin-top: auto;
  white-space: nowrap;
}
</style>
