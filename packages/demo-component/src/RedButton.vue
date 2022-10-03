<template>
  <div class="button-container">
    <TestButton :msg="customText" />
  </div>
</template>

<script setup lang="ts">
import TestButton from './TestButton.vue'

defineProps({
  customText: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss">
.button-container {
  padding: 20px;
  background-color: #ff0000;
}
</style>
