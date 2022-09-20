<template>
  <div class="test-button">
    <button
      :class="{ 'active': active }"
      @click="buttonClick"
    >
      {{ msg }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

const active = ref(false)

const props = defineProps({
  msg: {
    type: String,
    required: true,
  },
})

const buttonClick = (): void => {
  active.value = !active.value
}
</script>

<style lang="scss">
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
</style>
