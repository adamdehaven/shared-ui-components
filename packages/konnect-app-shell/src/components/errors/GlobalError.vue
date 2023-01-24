<!-- eslint-disable vue/no-v-html -->
<template>
  <AppError>
    <slot name="default">
      <h2 v-html="headerContent" />
      <p v-html="textContent" />
    </slot>
    <CopyTraceId
      v-if="traceId"
      :trace-id="traceId"
    />
  </AppError>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AppError } from '@kong-ui-public/app-layout'
import composables from '../../composables'
import CopyTraceId from './CopyTraceId.vue'

const { i18n: { t } } = composables.useI18n()

const props = defineProps({
  header: {
    type: String,
    required: false,
    default: '',
  },
  text: {
    type: String,
    required: false,
    default: '',
  },
  traceId: {
    type: String,
    required: false,
    default: '',
  },
})

// Set the error content; fallback to a generic error
const headerContent = computed(() => props.header || t('errors.unexpected.header'))
const textContent = computed(() => props.text || t('errors.unexpected.text'))
</script>

<style lang="scss" scoped>
:deep(.copy-trace-id) {
  margin-top: 24px;
}
</style>
