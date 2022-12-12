<template>
  <AppLayout>
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
      <!-- <AppError v-if="hideAppShellDefaultSlot">
        <h2>Error: Konnect App Shell</h2>
        <p>This is an error from KonnectAppShell.</p>
      </AppError> -->
      <slot name="app-error" />
    </template>

    <slot name="default" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, provide, onBeforeMount, readonly, PropType } from 'vue'
import { AppLayout, GruceLogo, KonnectLogo, symbolInjectionKeys } from '@kong-ui/app-layout'
import type { SidebarPrimaryItem, SidebarSecondaryItem } from '@kong-ui/app-layout'
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

      return !!sidebarItems.items?.every((item: SidebarSecondaryItem) => item.name && item.to)
    },
    required: false,
  },
})

const topLevelSidebarItems = computed(() => {
  const topLevelItems: SidebarPrimaryItem[] = [
    {
      name: 'Overview',
      key: 'overview',
      to: '/',
      external: true,
      icon: 'sharedConfig',
    },
    {
      name: 'Runtime Manager',
      key: 'runtime-manager',
      to: '/runtime-manager',
      external: true,
      icon: 'runtimes',
    },
    {
      name: 'Mesh Manager',
      key: 'mesh-manager',
      to: '/mesh-manager',
      external: true,
      icon: 'brain',
    },
  ]

  if (props.sidebarItems && props.sidebarItems.parentKey) {
    topLevelItems.map((item: SidebarPrimaryItem) => {
      // If the item.key equals the sidebarItems.parentKey
      if (item.key === props.sidebarItems.parentKey) {
        // Set active state
        item.active = true

        // If secondary sidebar items are present
        if (props.sidebarItems.items?.length) {
          // Set secondary items
          item.items = props.sidebarItems.items
          // Set expanded state
          item.expanded = true
          // Set external to false since we know it's the same app
          item.external = false
        }
      } else {
        // Set active and expanded to false since the parentKey doesn't match
        item.active = false
        item.expanded = false
      }

      return item
    })
  }

  return topLevelItems
})
const hideAppShellDefaultSlot = ref(false)
const { appLayoutHideDefaultSlot, appSidebarTopItems } = symbolInjectionKeys

// Wrap in readonly to prevent mutation in the inject component
provide(appSidebarTopItems, readonly(topLevelSidebarItems))
provide(appLayoutHideDefaultSlot, readonly(hideAppShellDefaultSlot))

onBeforeMount(() => {
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
