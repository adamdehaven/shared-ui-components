# @kong-ui/entities-shared

Shared components for Kong entities.

- [Features](#features)
- [Requirements](#requirements)
- [Included components](#included-components)
- [Included composables](#included-composables)
- [Usage](#usage)
  - [Install](#install)
  - [Registration](#registration)
- [Individual component documentation](#individual-component-documentation)
- [Individual composables documentation](#individual-composables-documentation)

## Features

- Modal component for entity delete confirmation ([see the EntityDeleteModal docs for more info](docs/entity-delete-modal.md))
- Base table component for entity list views ([see the EntityBaseTable docs for more info](docs/entity-base-table.md))
- Filter component for filtering entities ([see the EntityFilter docs for more info](docs/entity-filter.md))

## Requirements

- `vue` and `vue-router` must be initialized in the host application
- `@kong/kongponents` must be added as a `dependency` in the host application, globally available via the Vue Plugin installation, and the package's style imports must be added in the app entry file. [See here for instructions on installing Kongponents](https://kongponents.konghq.com/#globally-install-all-kongponents).

## Included components

- `EntityDeleteModal`
- `EntityBaseTable`
- `EntityFilter`
- `PermissionsWrapper`

Reference the [individual component docs](#individual-component-documentation) for more info.

## Included composables

- `useAxios`

Reference the [individual composables docs](#individual-composables-documentation) for more info.

## Usage

### Install

Install the component in your host application

```sh
yarn add @kong-ui/entities-shared
```

> **Note**: If you are installing `@kong-ui/entities-shared` into another package within this repository, you will need to build it first before attempting to run locally with `pnpm --filter="@kong-ui/entities-shared" run build`.

### Registration

Import the component in your host application

```ts
import { EntityDeleteModal, EntityBaseTable } from '@kong-ui/entities-shared'
import '@kong-ui/entities-shared/dist/style.css'
```

## Individual component documentation

- [`<EntityDeleteModal.vue />`](docs/entity-delete-modal.md)
- [`<EntityBaseTable.vue />`](docs/entity-base-table.md)
- [`<EntityFilter.vue />`](docs/entity-filter.md)
- [`<PermissionsWrapper.vue />`](docs/permissions-wrapper.md)

## Individual composables documentation

- [`useAxios`](docs/use-axios.md)
