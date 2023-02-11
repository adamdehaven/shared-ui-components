# @kong-ui/konnect-app-shell

The all-in-one wrapper component for Konnect UI microfrontend applications.

- [Features](#features)
- [Requirements](#requirements)
  - [General requirements](#general-requirements)
  - [Required Router Configuration](#required-router-configuration)
  - [Evaluating Permissions](#evaluating-permissions)
  - [Evaluating Feature Flags](#evaluating-feature-flags)
- [Usage](#usage)
  - [Install](#install)
  - [Props](#props)
  - [Slots](#slots)
  - [Events](#events)
  - [Utility functions](#utility-functions)
  - [Usage example](#usage-example)
- [TypeScript interfaces](#typescript-interfaces)
- [Other Components](#other-components)
  - [AuthValidate](#authvalidate)
  - [GeoSwitcher](#geoswitcher)
  - [GruceLogo](#grucelogo)
  - [KonnectLogo](#konnectlogo)
  - [KonnectEnterpriseLogo](#konnectenterpriselogo)

## Features

- Provides the following UI:
  - Konnect navbar with global search, region selection, and help menu
  - Konnect sidebar with pre-configured logo, top-level navigation and profile menu. Also allows the host application to provide its own dynamic secondary sidebar navigation
  - Main content area
  - Konnect Region selection form
  - Global error state
- Provides the following data and/or utilities:
  - User and organization session data, as well as a method which allows a host app to `destroy` the active session.
  - [Permissions fetching and evaluation](#evaluating-permissions) via the `canUserAccess` and `userIsAuthorizedForRoute` utilities and the provided `AuthValidate` component
  - Active Konnect region
  - Route generator utility function (see the [Router configuration](#router-configuration) docs)
  - Fetching feature flags and a utility function `evaluateFeatureFlag` to utilize in your host application
- Pre-configured [Router configuration](#router-configuration), including geo-aware routes, global routes, and 404 error handling
- [Slottable content](#slots), including global notifications
- Error boundary and automatic logging to DataDog (if no child component catches the error)
- Full TypeScript support
- Interactive development sandbox

## Requirements

### General requirements

- The `<KonnectAppShell />` component **must** be the **only** content of the `App.vue` entry file `<template>` tag in the host application. A single `<router-view />` child element is **already included** in the component.
- `vue` and `vue-router` must be initialized in the host application
- `@kong/kongponents` must be available as a `dependency` in the host application and registered globally, along with the Kongponents style import. [See here for instructions on installing Kongponents](https://kongponents.konghq.com/#globally-install-all-kongponents).
- The host application **must** keep this package reasonably up-to-date.
- The host application should **only** utilize the permissions helpers provided by this package (i.e. `canUserAccess` and `userIsAuthorizedForRoute` utilities and `AuthValidate` component)

### Required Router Configuration

[Read more about the router configuration requirements here.](docs/router.md)

### Evaluating Permissions

[Read more about the requirements around evaluating permissions here.](docs/permissions.md)

### Evaluating Feature Flags

[Read more about evaluating Launch Darkly feature flags here.](docs/feature-flags.md)

## Usage

> :sparkles: If you scaffolded your host application with [the CLI via the `Kong/konnect-ui-apps` repository](https://github.com/Kong/konnect-ui-apps/blob/main/docs/creating-an-app.md#required-use-the-provided-cli-to-scaffold-your-new-app), you can skip the Install instructions :sparkles:

### Install

Install the component in your host application

```sh
yarn add @kong-ui/konnect-app-shell

# OR

pnpm --filter="@kong-ui/konnect-app-{name}" add @kong-ui/konnect-app-shell
```

#### Vue Plugin Installation

You **must** initialize the component as a plugin within your host application's entry file (e.g. `main.ts`) to make the component globally available. Don't forget to also import the styles from `@kong-ui/konnect-app-shell/dist/style.css` as included below:

```ts
// main.ts
import { createApp } from 'vue'
// App imports
import App from '@/App.vue'
import router from '@/router'
// Package imports
import KonnectAppShell, { AuthValidate } from '@kong-ui/konnect-app-shell'
import Kongponents from '@kong/kongponents'

// Import global styles
import '@kong-ui/konnect-app-shell/dist/style.css' // Don't forget the packaged component styles!
import '@kong/kongponents/dist/style.css'

const app = createApp(App)

// Initialize the router
app.use(router)

// Initialize Vue Plugins
app.use(Kongponents)
app.use(KonnectAppShell)

// Initialize global component(s)
app.component('AuthValidate', AuthValidate)

// Mount the app
app.mount('#app')
```

---

### Props

#### `sidebarItems`

- type: `Object as PropType<KonnectAppShellSidebarItem>`
- required: `false`
- default: `{}`

An object, matching the `KonnectAppShellSidebarItem` interface ([click here to view the current interface](src/types/sidebar.ts)):

```ts
interface KonnectAppShellSidebarItem {
  /** Unique key (string) of the secondary item's top-level navigation parent item */
  parentKey: KonnectPrimaryRouteKey
  /** The optional label to show under the primary navigation item's name when the item is expanded */
  label?: string
  /** The host app's secondary sidebar navigation items that should be injected into the top-level primary sidebar item with the corresponding `parentKey` */
  items?: SidebarSecondaryItem[]
}
```

#### `navbarHidden`

- type: `Boolean`
- required: `false`
- default: `false`

When `true`, removes the navbar element from the DOM.

#### `sidebarHidden`

- type: `Boolean`
- required: `false`
- default: `false`

When `true`, removes the sidebar element from the DOM. Useful when displaying a fullscreen UI from within the host application.

#### `loading`

- type: `Boolean`
- required: `false`
- default: `false`

When `true`, displays the fullscreen loading UI.

#### `error`

- type: `Object as PropType<GlobalError>`
- required: `false`
- default: `{ show: false, header: '', text: '', traceId: '' }`

An object, matching the `GlobalError` interface ([click here to view the current interface](src/types/konnect-app-shell.ts)) that triggers the global error UI when `error.show` is set to `true`.

```ts
interface GlobalError {
  /** Show or hide the global error state */
  show: boolean
  /** The error header text */
  header: string
  /** The error text content */
  text: string
  /** DataDog trace id for error */
  traceId: string
}
```

---

### Slots

#### `navbar`

Utilize the `navbar` slot to inject content into the underlying `AppNavbar` component.

#### `notification`

The `notification` slot is meant to display a full-width [`KAlert` Kongponent](https://kongponents.konghq.com/components/alert.html) to show a global error above the navbar.

You can utilize host app logic to make the notification dismissable (or not). The `notification` slot does support multiple child elements.

> **Note**: Any content passed into the `notification` slot will always appear **below** any notifications injected by the `KonnectAppShell.vue` component itself, for example, the global Impersonation banner.

#### `sidebar-top`

Utilize the `sidebar-top` slot to inject content below the sidebar header, above the top sidebar items.

#### `error`&nbsp;

Utilize the `error` slot to inject content into the global error UI.

> **Note**: for this slot content to be visible, you must also set the `error.show` prop to `true`.

---

### Events

#### `ready`

The `@ready` event is emitted when the `KonnectAppShell` component has properly completed all of the following, in order:

1. Initialized the KAuth API client
1. Fetched the `kong-ui/config` JSON
1. Initialized the user session, ensuring the user is properly authenticated
1. Fetched and stored the user's top-level permissions from KAuth
1. Initialized DataDog RUM, if present
1. Initialized Launch Darkly and fetched the feature flags for the user
1. Set the active Konnect region (geo) based on the user's organization's entitled regions (and conditionally forcing the user to choose a region, if applicable)
1. Unblock props so that the host app may now control the state of the component
1. Cleared the global loading state

> **Note**: There is no payload emitted with this event.

#### Assumptions

Until the `@ready` event has been emitted, you should assume the following:

- Session data is not yet available
- Permissions have not yet been fetched
- The Konnect active region has not been determined
- The `KonnectAppShell` is overriding `props` passed by the host application (e.g. `loading`)
- Launch Darkly feature flags are not yet available for evaluation

#### `update:active-geo`

The `@update:active-geo` event is emitted when the active Konnect region (geo) is successfully determined and set, or when changed.

This event also emits a payload of the active region object, which adheres to [this `Geo` interface](src/types/geo.ts).

#### `update:session`

The `@update:session` event is emitted when the active session data is set and/or updated.

This event also emits a readonly payload of the session object, which adheres to [this `Session` interface](src/types/session.ts).

#### `update:loading`

The `@update:loading` event is emitted when the global loading state is changed.

This event also emits a `boolean` payload indicating if the global loading UI is being displayed. An emitted payload of `true` indicates the loading UI is currently being shown to the user.

#### `update:error`

The `@update:error` event is emitted when the global error state is changed.

This event also emits a payload of the `error` object, which adheres to [this `GlobalError` interface](src/types/konnect-app-shell.ts).

> **Note**: Regardless of the rest of the payload, a global error is only showing if the `error.show` property of the emitted payload is `true`.

---

### Utility functions

#### `generateRoutes`

See the documentation in the [Router Configuration Requirements](docs/router.md#use-the-generateroutes-utility).

#### `canUserAccess`

See the documentation in [Evaluating Permissions](docs/permissions.md#a-single-function-evaluates-authorization-canuseraccess).

#### `userIsAuthorizedForRoute`

See the documentation in [Evaluating Permissions](docs/permissions.md).

#### `evaluateFeatureFlag`

See the documentation in [Evaluating Feature Flags](docs/feature-flags.md).

---

### Usage example

<details>

<summary>:sparkles: Click to view the expanded usage example :sparkles:</summary>

```html
<!-- App.vue -->

<template>
  <KonnectAppShell
    :error="globalError"
    :sidebar-items="sidebarItems"
    @ready="appShellReady"
    @update:active-geo="activeGeoChanged"
    @update:session="sessionChanged"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { evaluateFeatureFlag } from '@kong-ui/konnect-app-shell'
import type { KonnectAppShellSidebarItem, Geo, Session } from '@kong-ui/konnect-app-shell'
import { useGlobalErrorStore } from '@/stores'
import { storeToRefs } from 'pinia'

const route = useRoute()

const sessionChanged = (sessionData: Session) => {
  // Update the data in the session store when emitted from KonnectAppShell
}

const activeGeoChanged = (geo: Geo) => {
  // Update the data in the geo store when emitted from KonnectAppShell
}

// Initialize the global error store
const globalErrorStore = useGlobalErrorStore()
const { error: globalError } = storeToRefs(globalErrorStore)

// Construct your app's secondary sidebar navigation items
const sidebarItems = computed((): KonnectAppShellSidebarItem | null => {
  if (!activeGeo.value) {
    return null
  }

  // Determine if the sidebar item is active if any matched route.name evaluates to the `routeName` string passed
  const active = (routeName: string): boolean => !!route?.matched.some(({ name }) => name === routeName)

  return {
    parentKey: 'runtime-manager', // KonnectPrimaryRouteKey
    label: String(route.params.service || ''), // Set the label from the sidebar store
    items: route.params.service // Only render the child items if the required route param is present
      ? [
        {
          name: 'Example Child Page',
          to: {
            name: 'service-show',
            params: {
              service: route.params.service, // Must pass any required route params
            },
          },
          active: active('service-show'),
        },
      ]
      : [],
  }
})

const appShellReady = (): void => {
  console.log('Konnect App Shell @ready event fired')

  // Example of evaluating a Feature Flag - only available once the @ready event has been emitted from KonnectAppShell
  const multiGeoEnabled: boolean = evaluateFeatureFlag('kp-14-multi-geo', false)
}
</script>
```

</details>

---

## TypeScript interfaces

TypeScript interfaces [are available here](https://github.com/Kong/shared-ui-components/blob/main/packages/core/konnect-app-shell/src/types/) and can be directly imported into your host application as needed.

```ts
import type { Session, GlobalError } from '@kong-ui/konnect-app-shell'
```

---

## Other Components

### AuthValidate

See the documentation for the `AuthValidate` component in the [docs for evaluating permissions.](docs/permissions.md#guarding-ui-with-the-authvalidate-component)

### GeoSwitcher

[See here for the documentation for the `GeoSwitcher.vue` component](docs/geo-switcher.md).

### GruceLogo

SVG, exported as a Vue component for the Kong Gruce "gorilla" logo.

### KonnectLogo

The "Konnect" Logo mark SVG.

#### Konnect Logo Props

##### `theme`

- type: `String as PropType<'light' | 'dark'>`
- required: `false`
- default: `light`

The theme of the logo.

##### `width`

- type: `String`
- required: `false`
- default: `100`

The width of the logo.

##### `height`

- type: `String`
- required: `false`
- default: `15`

The height of the logo.

### KonnectEnterpriseLogo

The Enterprise badge with gradient background.
