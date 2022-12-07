<template>
  <div class="kong-ui-konnect-app-shell">
    <div
      v-if="hasNotification"
      class="kong-ui-konnect-app-shell-notification"
    >
      <slot name="notification" />
    </div>
    <NavbarHeader :top-offset="notificationHeight">
      <template #mobile-sidebar-toggle>
        <SidebarToggle
          :active="mobileSidebarOpen"
          @toggle="sidebarToggled"
        />
      </template>
      <template #mobile-logo>
        <a
          href="/"
          class="mobile-logo"
        >
          <GruceLogo />
          <div class="logo-title">
            <KonnectLogo theme="light" />
          </div>
        </a>
      </template>
      <slot name="navbar" />
    </NavbarHeader>

    <SidebarNav
      :top-items="[{
        name: 'Mesh Manager',
        to: '/mesh-manager/',
        active: true,
        external: true,
        key: 'mesh-manager',
        icon: 'brain',
      }]"
      :header-height="navbarHeight"
      :top-offset="notificationHeight"
      mobile-enabled
      :mobile-header-visible="false"
      :mobile-top-offset="sidebarMobileTopOffset"
      :open="mobileSidebarOpen"
      @toggle="sidebarToggled"
    >
      <template #header>
        <div
          class="konnect-logo"
          data-testid="logo"
        >
          <a
            href="/"
          >
            <GruceLogo />
            <div class="konnect-header-title">
              <KonnectLogo theme="dark" />
            </div>
          </a>
        </div>
      </template>
    </SidebarNav>

    <main class="kong-ui-konnect-app-shell-main">
      <div class="kong-ui-konnect-app-shell-content">
        <slot name="default" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, useSlots } from 'vue'
import KonnectLogo from '../internal/KonnectLogo.vue'
import GruceLogo from '../internal/GruceLogo.vue'
import { SidebarNav, SidebarToggle } from '@kong-ui/sidebar'
import { NavbarHeader } from '@kong-ui/navbar'
import { useDebounce } from '@kong-ui/core'

import '@kong-ui/sidebar/dist/style.css'
import '@kong-ui/navbar/dist/style.css'

const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false,
  },
})

const mobileSidebarOpen = ref<boolean>(false)
const sidebarToggled = (isOpen: boolean): void => {
  mobileSidebarOpen.value = isOpen
}

// Update the state of the sidebar if the prop value changes
watch(() => props.sidebarOpen, (isOpen: boolean): void => {
  mobileSidebarOpen.value = isOpen
})

const navbarHeight = ref<number>(60) // set to value of $navbar-height
const notificationHeight = ref<number>(0) // initialize as zero
const sidebarMobileTopOffset = computed((): number => navbarHeight.value + notificationHeight.value)
const windowWidth = ref<number>(0)

const slots = useSlots()
const hasNotification = computed((): boolean => !!slots.notification)
const { debounce } = useDebounce()
const debouncedSetNotificationHeight = debounce((force = false): void => {
  // Only update the notificationHeight if the windowWidth changes
  if (force || (windowWidth.value !== window?.innerWidth || 0)) {
    const notificationContainer: HTMLElement | null = document?.querySelector('.kong-ui-konnect-app-shell .kong-ui-konnect-app-shell-notification')
    if (notificationContainer) {
      notificationHeight.value = notificationContainer.offsetHeight
    }
  }
}, 200)

// Add a ResizeObserver to determine when the navbar element content changes
const resizeObserver = ref<ResizeObserver>()

onMounted(() => {
  // Set the window width once the component mounts
  windowWidth.value = window?.innerWidth

  // Initially set the navbar offset, pass `true` to force it to ignore the initial width
  debouncedSetNotificationHeight(true)

  // Attach a ResizeObserver to automatically update the navbarHeight when the navbar is resized
  const notificationContainer = document?.querySelector('.kong-ui-konnect-app-shell .kong-ui-konnect-app-shell-notification')
  if (notificationContainer) {
    resizeObserver.value = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height
        if (notificationHeight.value !== height) {
          notificationHeight.value = height
        }
      }
    })
    resizeObserver.value.observe(notificationContainer)
  }

  // Adjust the navbar offset when the window is resized (do not pass true)
  window.addEventListener('resize', debouncedSetNotificationHeight)
})

onBeforeUnmount(() => {
  // Cleanup event listener(s)
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
  window.removeEventListener('resize', debouncedSetNotificationHeight)
})
</script>

<style lang="scss">
// Leave unscoped
// Importing all styles just for this entry component; any other component
// in this package should only import the `_variables.scss` file.
@import "../../styles/konnect-app-shell";
</style>

<style lang="scss" scoped>
@import "../../styles/variables";

.kong-ui-konnect-app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  font-family: $font-family-base;

  .konnect-logo {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: $navbar-height;

    > a {
      display: flex;
      align-items: center;
      width: 100%;
      text-decoration: none;
    }
  }

  .konnect-header-title {
    display: flex;
    padding-left: 16px;
  }

  :deep(.kong-ui-navbar-header) {
    .mobile-logo {
      display: flex;
      align-items: center;

      @media (min-width: $viewport-md) {
        display: none;
      }
    }

    .logo-title {
      display: none;
      padding-left: 16px;

      @media (min-width: $viewport-sm) {
        display: flex;
      }
    }
  }

  .kong-ui-konnect-app-shell-main {
    display: flex;
    flex-grow: 1;
    margin-top: var(--kong-ui-navbar-height, $navbar-height);

    @media (min-width: $viewport-md) {
      margin-left: $sidebar-width;
    }

    .kong-ui-konnect-app-shell-content {
      position: relative;
      width: 100%;
      padding: 16px;
    }
  }

  .kong-ui-konnect-app-shell-notification {
    // Modify KAlert styles
    :deep(.k-alert) {
      border-radius: 0 !important;
    }
  }
}
</style>
