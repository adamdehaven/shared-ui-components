<template>
  <div class="test-button">
    <button
      :class="{ 'active': active }"
      @click="buttonClick"
    >
      {{ msg }}
    </button>
    <p v-if="active && displayUrl">
      The current hostname is <code>{{ displayUrl }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWindow } from '@kong-ui/demo-utils'

const displayUrl = ref('')
const active = ref(false)

defineProps({
  msg: {
    type: String,
    required: true,
  },
})

const win = useWindow()

const buttonClick = (): void => {
  active.value = !active.value
  
  // Set the display URL to the window.location.hostname
  displayUrl.value = win.getLocationHostname()
}
</script>

<style lang="scss">
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.2;
}

.test-button button {
  display: inline-flex;
  color: #333;
  background: #ccc;
  padding: 4px 16px;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.3;
  cursor: pointer;
  appearance: none;
  transition: background 0.2s ease-in-out;

  &:hover {
    color: #000;
    background: #aaa;
  }

  &.active {
    color: #fff;
    background: #007ac1;

    &:hover {
      color: #ddd;
      background: darken(#007ac1, 10%);
    }
  }
}

code {
  color: #007ac1;
  background: #eee;
  padding: 4px 8px;
  border-radius: 6px;
}
</style>
