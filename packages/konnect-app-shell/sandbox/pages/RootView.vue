<template>
  <router-view />
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Geo } from '../../src/types'

defineProps({
  activeGeo: {
    type: Object as PropType<Geo | undefined>,
    default: undefined,
    required: true,
  },
})
</script>
