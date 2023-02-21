# @kong-ui/konnect-global-search

Konnect global search UI.

- [Features](#features)
- [Requirements](#requirements)
- [Usage](#usage)
  - [Install](#install)
  - [Props](#props)
  - [Events](#events)
  - [Usage Example](#usage-example)
- [CSS Variables](#css-variables)
- [Local Development](#local-development)

## Features

- Global search of entities via the Konnect API.

## Requirements

- `vue` and `vue-router` must be initialized in the host application
- `@kong/kongponents` must be available as a `dependency` in the host application, along with the package's style imports. [See here for instructions on installing Kongponents](https://kongponents.konghq.com/#globally-install-all-kongponents).

## Usage

### Install

Install the component in your host application

```sh
yarn add @kong-ui/konnect-global-search
```

### Props

#### `searchApiUrl`

- type: `String`
- required: `true`

The base URL (relative or absolute) for the search API.

#### `activeGeoCode`

- type: `String`
- required: `true`

The two letter alpha code for the active geo. Example: `us`

#### `shouldNavigate`

- type: `Boolean`
- required: `false`
- default: `true`

Should the component handle navigating the user when a search result is selected.

When `true` (default), the component will navigate to the selected result via `window.location.assign`. When `false`, the component will emit a `@selected` event and let the host application handle navigating, e.g. via the router.

### Events

#### `selected`

A `@selected` event is emitted when the user clicks on (selects) a search result. The event payload contains the selected search result.

### Usage Example

```html
<template>
  <KonnectGlobalSearch
    active-geo-code="us"
    search-api-url="/us/kong-api/konnect"
    :should-navigate="false"
    @selected="resultSelected"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { KonnectGlobalSearch } from '@kong-ui/konnect-global-search'
import type { SelectedSearchItem } from '@kong-ui/konnect-global-search'
import '@kong-ui/konnect-global-search/dist/style.css'

const searchResult = ref('')
const resultSelected = (res: SelectedSearchItem) => {
  searchResult.value = JSON.stringify(res)
}
</script>
```

## CSS Variables

You can customize some of the `KonnectGlobalSearch.vue` CSS by adding CSS variables to your app. In most use-cases, this shouldn't be necessary.

Variable | Description | Default
---------|----------|---------
`--kong-ui-konnect-global-search-background-color` | The background-color of the search UI | `transparent`
`--kong-ui-konnect-global-search-input-color` | The color of the search input text | `var(--white, #fff)`
`--kong-ui-konnect-global-search-filter-color` | The color of the filter dropdown button text | `var(--steel-200, #dae3f2)`
`--kong-ui-konnect-global-search-secondary-color` | The color of the search and caret icons, and placeholder text | `var(--steel-200, #dae3f2)`

## Local Development

In order to run the local App Sandbox, you must have a valid auth token in your browser cookies from the search endpoint.
