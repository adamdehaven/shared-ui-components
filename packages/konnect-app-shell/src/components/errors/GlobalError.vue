<template>
  <AppError>
    <h2>{{ header }}</h2>
    <p>{{ text }}</p>
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
