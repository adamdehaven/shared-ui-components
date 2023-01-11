<template>
  <AppLayout
    :navbar-hidden="hideNavbar"
    :sidebar-bottom-items="!hideSidebar ? bottomItems : undefined"
    :sidebar-hidden="hideSidebar"
    :sidebar-profile-items="!hideSidebar ? profileItems : undefined"
    :sidebar-profile-name="!hideSidebar ? 'App User' : undefined"
    :sidebar-top-items="!hideSidebar ? topItems : undefined"
  >
    <template #notification>
      <slot name="notification" />
    </template>
    <template #navbar>
      <a
        v-if="hideSidebar"
        class="navbar-full-logo"
        href="/"
      >
        <GruceLogo />
        <div class="logo-title">
          <KonnectLogo theme="light" />
        </div>
      </a>
      <slot name="navbar" />
      &nbsp;
      <div class="top-right-container">
        <GeoSwitcher
          global
        />
      </div>
    </template>
    <template #navbar-mobile-logo>
      <a href="/">
        <GruceLogo />
        <div
          class="logo-title"
          :class="{ 'sidebar-is-hidden': hideSidebar }"
        >
          <KonnectLogo theme="light" />
        </div>
      </a>
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

    <KSkeleton
      v-if="state.loading"
      data-testid="global-loading-skeleton"
      hide-progress
      :style="{ zIndex: 1 }"
      type="fullscreen-kong"
    />

    <GlobalError
      v-if="state.error.show"
      :header="state.error.header"
      :text="state.error.text"
      :trace-id="state.error.traceId"
    >
      <slot name="error" />
    </GlobalError>

    <GeoSelectForm
      v-else-if="!state.activeGeo"
      @select="geoSelected"
    />

    <template v-if="!hideAppContent">
      <router-view />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect, PropType, onBeforeMount, nextTick } from 'vue'
import { AppLayout } from '@kong-ui/app-layout'
import { GruceLogo, KonnectLogo } from './icons'
import type { SidebarSecondaryItem } from '@kong-ui/app-layout'
import { useWindow } from '@kong-ui/core'
import composables from '../composables'
import { GLOBAL_GEO_NAME } from '../constants'
import type { KonnectAppShellSidebarItem, Geo, KonnectAppShellState, SessionData, ErrorProp } from '../types'
import GeoSelectForm from './forms/GeoSelectForm.vue'
import GlobalError from './errors/GlobalError.vue'
import '@kong-ui/app-layout/dist/style.css'
import GeoSwitcher from './GeoSwitcher.vue'

const { useSession, useAppSidebar, useGeo, useI18n, useKAuthApi } = composables
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
  // Show or hide the fullscreen loading state
  loading: {
    type: Boolean,
    default: false,
  },
  // Show or hide the error state
  error: {
    type: Object as PropType<ErrorProp>,
    // Should always default to show = false and empty values
    default: (): ErrorProp => ({
      show: false,
      header: '',
      text: '',
      traceId: '',
    }),
  },
})

const emit = defineEmits<{
  (e: 'ready'): void,
  (e: 'update:active-geo', geo: Geo | undefined): void,
  (e: 'update:error', error: { show: boolean, header?: string, text?: string }): void,
  (e: 'update:loading', isLoading: boolean): void,
  (e: 'update:session', session: SessionData | undefined): void,
}>()

const state: KonnectAppShellState = reactive({
  activeGeo: undefined,
  loading: true, // Show the global loader UI. Initial value should be `true`
  error: {
    show: false, // Show the global error UI. Initial value should be `false`
    header: '',
    text: '',
    traceId: '',
  },
})

const { i18n: { t } } = useI18n()

const hideNavbar = computed((): boolean => (props.navbarHidden || state.loading || !state.activeGeo) && !state.error.show)
const hideSidebar = computed((): boolean => {
  if (props.sidebarHidden || state.loading || !state.activeGeo) {
    return true
  }

  if (state.activeGeo?.code && state.error.show) {
    return false
  }

  return false
})

const toggleErrorState = (show: boolean, header: string, text?: string, traceId?: string): void => {
  state.error.header = header
  state.error.text = text || ''
  state.error.traceId = traceId || ''
  state.error.show = show
}

// Determine if the app content should be hidden if any of the following are true:
// - state.loading is true
// - state.error.show is true
// - state.activeGeo has not been determined
const hideAppContent = computed((): boolean => state.loading || state.error.show || !state.activeGeo)

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

// Create a ref that when true, allows component props to override the local state.
// Should not be set to true until the internal component logic has completed.
const allowPropOverrides = ref(false)

