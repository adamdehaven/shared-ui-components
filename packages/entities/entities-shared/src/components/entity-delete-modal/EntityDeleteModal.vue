<template>
  <KPrompt
    action-button-text="Yes, delete"
    :action-pending="actionPending"
    class="kong-ui-entity-delete-modal"
    :confirmation-text="entityName"
    :is-visible="visible"
    :title="title"
    type="danger"
    @canceled="cancel"
    @proceed="proceed"
  >
    <template #body-content>
      <i18n-t
        class="message"
        :keypath="props.entityName ? 'deleteModal.messageWithName' : 'deleteModal.message'"
        tag="p"
      >
        <template #entityType>
          {{ props.entityType }}
        </template>
        <template
          v-if="props.entityName"
          #entityName
        >
          <strong>
            {{ props.entityName }}
          </strong>
        </template>
      </i18n-t>
      <p
        v-if="props.description"
        class="description"
      >
        {{ props.description }}
      </p>
    </template>
  </KPrompt>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import composables from '../../composables'
import { EntityTypes } from '../../types'

const { i18nT } = composables.useI18n()

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    default: 'Delete',
  },
  entityType: {
    type: String as PropType<EntityTypes>,
    required: true,
  },
  entityName: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  actionPending: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'proceed'): void
}>()

const cancel = () => {
  emit('cancel')
}

const proceed = () => {
  emit('proceed')
}
</script>

<style lang="scss" scoped>
.kong-ui-entity-delete-modal {
  .message,
  .description {
    line-height: 24px;
    margin: 0;
  }

  .message strong {
    font-weight: 600;
  }

  .description {
    margin-top: 32px;
  }
}
</style>
