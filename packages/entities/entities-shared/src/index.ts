import EntityDeleteModal from './components/entity-delete-modal/EntityDeleteModal.vue'
import EntityBaseTable from './components/entity-base-table/EntityBaseTable.vue'
import PermissionsWrapper from './components/permissions-wrapper/PermissionsWrapper.vue'
import composables from './composables'

// Extract specific composables to export
const { useAxios } = composables

// Components
export {
  EntityDeleteModal,
  EntityBaseTable,
  PermissionsWrapper,
}

// Composables
export {
  useAxios,
}

// Types
export * from './types'
