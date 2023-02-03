# Evaluating Permissions

> Permissions in the `@kong-ui/konnect-app-shell` are evaluated in alignment with the accepted [Guarding Konnect UI with KRN permissions madr](https://github.com/Kong/kong-madr/blob/main/docs/adr/0021-guarding-konnect-ui-with-krn-permissions.md).

- [Summary](#summary)
  - [A single function determines authorization](#a-single-function-determines-authorization)
- [Guarding UI with the AuthValidate component](#guarding-ui-with-the-authvalidate-component)
  - [Evaluate multiple permissions with a dictionary of `krnArgs`](#evaluate-multiple-permissions-with-a-dictionary-of-krnargs)
  - [Evaluate a single permission](#evaluate-a-single-permission)
  - [Root Permissions](#root-permissions)

---

## Summary

Evaluating authorization requires passing a single parameter comprised of krn arguments which the composable utilizes to attempt to match the requested krn and action against the krn resources and available action(s) returned from the KAuth API.

If a match is found, the user is granted access to the resource (route, component, etc.).

If a match is not found, and there is no krn stored in memory matching the requested krn `resourcePath`, the composable requests the associated permission object from the KAuth API. If a match is then returned, the user is granted access to the resource. If a match is not found, the requested krn (valid or not) is stored in memory with an empty `actions` array to prevent future queries to the API for the given `resourcePath`. In other words, once a krn is stored in memory, it is not fetched again until the user logs out or the app rehydrates (i.e. hard page refresh).

### A single function determines authorization

The `canUserAccess(krnArgs)` function in the permissions composable holds the core authorization logic which is used by the `AuthValidate` component to guard the UI and other functionality.

This `async` function returns a `Promise<boolean>` that can be used to allow or disallow access based on a user's assigned permissions. **This function must be called asynchronously as it also handles fetching missing KRNs from the KAuth API.**

> Note that the `canUserAccess` function will always return `false` until the `@ready` event is emitted from the `KonnectAppShell.vue` component.

This function is exposed directly to consuming applications and can be imported as shown here:

```ts
import { canUserAccess } from '@kong-ui/konnect-app-shell'
```

Proper use-cases for this function include guarding routes via the `meta.isAuthorized` property.

## Guarding UI with the AuthValidate component

The `AuthValidate` component can be used to guard components and functionality in the UI (located at `/packages/konnect-app-shell/src/components/AuthValidate.ts`).

The `AuthValidate` component accepts a prop `krnArgs` that accepts a dictionary of `krnArgs` (see below).

```ts
export interface RequestedPermissionKrn {
  /** The service the krn is a member of, defined in the kauth YAML file. Examples: 'konnect', 'accounts' */
  service: string
  /** The action required to access the route, including the leading hash `#`. Examples: '#retrieve', '#create' */
  action: string
  /** The krn resource the user needs to access. This is everything after the organization id in the krn resource. Examples: `services/{UUID}`, `null` */
  resourcePath: string | null
}

export interface RequestedPermissionDictionary {
  [key: string]: RequestedPermissionKrn
}

defineProps({
  krnArgs: Object as PropType<RequestedPermissionKrn | RequestedPermissionDictionary>,
})
```

Simply pass a valid argument for the `krnArgs` prop and deconstruct the returned variable(s) in the `v-slot` to automatically evaluate if the user has the required KRN permissions for the given actions and resources.

### Evaluate multiple permissions with a dictionary of `krnArgs`

When passing a dictionary, you provide custom keys in order to spread the returned object to extract the evaluated permission values.

In this example, I have defined a dictionary with two keys: `isAllowedCreate` and `isAllowedRetrieve` - I could have named these any string that is a valid `Object` property; however, unique `camelCase` strings are preferred.

```html
<AuthValidate
  v-slot="{ isAllowedCreate, isAllowedRetrieve }"
  :krn-args="{
    isAllowedCreate: {
      service: 'konnect',
      action: '#create',
      resourcePath: 'services'
    },
    isAllowedRetrieve: {
      service: 'konnect',
      action: '#retrieve',
      resourcePath: `services/${service.id}`
    }
  }"
>
  <!-- Show button if create permissions eval to true -->
  <KButton v-if="isAllowedCreate">Create</KButton>

  <!-- Show card if list permissions eval to true -->
  <KCard v-if="isAllowedRetrieve" title="This is the title" body="Body content"/>

  <!-- Show paragraph if BOTH permissions eval to true -->
  <p v-if="isAllowedCreate && isAllowedRetrieve">This paragraph requires both booleans to eval to true.</p>

</AuthValidate>
```

### Evaluate a single permission

Ideally, you would still pass a dictionary even if you only need to evaluate a single `krnArg` as shown here:

```html
<AuthValidate
  v-slot="{ isAllowedCreate }"
  :krn-args="{
    isAllowedCreate: {
      service: 'konnect',
      action: '#create',
      resourcePath: 'services'
    }
  }"
>
  <!-- Show button if create permissions eval to true -->
  <KButton v-if="isAllowed">Create</KButton>

</AuthValidate>
```

However, if you pass in a single `krnArg` not in a dictionary structure (i.e. you do not provide a key like `isAllowedCreate` above) it will automatically be wrapped into a dictionary object with a single key, `isAllowed` that can be extracted and utilized in the UI

```html
<AuthValidate
  v-slot="{ isAllowed }"
  :krn-args="{
    service: 'konnect',
    action: '#create',
    resourcePath: 'services'
  }"
>
  <!-- Show button if create permissions eval to true -->
  <KButton v-if="isAllowed">Create</KButton>

</AuthValidate>
```

### Root Permissions

Some routes and UI may need to be guarded so that only a user with root-level permissions have access.

With the new KRN permissions, there is a new way to define this type of access, as shown here:

```ts
// Root user permissions
{
  service: 'accounts',
  action: '#root',
  resourcePath: null,
}
```

In some scenarios, you may need to evaluate root permissions based on the `Organization Admin` and `Organization Admin Readonly` pre-defined teams. In this scenario, it is best practice to evaluate both permission sets and then conditionally show UI elements based on `or` logic, as shown here:

```html
<AuthValidate
  v-slot="{ isAllowedRoot, isAllowedRootReadonly }"
  :krn-args="{
    isAllowedRoot: {
      service: 'accounts',
      action: '#root',
      resourcePath: null
    },
    isAllowedRootReadonly: {
      service: 'accounts',
      action: '#root-readonly',
      resourcePath: null
    }
  }"
>
  <!-- Show button if root or root-readonly permissions eval to true -->
  <KButton v-if="isAllowedRoot || isAllowedRootReadonly">View</KButton>

</AuthValidate>
```
