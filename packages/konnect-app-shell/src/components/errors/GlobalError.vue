<!-- eslint-disable vue/no-v-html -->
<template>
  <AppError>
    <h2 v-html="header" />
    <p v-html="text" />
  </AppError>
</template>

<script setup lang="ts">
import { AppError } from '@kong-ui/app-layout'

defineProps({
  header: {
    type: String,
    required: true,
    default: '',
  },
  text: {
    type: String,
    required: true,
    default: '',
  },
})
</script>