// If allowPropOverrides changes to true, check the default prop values
watch(allowPropOverrides, (allowed: boolean) => {
  if (allowed) {
    if (props.loading) {
      state.loading = props.loading
    }
    if (props.error.show && props.error.header && props.error.text) {
      state.error = props.error
    }
  }
})

// Watch the prop values and update the internal state when changed, only if `allowPropOverrides` is true
watchEffect(() => {
  if (allowPropOverrides.value) {
    state.loading = props.loading
    state.error = props.error
  }
})

// Emit the loading state from the component whenever it is updated
watch(() => state.loading, (isLoading: boolean) => {
  emit('update:loading', isLoading)
})

// Emit the loading state from the component whenever it is updated
watch(() => state.error, () => {
  emit('update:error', state.error)
}, { deep: true })

// Set the active geo
const geoSelected = (geo: Geo): void => {
  // Initialize loader
  state.loading = true

  // Set the state.activeGeo
  state.activeGeo = geo

  // Store the activeGeo in localStorage
  setActiveGeo(state.activeGeo?.code)

  let currentPath = win.getLocationPathname()
  const potentialGeoCode = currentPath.split('/')[1]

  // If the "geo" is set to global, just disable the loader and exit early
  if (potentialGeoCode === GLOBAL_GEO_NAME) {
    state.loading = false

    return
  }

  // If the geo is already in the URL (unlikely) just refresh the page
  if (potentialGeoCode === state.activeGeo.code) {
    win.setLocationReplace(currentPath)

    return
  }

  // Likely an invalid geo in the path, so remove it
  if (potentialGeoCode.length === 2 && potentialGeoCode !== state.activeGeo.code) {
    currentPath = currentPath.replace(`/${potentialGeoCode}`, '')
  }

  // Redirect the user
  win.setLocationReplace(`/${state.activeGeo?.code}${currentPath}`)
}

const { init: initializeKAuth, error: kauthInitError } = useKAuthApi()
const { initializeSession, session } = useSession()

watch(session, (sessionData: SessionData | undefined) => {
  if (sessionData) {
    emit('update:session', sessionData)
  }
})

onBeforeMount(async () => {
  // Initialize the KAuth client. This must be done before ALL other requests.
  // This will also fetch the `kong-ui/config`
  await initializeKAuth()

  // If there is an error fetching the app config, show the error UI
  if (kauthInitError.value) {
    toggleErrorState(true, t('errors.app_config.header'), t('errors.app_config.text'))
    state.loading = false

    return
  }

  // Attempt to init the session data.
  // This should ONLY be called once, within the onBeforeMount hook
  const { forceAuthentication, error: sessionError } = await initializeSession()

  if (forceAuthentication?.value) {
    // App is redirecting to `/login?logout=true`, exit early
    return
  }

  // If there is an error fetching the session data, show the error UI
  if (sessionError.value) {
    toggleErrorState(true, t('errors.session.data.header'), t('errors.session.data.text'))
    state.loading = false

    return
  }

  // You must always first set the array of available geos from the API
  setAllGeos(session.value?.organization?.entitlements?.regions || [])

  // Try to initialize the active region (do not pass any param values here, the function will try to determine the region)
  setActiveGeo()
  // Try to retrieve the activeGeo
  state.activeGeo = getActiveGeo({ allowOverride: false })

  // If geo not set, show region selection UI from Konnect App Shell
  if (!state.activeGeo?.code) {
    // Clear the loading state which will display the geo selection form by default if state.activeGeo is not set
    state.loading = false

    // Allow the component props to now override the loading state, if needed
    allowPropOverrides.value = true

    // Exit early
    return
  }

  // Check if the known geo is in the URL; if not, take existing path and add the geo, then redirect
  const currentPath = win.getLocationPathname()
  const pathArray = currentPath?.split('/')
  // If the activeGeo or `global` is not in the URL, redirect the user to the root active geo with the existing path
  if (pathArray.length > 1 && state.activeGeo?.code && (pathArray[1] !== state.activeGeo.code && pathArray[1] !== GLOBAL_GEO_NAME)) {
    win.setLocationReplace(`/${state.activeGeo.code}${currentPath}`)

    // We sent the user to a new page; exit early
    return
  }

  // Allow the component props to now override the local state, if needed
  allowPropOverrides.value = true

  // Clear the local loading state to allow showing the default slot content (unless a prop value is overriding)
  state.loading = false

  // Await a tick to allow for a DOM refresh
  await nextTick()

  await new Promise((resolve) => setTimeout(resolve, 500))

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

  &.sidebar-is-hidden {
    display: flex;
  }

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

// This logo only displays when the sidebar is hidden because of an error
.navbar-full-logo {
  display: none;
  align-items: center;

  @media (min-width: $viewport-md) {
    display: flex;
  }
}
.top-right-container {
  display: flex;
  align-items: center;
}
</style>
