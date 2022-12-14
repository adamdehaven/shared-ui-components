<template>
  <AppLayout
    :sidebar-bottom-items="bottomItems"
    :sidebar-profile-items="profileItems"
    sidebar-profile-name="Adam"
    :sidebar-top-items="topItems"
  >
    <template #notification>
      <slot name="notification" />
    </template>
    <template #navbar-mobile-logo>
      <a href="/">
        <GruceLogo />
        <div class="logo-title">
          <KonnectLogo theme="light" />
        </div>
      </a>
    </template>
    <template #navbar>
      <slot name="navbar" />
    </template>
    <template #sidebar-header>
      <div
        class="sidebar-header-logo"
        data-testid="logo"
      >
        <a href="/">
          <GruceLogo />
          <div class="konnect-logo">
            <KonnectLogo theme="dark" />
          </div>
        </a>
      </div>
    </template>
    <template #app-error>
      <slot name="app-error" />
    </template>

    <slot name="default" />
  </AppLayout>
</template>

<script setup lang="ts">
import { watchEffect, PropType } from 'vue'
import { AppLayout, GruceLogo, KonnectLogo } from '@kong-ui/app-layout'
import type { SidebarSecondaryItem } from '@kong-ui/app-layout'
import { useAppSidebar } from '../composables'
import { KonnectAppShellSidebarItem } from '../types'
import '@kong-ui/app-layout/dist/style.css'

const props = defineProps({
  // Provide the secondary sidebar items that should be injected into the top-level primary item with the corresponding `parentKey`
  sidebarItems: {
    type: Object as PropType<KonnectAppShellSidebarItem>,
    default: () => ({}),
    validator: (sidebarItems: KonnectAppShellSidebarItem): boolean => {
      // Check parentKey
      if (!sidebarItems.parentKey || typeof sidebarItems.parentKey !== 'string') {
        return false
      }

      // If sidebarItems.items is undefined or empty, object is valid
      if (!sidebarItems.items || !sidebarItems.items.length) {
        return true
      }

      // Otherwise, ensure all items have a `name` and `to` property
      return !!sidebarItems.items?.every((item: SidebarSecondaryItem) => item.name && item.to)
    },
    required: false,
  },
})

const { topItems, bottomItems, profileItems, update: updateSidebarItems } = useAppSidebar()

// Keep sidebarItems in sync with the useAppSidebar composable
watchEffect(() => {
  if (props.sidebarItems) {
    updateSidebarItems(props.sidebarItems)
  }
})
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.logo-title {
  display: none;
  padding-left: 16px;

  @media (min-width: $viewport-sm) {
    display: flex;
  }
}

.sidebar-header-logo {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: $navbar-height;

  > a {
    display: flex;
    align-items: center;
    width: 100%;
    text-decoration: none;

    .konnect-logo {
      display: flex;
      padding-left: 16px;
    }
  }
}
</style>
