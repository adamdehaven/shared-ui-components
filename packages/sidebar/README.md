# @kong-ui/sidebar

> **NOTE**: Docs are a work-in-progress

A Kong UI dynamic sidebar component.

- [Features](#features)
- [Requirements](#requirements)
- [Usage](#usage)
  - [Install](#install)
  - [Initialize](#initialize)
- [TypeScript interfaces](#typescript-interfaces)
- [Props](#props)
  - [`topItems`](#topitems)
  - [`bottomItems`](#bottomitems)
  - [`profileItems`](#profileitems)
  - [`profileName`](#profilename)
  - [`headerHeight`](#headerheight)
- [Notes](#notes)

## Features

- Reactive updates based on `prop` value changes :rocket:
- Completely customizable L1 and L2 navigation items
- Built-in support for user Profile (in the sidebar footer) and profile dropdown items
- Navigate via `<router-link>` in your host application, or provide regular URLs :link:
- Slottable `header` area for displaying the host application logo

![sidebar component example from Konnect](./docs/sidebar.png)

## Requirements

- `vue` and `vue-router` must be initialized in the host application
- `@kong/kongponents` must be available in the host application, along with the package style imports. [See here for instructions on installing Kongponents](https://kongponents.konghq.com/#globally-install-all-kongponents). Specifically, the following Kongponents must be registered and globally available in the host application:
  - `KDropdownItem`
  - `KDropdownMenu`
  - `KIcon`
  - `KTooltip`
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
      ],
    },
    ```

## Usage

### Install

Install the component in your host application

```sh
yarn add @kong-ui/sidebar
```

### Initialize

You will likely want to utilize a wrapper component in your application, so import the `SidebarNav` component and the package styles into your wrapper component.

```html
<template>
  <SidebarNav
    :top-items="sidebarItemsTop"
    :bottom-items="sidebarItemsBottom"
    :profile-items="sidebarItemsProfile"
    profile-name="Marty McFly"
    @click="activateSidebarItem"
  >
    <template #header>
      <div class="d-flex">This is my logo</div>
    </template>
  </SidebarNav>
</template>

<script setup lang="ts">
// SidebarNav Component and types
import { SidebarNav, SidebarPrimaryItem, SidebarSecondaryItem, SidebarProfileItem } from '@kong-ui/sidebar'
// Sidebar component styles
import '@kong-ui/sidebar/dist/style.css'

const activateSidebarItem = (item: SidebarPrimaryItem | SidebarSecondaryItem | SidebarProfileItem) => {
  // Do something when item is clicked
  //
  // Keep in mind you also need to handle updating the sidebar items when
  // a user navigates in the app WITHOUT interacting with the sidebar, e.g. a table row click.
}
</script>
```

## TypeScript interfaces

TypeScript interfaces [are available here](https://github.com/Kong/ui-shared-components/blob/main/packages/sidebar/src/types/index.ts) and can be directly imported into your host application. The following interfaces are available for import:

```ts
import type { SidebarPrimaryItem, SidebarSecondaryItem, SidebarProfileItem } from '@kong-ui/sidebar'
```

## Props

### `topItems`

- type: `Array as PropType<SidebarPrimaryItem[]>`
- required: `false`
- default: `[]`

An array of `SidebarPrimaryItem` objects to display in the top navigation list (above the divider).

### `bottomItems`

- type: `Array as PropType<SidebarPrimaryItem[]>`
- required: `false`
- default: `[]`

An array of `SidebarPrimaryItem` objects to display in the bottom navigation list (below the divider).

### `profileItems`

- type: `Array as PropType<SidebarProfileItem[]>`
- required: `false`
- default: `[]`

An array of `SidebarProfileItem` objects to display in the sidebar footer profile popup menu.

### `profileName`

- type: `string`
- required: `false`
- default: `''`

A string to display in the sidebar footer profile area.

### `headerHeight`

- type: `number`
- required: `false`
- default: `60`

The height of the sidebar `header` slot, in pixels.

The `headerHeight` should be set to the same height as the host application's navbar element, if applicable.

## Notes

- Document that subnav links with required route params must be declared. Example:

  ```ts
  // Note: `currentRoute` equates to router.currentRoute and must be passed in to the consuming app's route generator
  {
    name: 'Runtime Instances',
    to: {
      name: 'runtime-instances',
      params: {
        control_plane_id: currentRoute?.params.control_plane_id
      }
    }
  }
  ```

