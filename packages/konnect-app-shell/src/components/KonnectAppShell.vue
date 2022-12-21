<template>
  <AppLayout
    :navbar-hidden="state.hideNavbar"
    :sidebar-bottom-items="!state.hideSidebar ? bottomItems : undefined"
    :sidebar-hidden="state.hideSidebar"
    :sidebar-profile-items="!state.hideSidebar ? profileItems : undefined"
    :sidebar-profile-name="!state.hideSidebar ? 'App User' : undefined"
    :sidebar-top-items="!state.hideSidebar ? topItems : undefined"
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

    <KSkeleton
      v-if="state.loading"
      data-testid="global-loading-skeleton"
      hide-progress
      :style="{ zIndex: 1 }"
      type="fullscreen-kong"
    />

    <GlobalError
      v-if="state.error"
      :header="state.errorMessage.header"
      :text="state.errorMessage.text"
    />

    <GeoSelectForm
      v-else-if="!state.activeGeo"
      @select="geoSelected"
    />

    <template v-if="!hideDefaultSlot">
      <router-view />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect, PropType, onBeforeMount, nextTick } from 'vue'
import { AppLayout, GruceLogo, KonnectLogo } from '@kong-ui/app-layout'
import type { SidebarSecondaryItem } from '@kong-ui/app-layout'
import { useWindow, createI18n } from '@kong-ui/core'
import { useAppShellConfig, useSession, useAppSidebar, useGeo } from '../composables'
import { AVAILABLE_GEOS } from '../constants'
import type { KonnectAppShellSidebarItem, Geo, KonnectAppShellState } from '../types'
import GeoSelectForm from './forms/GeoSelectForm.vue'
import GlobalError from './errors/GlobalError.vue'
import english from '../locales/en.json'
import '@kong-ui/app-layout/dist/style.css'

