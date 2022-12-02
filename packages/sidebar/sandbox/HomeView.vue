<template>
  <p>This is the HOME page showing <b>{{ routeName }}</b></p>
  <div style="float: right">
    <KButton>Focusable button</KButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const routeName = computed(() => Object.keys(route.query)[0] || ' no query string')
</script>
