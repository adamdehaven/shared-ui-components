# @kong-ui/sidebar

A Kong UI dynamic sidebar component.

- [Features](#features)
- [Requirements](#requirements)
- [Usage](#usage)
  - [Install](#install)
- [`SidebarNav.vue`](#sidebarnavvue)
  - [Props](#props)
  - [Slots](#slots)
  - [Events](#events)
  - [Mobile sidebar](#mobile-sidebar)
  - [Usage example](#usage-example)
- [`SidebarToggle.vue`](#sidebartogglevue)
  - [Props ](#props-1)
  - [Events ](#events-1)
  - [Usage example ](#usage-example-1)
- [CSS Variables](#css-variables)
  - [CSS variable example](#css-variable-example)
- [TypeScript interfaces](#typescript-interfaces)

## Features

- Reactive updates based on `prop` value changes :rocket:
- Completely customizable L1 and L2 navigation items
- Built-in support for user Profile (in the sidebar footer) and profile dropdown items
- Navigate via `<router-link>` in your host application, or provide regular URLs :link:
- Slottable `header` area for displaying the host application logo
- Included `SidebarToggle.vue` component utilized separately in the Navbar to toggle the sidebar's visibility on mobile :sparkles:

![sidebar component example from Konnect](./docs/sidebar.png)

## Requirements

- `vue` and `vue-router` must be initialized in the host application
- `@kong/kongponents` must be available in the host application, along with the package style imports. [See here for instructions on installing Kongponents](https://kongponents.konghq.com/#globally-install-all-kongponents). Specifically, the following Kongponents must be registered and globally available in the host application:
  - `KDropdownItem`
  - `KDropdownMenu`
  - `KIcon`
  - `KTooltip`
- The sidebar is set to `position: fixed` and is expected to render at 100% of the viewport height. This means your Navbar, etc. should never be placed above the sidebar unless on mobile.
- If L2 sidebar items have required `route.params` in their route, they must be properly declared in the `item.to` property. Example:

    ```ts
    // Note: `currentRoute` equates to router.currentRoute and must be passed in to the consuming app's route generator
    {
      name: 'Runtime Manager',
      key: 'runtime-manager',
      to: { name: 'runtime-manager' },
      icon: 'runtimes',
      // Require the 'runtime-manager' page to be active and expanded to render the L2 items
      items: active('runtime-manager') && !!String(currentRoute?.params.control_plane_id || '') && [
        {
          name: 'Runtime Instances',
          to: {
            name: 'runtime-instances',
            // Required route params MUST be declared
            params: {
              control_plane_id: currentRoute?.params.control_plane_id
            }
          },
        },
      ],
    },
    ```

## Usage

### Install

Install the component in your host application

```sh
yarn add @kong-ui/sidebar
```

## `SidebarNav.vue`

You will likely want to utilize a wrapper component in your application, so import the `SidebarNav` component and the package styles into your wrapper component.

You will also need to utilize a factory function (e.g. a composable) in order to generate and update your menu items.

### Props

#### `topItems`

- type: `Array as PropType<SidebarPrimaryItem[]>`
- required: `false`
- default: `[]`

An array of `SidebarPrimaryItem` objects to display in the top navigation list (above the divider).

#### `bottomItems`

- type: `Array as PropType<SidebarPrimaryItem[]>`
- required: `false`
- default: `[]`

An array of `SidebarPrimaryItem` objects to display in the bottom navigation list (below the divider).

#### `profileItems`

- type: `Array as PropType<SidebarProfileItem[]>`
- required: `false`
- default: `[]`

An array of `SidebarProfileItem` objects to display in the sidebar footer profile popup menu.

#### `profileName`

- type: `string`
- required: `false`
- default: `''`

A string to display in the sidebar footer profile area.

#### `headerHeight`

- type: `number`
- required: `false`
- default: `60`

The height of the sidebar `header` slot, in pixels.

The `headerHeight` should be set to the same height as the host application's navbar element, if applicable.

#### `zIndex`

- type: `number`
- required: `false`
- default: `2`

Set the `z-index` of the fixed sidebar.

#### `open`

- type: `boolean`
- required: `false`
- default: `false`

Set to `true` when the mobile sidebar should be open.

#### `mobileEnabled`

- type: `boolean`
- required: `false`
- default: `false`

Set to `true` to enable the sidebar from being automatically hidden off-screen on mobile (requiring you to utilize the `SidebarToggle.vue` component to hide/show the sidebar).

#### `mobileTopOffset`

- type: `number`
- required: `false`
- default: `0`

The number of pixels to offset the sidebar from the top on mobile (viewport width less than `768px`). The `mobileTopOffset` should be set to the same height as the host application's navbar element, if applicable.

When omitted, or the browser viewport is `768px` or greater, the sidebar has a `top` offset of `0px`.

This is useful when your app has a navbar on mobile that appears above the sidebar.

#### `mobileHeaderVisible`

- type: `boolean`
- required: `false`
- default: `false`

Used to determine whether to show or hide the `header` slot on mobile. The `header` slot is hidden by default on mobile.

This is useful if your mobile navbar already displays the app logo.

If you still want to show the sidebar `header` slot even on mobile, set `mobileHeaderVisible` to `true`.

#### `mobileCloseDelay`

- type: `number`
- required: `false`
- default: `350`

The delay, in milliseconds, to wait before automatically closing the mobile sidebar when an `item` is clicked.

#### `mobileOverlay`

- type: `boolean`
- required: `false`
- default: `true`

Show a fixed overlay over the body content when the mobile sidebar is open. To disable the overlay, set to `false`.

#### `mobileOverlayZIndex`

- type: `number`
- required: `false`
- default: `1`

Set the `z-index` of the overlay that is shown behind the mobile sidebar, over the content, when the sidebar is open.

#### `mobileOverlayCloseOnClick`

- type: `boolean`
- required: `false`
- default: `true`

Close the mobile sidebar when a user clicks on the sidebar overlay.

### Slots

#### `header`

Utilize the `header` slot to inject your application's logo into the top of the sidebar, above the `topItems`.

### Events

#### `click`

A `@click` event is emitted whenever an `item` in the sidebar is clicked.

The `click` event emits a payload of the `item` that was clicked, along with its attributes and children, if applicable.

#### `toggle`

A `@toggle` event is emitted whenever the sidebar is opened or closed.

The `toggle` event emits a payload of a `boolean` to indicate if the sidebar is open.

### Mobile sidebar

To utilize the mobile version of the sidebar included in the component, you must set the `mobileEnabled` prop to `true` and utilize the `SidebarToggle.vue` component. [Examples can be found below](#sidebartogglevue).

The mobile sidebar will automatically close on `route.path` or `route.query` change only if your app imports the `useRoute()` helper directly from `vue-router` as shown here:

```ts
import { useRoute } from 'vue-router'
```

If your app uses a different import, like `khcp-ui` from a custom composable, then the app must handle closing the mobile sidebar when the route object changes. Here's an example:

```ts
import { ref, watch } from 'vue'
import composables from './composables'

const route = composables.useRoute()
const mobileSidebarOpen = ref<boolean>(false)

watch(() => route.path, (newPath, oldPath) => {
  // If the path didn't change, there's no need to refresh the nav
  if (newPath !== oldPath) {
    // Close the mobile sidebar if it's open
    if (mobileSidebarOpen.value) {
      mobileSidebarOpen.value = false
    }
  }
})
```

### Usage example

<details>

<summary>:sparkles: Click to view the expanded usage example :sparkles:</summary>

#### `LayoutWrapper.vue`

> Note: This example contains the `mobile-enabled` prop which requires utilizing the [`SidebarToggle.vue`](#sidebartogglevue) component as well. If your application does not want to have a responsive sidebar, you can exclude this prop (not recommended).

```html
<template>
  <SidebarNav
    :header-height="60"
    :top-items="topItems"
    :bottom-items="bottomItems"
    :profile-items="profileItems"
    :header-height="60"
    mobile-enabled
    :mobile-top-offset="60"
    :mobile-header-visible="false"
    profile-name="Marty McFly"
    @click="activateSidebarItem"
  >
    <template #header>
      <div class="d-flex w-100 align-items-center">
        <router-link :to="{ name: 'home' }">
          <img src="my-logo.svg" />
        </router-link>
      </div>
    </template>
  </SidebarNav>
</template>

<script setup lang="ts">
import { watch, onBeforeMount } from 'vue'
// SidebarNav Component and types
import { SidebarNav, SidebarPrimaryItem, SidebarSecondaryItem, SidebarProfileItem } from '@kong-ui/sidebar'
import { RouteRecordRedirectOption, useRoute, useRouter } from 'vue-router'
import useSidebar from '../composables/useSidebar'
// Sidebar component styles
import '@kong-ui/sidebar/dist/style.css'

const { updateMenu, topItems, bottomItems, profileItems } = composables.useSidebar()
const router = useRouter()
const route = useRoute()

// Update the sidebar menu when the route.path changes
watch(
  () => route.path,
  (newPath, oldPath) => {
    // If the path didn't change, there's no need to refresh the nav
    if (newPath !== oldPath) {
      // Important: Update up the menu to properly render the sidebar items on route change
      updateMenu(route)
    }
  },
)

const activateSidebarItem = (item: SidebarPrimaryItem | SidebarSecondaryItem | SidebarProfileItem) => {
  if (typeof item?.to === 'object') {
    try {
      // Try to resolve the route based on the `item.to` property.
      // If unsuccessful, the catch will fire and we will fallback to allowing the `route.path` watcher handle the update
      const clickedRoute = router.resolve(item.to)

      // Get the full clickedRoute route config (to check its `redirect` property)
      const redirect: RouteRecordRedirectOption | undefined = router.getRoutes().find(route => route.name === clickedRoute.name)?.redirect

      let shouldUpdateMenu = true

      if (typeof redirect === 'object') {
        // If `redirect` is an object and the clickedRoute.name is the same as the redirect.name, return false to prevent updating the menu
        shouldUpdateMenu = (redirect as Record<string, any>).name && (redirect as Record<string, any>).name !== router.currentRoute.value.name
      } else if (typeof redirect === 'string') {
        // If `redirect` is a string and the clickedRoute.name is the same as the redirect (string, which is likely the route name), return false to prevent updating the menu
        shouldUpdateMenu = redirect !== router.currentRoute.value.name
      }

      // If a redirect property exists
      if (shouldUpdateMenu) {
        // Pass true here to allow for the route change to still be evaluated
        updateMenu(clickedRoute)
      }
    } catch (err) {
      // do nothing, fallback to the `route.path` watcher to update the menu
    }
  }
}

onBeforeMount(() => {
  updateMenu(route)
})
</script>
```

#### `useSidebar.ts`

```ts
import { ref } from 'vue'
import { SidebarPrimaryItem, SidebarProfileItem } from '@kong-ui/sidebar'
import { RouteLocationNormalizedLoaded } from 'vue-router'

export const useSidebar = () => {
  const topItems = ref<SidebarPrimaryItem[]>([])
  const bottomItems = ref<SidebarPrimaryItem[]>([])
  const profileItems = ref<SidebarProfileItem[]>([])

  const updateMenu = (currentRoute?: RouteLocationNormalizedLoaded) => {
    // Determine if the sidebar item is active if any matched route.name evaluates to the `routeName` string passed
    const active = (routeName: string): boolean => !!currentRoute?.matched.some(({ name }) => name === routeName)

    topItems.value = [
      {
        name: 'Organizations',
        key: 'organizations',
        to: { name: 'organizations' },
        active: active('root-organizations'), // L1 active() name must point to the root parent
        icon: 'organizations',
      },
      {
        name: 'Users',
        key: 'users',
        to: { name: 'users' },
        active: active('root-users'), // L1 active() name must point to the root parent
        icon: 'profile',
      },
      {
        name: 'Control Planes',
        key: 'control-planes',
        to: { name: 'control-planes' },
        active: active('root-control-planes'), // L1 active() name must point to the root parent
        icon: 'workspaces',
      },
    ]
    // In the future, update the bottomItems and profileItems here as needed
  }

  return {
    updateMenu,
    topItems,
    bottomItems,
    profileItems,
  }
}
```

</details>

## `SidebarToggle.vue`

This package also exports a `SidebarToggle.vue` component that should be utilized in the host application's navbar in order to hide/show the Sidebar on mobile (under `768px` viewport width).

When the mobile sidebar is toggled open, a class of `kong-ui-sidebar-open` is added to the `document.body`. This is useful in order to hide `body` overflow so that only the sidebar contents is scrollable.

```scss
// Leave un-scoped to remove body overflow when the sidebar is open
body.kong-ui-sidebar-open {
  overflow-y: hidden;

  @media screen and (min-width: 768px) { // $viewport-md
    overflow-y: auto;
  }
}
```

### Props&nbsp;

#### `active`

- type: `boolean`
- required: `false`
- default: `false`

A boolean to indicate whether the toggle icon is active (meaning the mobile sidebar is open/expanded).

### Events&nbsp;

#### `toggle`&nbsp;

A `@toggle` event is emitted whenever the `active` state of the toggle component changes.

The `toggle` event emits a payload of a `boolean` to indicate if the toggle icon is active.

### Usage example&nbsp;

<details>

<summary>:sparkles: Click to view the expanded usage example :sparkles:</summary>

```html
<template>
  <header class="navbar">
    <nav>
      <SidebarToggle
        :active="mobileSidebarOpen"
        @toggle="sidebarToggled"
      />
      <router-link to="/">
        <img src="mylogo.svg" />
      </router-link>
    </nav>
  </header>
  <div class="sandbox-container">
    <SidebarNav
      :top-items="sidebarItemsTop"
      :open="mobileSidebarOpen"
      :header-height="60"
      mobile-enabled
      :mobile-top-offset="60"
      :mobile-header-visible="false"
      @click="sidebarItemClick"
      @toggle="sidebarToggled"
    >
      <template #header>
        <div class="kong-logo d-flex w-100">
          <router-link to="/">
            <img src="my-logo.svg" />
          </router-link>
        </div>
      </template>
    </SidebarNav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SidebarNav, SidebarToggle, SidebarPrimaryItem } from '../src'

const sidebarItemClick = (item: SidebarPrimaryItem): void => {
  // Do something
  console.log('item: %o', item)
}

const mobileSidebarOpen = ref(false)
const sidebarToggled = (isOpen: boolean) => {
  mobileSidebarOpen.value = isOpen
}
</script>

<style lang="scss">
// Leave un-scoped to remove body overflow when the sidebar is open
body.kong-ui-sidebar-open {
  overflow-y: hidden;

  @media screen and (min-width: 768px) { // $viewport-md
    overflow-y: auto;
  }
}
</style>
```

</details>

## CSS Variables

You can customize some of the sidebar CSS by adding CSS variables to your app. In most use-cases, this shouldn't be necessary.

Variable | Description | Default
---------|----------|---------
`--kong-ui-sidebar-width` | The width of the sidebar | `240px`
`--kong-ui-sidebar-mobile-icon-color` | The color of the "lines" of the mobile menu icon | `#1155cb`

### CSS variable example

```scss
.your-app-container-class {
  --kong-ui-sidebar-width: 300px;
}
```

## TypeScript interfaces

TypeScript interfaces [are available here](https://github.com/Kong/ui-shared-components/blob/main/packages/sidebar/src/types/index.ts) and can be directly imported into your host application. The following type interfaces are available for import:

```ts
import type { SidebarPrimaryItem, SidebarSecondaryItem, SidebarProfileItem } from '@kong-ui/sidebar'
```
