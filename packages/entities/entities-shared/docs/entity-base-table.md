# EntityBaseTable.vue

A base table component for entity list views.

- [Requirements](#requirements)
- [Usage](#usage)
    - [Install](#install)
    - [Props](#props)
    - [Events](#events)
    - [Usage example](#usage-example)
- [TypeScript interfaces](#typescript-interfaces)

## Requirements

- `vue` and `vue-router` must be initialized in the host application
- `@kong/kongponents` must be added as a `dependency` in the host application, globally available via the Vue Plugin installation, and the package's style imports must be added in the app entry file. [See here for instructions on installing Kongponents](https://kongponents.konghq.com/#globally-install-all-kongponents).

## Usage

### Install

[See instructions for installing the `@kong-ui/entities-shared` package.](../README.md#install)

### Props

#### `tableHeaders`

- type: `Object as PropType<BaseTableHeaders>`
- required: `true`
- default: `{}`

Table header configurations.

#### `fetcher`

- type: `Function as PropType<(params: FetcherParams) => Promise<FetcherResponse>>`
- required: `true`
- default: `async () => ({ data: [] })`

The fetcher function passed to `<KTable>`.

#### `fetcherCacheKey`

- type: `Number`
- required: `false`
- default: `1`

Cache key for the fetcher. Passed to `<KTable>`.

#### `isLoading`

- type: `Boolean`
- required: `false`
- default: `false`

A Boolean to indicate the loading state of the table.

#### `query`

- type: `String`
- required: `false`
- default: `''`

Search query.

#### `enableEntityActions`

- type: `Boolean`
- required: `false`
- default: `true`

A Boolean to indicate whether to show the actions column.

#### `emptyStateOptions`

- type: `Object as PropType<EmptyStateOptions>`
- required: `false`
- default: `{}`

Options for the empty state.

#### `errorMessage`

- type: `String`
- required: `false`
- default: `''`

Error message to show in the error state.

### Events

#### click:row

A `@click:row` event is emitted when a table row is clicked. The event payload contains the row item.

#### clear-search-input

A `@clear-search-input` event is emitted when the clear button in the empty state is clicked.

### Usage example

Please refer to the [sandbox](../sandbox/pages/EntityBaseTablePage.vue).

## TypeScript interfaces

TypeScript interfaces [are available here](https://github.com/Kong/shared-ui-components/blob/main/packages/entities/entities-shared/src/types/entity-base-table.ts) and can be directly imported into your host application. The following type interfaces are available for import:

```ts
import type {
  BaseTableHeaders,
  EmptyStateOptions,
  FetcherParams,
  FetcherResponse,
  InternalHeader,
} from '@kong-ui/entities-shared'
```
