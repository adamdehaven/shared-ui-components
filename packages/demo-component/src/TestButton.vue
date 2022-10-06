<template>
  <div class="demo-component">
    <button
      :class="{ 'active': active, 'not-active': !active }"
      @click="buttonClick"
    >
      {{ msg }}
    </button>
    <p>{{ buttonIsActive }}</p>
    <p v-if="active && displayText">
      <b>{{ displayText }}</b>
    </p>
    <p>{{ t('form.paragraph') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import english from './locales/en.json'
import { useI18n } from '@kong-ui/core'

const displayText = ref('')
const active = ref(false)

// @ts-ignore
const { t } = useI18n(english)

defineProps({
  msg: {
    type: String,
    required: true,
  },
  theButtonIsVisible: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const buttonIsActive = computed((): string => active.value ? 'Active' : 'Not active')

const buttonClick = (): void => {
  active.value = !active.value

  // Set the display text
  displayText.value = active.value ? "I'm active!" : ''
}
</script>

<style lang="scss">
.demo-component button {
  display: inline-flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
