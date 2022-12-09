<template>
  <p>This is the <b>{{ route.meta.title }}</b> page.</p><br>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
