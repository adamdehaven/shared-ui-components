<template>
  <div v-if="isAllowed">
    <slot name="default" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, PropType } from 'vue'

const props = defineProps({
  /**
   * Provide an async function that returns a boolean to determine whether
   * the wrapper should hide or show the default slot content.
  */
  authFunction: {
    type: Function as PropType<() => Promise<boolean>>,
    required: true,
    default: async () => true,
  },
})

const isAllowed = ref<boolean>(false)

onBeforeMount(async (): Promise<void> => {
  isAllowed.value = await props.authFunction()
})
</script>
