# PermissionsWrapper

A composable that exports a shared Axios instance.

- [Features](#features)
- [Usage](#usage)
  - [Install](#install)
  - [Props](#props)
  - [Usage example](#usage-example)

## Features

- Hides default slot content until the required `authFunction` is successfully evaluated

## Usage

### Install

[See instructions for installing the `@kong-ui/entities-shared` package.](../README.md#install)

### Props

#### `authFunction`

- type: `Function as PropType<() => Promise<boolean>>`
- required: `true`
- default: `async (): Promise<boolean> => true`

An async function that returns a boolean to determine whether the wrapper should hide or show the default slot content.

### Usage example

```html
<template>
  <!-- Only showing relevant portions -->
  <EntityBaseTable>
    <template #actions="{ row }">
      <PermissionsWrapper :auth-function="() => canEdit(row)">
          <KDropdownItem
            @click="editRow(row)"
          >
            Edit
          </KDropdownItem>
        </PermissionsWrapper>
    </template>
  </EntityBaseTable>
</template>

<script setup lang="ts">
import { EntityBaseTable, PermissionsWrapper } from '@kong-ui/entities-shared'
import { canUserAccess } from '@kong-ui/konnect-app-shell'

const canEdit = async (row: Record<string, any>): Promise<boolean> => {
  return await canUserAccess({ service: 'konnect', action: '#edit', resourcePath: `services/${row.id}` })
}
</script>
```
