<!-- eslint-disable vue/no-v-html -->
<template>
  <AppError>
    <slot name="default">
      <h2 v-html="headerContent" />
      <p v-html="textContent" />
    </slot>
  </AppError>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AppError } from '@kong-ui/app-layout'
import { useI18n } from '../../composables'

const { i18n: { t } } = useI18n()

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
})

// Set the error content; fallback to a generic error
const headerContent = computed(() => props.header || t('errors.unexpected.header'))
const textContent = computed(() => props.text || t('errors.unexpected.text'))
</script>
