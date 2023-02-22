# @kong-ui/entities-shared

Shared components for Kong entities.

- [Features](#features)
- [Requirements](#requirements)
- [Included components](#included-components)
- [Usage](#usage)
  - [Install](#install)
  - [Registration](#registration)
- [Individual component documentation](#individual-component-documentation)

## Features

- Modal component for entity delete confirmation ([see the EntityDeleteModal docs for more info](docs/entity-delete-modal.md))

## Requirements

- `vue` must be initialized in the host application
- `@kong/kongponents` must be added as a `dependency` in the host application, globally available via the Vue Plugin installation, and the package's style imports must be added in the app entry file. [See here for instructions on installing Kongponents](https://kongponents.konghq.com/#globally-install-all-kongponents).

## Included components

- `EntityDeleteModal`

Reference the [individual component docs](#individual-component-documentation) for more info.

## Usage

### Install

Install the component in your host application

```sh
yarn add @kong-ui/entities-shared
```

### Registration

Import the component in your host application

```ts
import { EntityDeleteModal } from '@kong-ui/entities-shared'
```

## Individual component documentation

- [`<EntityDeleteModal.vue />`](docs/entity-delete-modal.md)
