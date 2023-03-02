# @kong-ui/entities-routes

Route entity components.

- [Requirements](#requirements)
- [Included components](#included-components)
- [Usage](#usage)
  - [Install](#install)
  - [Registration](#registration)
- [Individual component documentation](#individual-component-documentation)

## Requirements

- `vue` and `vue-router` must be initialized in the host application
- `@kong/kongponents` must be added as a dependency in the host application, globally available via the Vue Plugin installation, and the package's style imports must be added in the app entry file. [See here for instructions on installing Kongponents](https://kongponents.konghq.com/#globally-install-all-kongponents).

## Included components

- `RouteList`

Reference the [individual component docs](#individual-component-documentation) for more info.

## Usage

### Install

Install the component in your host application

```sh
yarn add @kong-ui/entities-routes
```

### Registration

Import the component(s) in your host application as well as the package styles

```ts
import { RouteList } from '@kong-ui/entities-routes'
import '@kong-ui/entities-routes/dist/style.css'
```

## Individual component documentation

- [`<RouteList.vue />`](docs/route-list.md)