const props = defineProps({
  // Provide the secondary sidebar items that should be injected into the top-level primary item with the corresponding `parentKey`
  sidebarItems: {
    type: Object as PropType<KonnectAppShellSidebarItem>,
    default: () => ({}),
    validator: (sidebarItems: KonnectAppShellSidebarItem): boolean => {
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
  navbarHidden: {
    type: Boolean,
    default: false,
  },
  sidebarHidden: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'update:active-geo', geo: Geo | undefined): void,
  (e: 'update:loading', isLoading: boolean): void,
  (e: 'update:error', hasError: boolean): void,
  (e: 'ready'): void,
}>()

const { t } = createI18n('en-us', english)

const state: KonnectAppShellState = reactive({
  loading: true, // Show the global loader. Initial value should be `true`
  error: false,
  errorMessage: {
    header: '',
    text: '',
  },
  activeGeo: undefined,
  hideNavbar: computed((): boolean => (props.navbarHidden || state.loading || !state.activeGeo) && !state.error),
  hideSidebar: computed((): boolean => {
    if (props.sidebarHidden || state.loading || !state.activeGeo) {
      return true
    }

    if (state.activeGeo?.code && state.error) {
      return false
    }

    return false
  }),
})

// Determine if the default slot should be hidden
// The default slot should always be hidden if any of the following are true:
// - state.loading is true
// - state.error is true
// - state.activeGeo has not been determined
const hideDefaultSlot = computed((): boolean => state.loading || state.error || !state.activeGeo)

const win = useWindow()
const { topItems, bottomItems, profileItems, update: updateSidebarItems } = useAppSidebar()
const { setAllGeos, setActiveGeo, getActiveGeo } = useGeo()

// Keep sidebarItems in sync with the useAppSidebar composable
watchEffect(() => {
  if (props.sidebarItems) {
    updateSidebarItems(props.sidebarItems)
  }
})

// Emit the active geo from the component whenever it is updated
watch(() => state.activeGeo, (activeGeo: Geo | undefined) => {
  emit('update:active-geo', activeGeo)
}, { deep: true })

// Create a ref that when true, allows the component prop to override the loading state.
// Should not be set to true until the internal component logic has completed.
const allowLoadingOverride = ref(false)

// If allowLoadingOverride changes to true, check the default prop value
watch(allowLoadingOverride, (allowed: boolean) => {
  if (allowed && props.loading) {
    state.loading = props.loading
  }
})

watch(() => props.loading, (isLoading: boolean) => {
  if (allowLoadingOverride.value) {
    state.loading = isLoading
  }
}, { immediate: true })

// Emit the loading state from the component whenever it is updated
watch(() => state.loading, (isLoading: boolean) => {
  emit('update:loading', isLoading)
})

// Emit the loading state from the component whenever it is updated
watch(() => state.error, (hasError: boolean) => {
  emit('update:error', hasError)
})

// Set the active geo
const geoSelected = (geo: Geo): void => {
  state.activeGeo = geo
  // Store the activeGeo in localStorage
  setActiveGeo(state.activeGeo?.code)

  let currentPath = win.getLocationPathname()
  const potentialGeoCode = currentPath.split('/')[1]

  // If the geo is already in the URL (unlikely) just refresh the page
  if (potentialGeoCode === state.activeGeo.code) {
    win.setLocationHref(currentPath)

    return
  }

  // Likely an invalid geo in the path, so remove it
  if (potentialGeoCode.length === 2 && potentialGeoCode !== state.activeGeo.code) {
    currentPath = currentPath.replace(`/${potentialGeoCode}`, '')
  }

  // Redirect the user
  win.setLocationHref(`/${state.activeGeo?.code}${currentPath}`)
}

const { fetch: fetchAppShellConfig } = useAppShellConfig()

onBeforeMount(async () => {
  // Always first: fetch the app config
  const { config, error: appConfigError } = await fetchAppShellConfig()

  // If there is an error fetching the app config, show the error UI
  if (appConfigError.value) {
    state.errorMessage.header = t('errors.app_config.header')
    state.errorMessage.text = t('errors.app_config.text')
    state.error = true
    state.loading = false

    return
  }

  const { fetch: fetchSessionData } = useSession(config.value?.api.v1.kauth)

  // @ts-ignore
  const { session } = await fetchSessionData()
  console.log('session', session.value)

  // You must always first set the array of available geos from the API
  // TODO: This should be replaced by the response from via `/organizations/me/entitlements`
  setAllGeos(AVAILABLE_GEOS)

  // Try to initialize the active region (do not pass any param values here, the function will try to determine the region)
  setActiveGeo()
  // Try to retrieve the activeGeo
  state.activeGeo = getActiveGeo({ allowOverride: false })

  if (!state.activeGeo?.code) {
    console.log('Geo not set, show region selection UI from Konnect App Shell')
    // Clear the loading state which will display the geo selection form by default if state.activeGeo is not set
    state.loading = false

    // Allow the component props to now override the loading state, if needed
    allowLoadingOverride.value = true

    // Exit early
    return
  }

  // Check if the known geo is in the URL; if not, take existing path and add the geo, then redirect
  const currentPath = win.getLocationPathname()
  const pathArray = currentPath?.split('/')
  // If the activeGeo is not in the URL, redirect the user to the root active geo with the existing path
  if (pathArray.length > 1 && state.activeGeo?.code && pathArray[1] !== state.activeGeo.code) {
    win.setLocationHref(`/${state.activeGeo.code}${currentPath}`)

    // We sent the user to a new page; exit early
    return
  }

  // Clear the loading state to allow showing the default slot content
  state.loading = false

  // Await a tick to allow for a DOM refresh
  await nextTick()

  await new Promise((resolve) => setTimeout(resolve, 500))

  // Allow the component props to now override the loading state, if needed
  allowLoadingOverride.value = true

  console.log('konnect app shell ready')

  // Emit a ready event - this should ALWAYS be last
  emit('ready')
})
</script>

<script lang="ts">
export default {
  // Must set to false to prevent prop and attribute inheritence on the AppShell component
  inheritAttrs: false,
}
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
