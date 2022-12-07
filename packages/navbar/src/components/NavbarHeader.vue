<template>
  <header class="kong-ui-navbar-header">
    <div class="header-content">
      <div class="mobile-header-left">
        <slot name="mobile-sidebar-toggle" />
        <slot name="mobile-logo" />
      </div>
      <slot name="default" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  topOffset: {
    type: Number,
    default: 0,
  },
  zIndex: {
    type: Number,
    default: 3,
  },
})

const headerStyles = computed(() => ({
  top: props.topOffset ? `${props.topOffset}px` : '0',
  zIndex: props.zIndex,
}))
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.kong-ui-navbar-header {
  position: fixed;
  top: v-bind('headerStyles.top');
  left: 0;
  right: 0;
  background-color: #fff;
  border-bottom: $navbar-border-bottom;
  z-index: v-bind('headerStyles.zIndex');

  @media (min-width: $viewport-md) {
    left: var(--kong-ui-sidebar-width, $sidebar-width);
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--kong-ui-navbar-header-item-gap, $header-item-gap);
    height: var(--kong-ui-navbar-height, $navbar-height);
    padding: 0 16px;
    border-bottom: $navbar-border-bottom;
  }

  .mobile-header-left {
    display: inline-flex;
    gap: var(--kong-ui-navbar-header-item-gap, $header-item-gap);

    @media (min-width: $viewport-md) {
      display: none;
    }
  }
}
</style>
