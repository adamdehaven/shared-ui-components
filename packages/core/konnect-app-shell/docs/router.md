# Router Configuration Requirements

In order for the host application to be properly configured for the deployment environments as well as compatability within the Konnect UI ecosystem, the host app **must** ahere to the router requirements outlined in this document.

- [Use the `generateRoutes` utility](#use-the-generateroutes-utility)
  - [Required parameters](#required-parameters)
- [Route definitions](#route-definitions)
- [Route Guards](#route-guards)
  - [`router.beforeEach` in the host application](#routerbeforeeach-in-the-host-application)
  - [`meta.isAuthorized()`](#metaisauthorized)
  - [`meta.featureFlagsLD`](#metafeatureflagsld)
  - [`meta.enterpriseOnly`](#metaenterpriseonly)
  - [`meta.preventReadonlyUser`](#metapreventreadonlyuser)

## Use the `generateRoutes` utility

The host application's `vue-router` configuration **must** utilize [the provided `generateRoutes` helper function](../src/utilities/generateRoutes.ts) when creating the router instance.

### Required parameters

The `generateRoutes` function accepts an object of `GenerateRoutesParams` that returns an array of `RouteRecordRaw` entries, wrapping the host application's provided routes.

```ts
interface GenerateRoutesParams {
  konnectPrimaryRouteKey: KonnectPrimaryRouteKey
  type?: 'geo' | 'global'
  routes: RouteRecordRaw[]
  defaultHomeRouteName?: string
}
```

Parameter | Description | Default
---------|----------|---------
`konnectPrimaryRouteKey` | The Konnect global primary route key that corresponds to the top-level navigation item. e.g. `runtime-manager` or `servicehub` | `undefined`
`type` | The type of routes the host app is adding, one of `geo` or `global`. If your app is region-aware, you should pass `geo`. | `geo`
`routes` | Initial list of host app routes that should be added to the router as children of the geo/global root. **No route paths should start with a leading slash**. See the [Route definitions section](#route-definitions) for more details. | `[]`
`defaultHomeRouteName` | The route name to redirect to when the user tries to go to the root of the host app. This should likely be your app's `home` route, or landing page. | `routes[0].name`

## Route definitions

The host application **must** define a single, top-level route with an empty path as the first defined route. This route will be the landing page for your application's top-level navigation item. _Preferrably, this top-level route is named `'home'` for consistency._

```ts
import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import { generateRoutes, userIsAuthorizedForRoute } from '@kong-ui/konnect-app-shell'

// Host app route definitions
const routes: RouteRecordRaw[] = [
  {
    /**
     * The host app **must** have a single, top-level route here with
     * an empty path (i.e. `path: ''`) as the first defined route.
     *
     * This route will be the landing page for the host app's top-level navigation item (e.g. `/servicehub`)
     * for the route passed in as the `konnectPrimaryRouteKey` in the `generateRoutes` function.
     */
    path: '',
    name: 'home', // This route should **not** be named the same as the `konnectPrimaryRouteKey` in the `generateRoutes` function. Preferrably this route is named `home`.
    component: () => import('../pages/HomePage.vue'),
    meta: {
      title: 'Home',
    },
    // All other host app routes should be located inside of this children[] array.
    // The 404 (not found) route is already handled by the KonnectAppShell
    children: [
      {
        path: 'services',
        name: 'service-list',
        component: () => import('../pages/ServiceListPage.vue'),
        meta: {
          title: 'Service List',
          isAuthorized: async (route: RouteLocationNormalized) => await canUserAccess({ service: 'konnect', action: '#list', resourcePath: `services` }),
        },
        children: [
          {
            path: ':service(\\d+)',
            name: 'service-show',
            component: () => import('../pages/ServiceShowPage.vue'),
            meta: {
              title: 'Service Show',
              isAuthorized: async (route: RouteLocationNormalized) => await canUserAccess({ service: 'konnect', action: '#retrieve', resourcePath: `services/${route.params.service}` }),
            },
          },
        ]
      },
    ],
  },
]
```

## Route Guards

Routes may be guarded via pre-defined, optional `route.meta` properties that are automatically evaluated by the `userIsAuthorizedForRoute` helper function in the `router.beforeEach` hook that **must live in the host application**. All of the [allowed `route.meta` properties are defined here](../src/types/router.d.ts) and outlined below:

Meta Property | Interface | Description
---------|----------|---------
`title` | `string` | The route title used to set the `document.title` in the host app's `router.beforeEach` hook
`isAuthorized` | `async (route: RouteLocationNormalized) => Promise<boolean>` | Asynchronous function to determine if a user should have access to the route. Must utilize the [`canUserAccess` function](docs/permissions.md#a-single-function-evaluates-authorization-canuseraccess) imported from `@kong-ui/konnect-app-shell`
`featureFlagsLD` | `{ key: string, value: any, defaultValue: any }[]` | Array of Launch Darkly feature flags
`enterpriseOnly` | `boolean` | Should the route only allow enterprise tier organization users
`preventReadonlyUser` | `boolean` | Prevent users with only `#root-readonly` permissions from accessing the route

### `router.beforeEach` in the host application

If the host application desires to guard routes via any of the `route.meta` properties outlined above, the app **must** utilize the provided `userIsAuthorizedForRoute` utility function within a `router.beforeEach` hook that includes the logic shown below:

```ts
import { userIsAuthorizedForRoute } from '@kong-ui/konnect-app-shell'

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // If user is not authorized to the route
  if (!await userIsAuthorizedForRoute(to)) {
    // Check if we can redirect to a sibling route they can access
    if (to?.redirectedFrom?.path && to?.redirectedFrom?.path !== '/') {
      // eslint-disable-next-line prefer-const
      let availableSiblingRoute = null

      for (const r of router.getRoutes().filter(r => to.redirectedFrom?.path && r.path.startsWith(to.redirectedFrom.path) && r.path !== to.path)) {
        if (!availableSiblingRoute && await userIsAuthorizedForRoute(r as unknown as RouteLocationNormalized)) {
          availableSiblingRoute = r.name
        }
      }

      // Check the from.name to ensure you do not create a redirect loop, then redirect to the sibling
      if (availableSiblingRoute && from.name !== availableSiblingRoute) {
        return { name: availableSiblingRoute }
      }
    }

    // TODO: Trigger the KonnectAppShell global unauthorized error

    // Return true so that the route changes but the UI is blocked by the global error message
    return true
  }
})
```

### `meta.isAuthorized()`

Routes defined in the host application are guarded by adding a `route.meta.isAuthorized()` property within the route definition. This `isAuthorized` property utilizes the route itself along with a set of krn arguments passed to the `canUserAccess` function to determine whether the user should have access to the route.

Here is an example of guarding a route that allows an authenticated user to access a specific route:

```ts
import { canUserAccess } from '@kong-ui/konnect-app-shell'

// ... other code

// Route definition
{
  path: 'create',
  name: 'create-service-version',
  meta: {
    title: 'Create New Version',
    isAuthorized: async (route: RouteLocationNormalized) => await canUserAccess({ service: 'konnect', action: '#edit', resourcePath: `services/${route.params.service}` })
  },
  component: () => import('../pages/Services/Form.vue')
}
```

Take a look at the `meta.isAuthorized()` property shown above.**This is the required implementation.** The only changes allowed are the property values passed to the properties of the `canUserAccess()` function parameter.

Since `route.meta` is static and does not have access to any of the route data, the `isAuthorized()` property **must** be defined as a function that returns the `canUserAccess()` function so that it can be called in the `router.beforeEach()` hook of the host application as well as the internal `usePermissions` composable.

- The `isAuthorized()` function accepts a single, required parameter `route` that is passed the current route object.
- The `isAuthorized()` function **must** return the `canUserAccess` function (or multiple `canUserAccess` functions, chained with `&&` or `||`) that accepts a single, required parameter of an object that adheres to the following type interface:

    ```ts
    interface RequestedPermissionKrn {
      /** The service the krn is a member of, defined in the Kauth YAML file. Examples: 'konnect', 'accounts' */
      service: string
      /** The action required to access the route, including the leading hash `#`. Examples: '#retrieve', '#create' */
      action: string
      /** The krn resource the user needs to access. This is everything after the organization id in the krn resource. Examples: `services/{UUID}`, `null` */
      resourcePath: string | null
    }
    ```

Unguarded routes are not required to have the `route.meta.isAuthorized()` property defined.

#### Inherited krn permissions for routes

Routes can also **inherit permissions** from a parent route. Routes that are a direct or indirect child of a guarded route can exclude the `meta.isAuthorized()` property.

Shown below is an example of a child route inheriting permissions from its parent:

```ts
{
  path: 'services',
  name: 'service-list-root',
  redirect: 'servicehub',
  meta: {
    // Permissions are defined on the parent route
    isAuthorized: async (route: RouteLocationNormalized) => await canUserAccess({ service: 'konnect', action: '#list', resourcePath: 'services' })
  },
  children: [
    // This child route will allow access based on the evaluation of the parent route's `meta.isAuthorized()` function
    {
      path: '',
      name: 'service-list',
      meta: {
        title: 'Services'
      },
      component: () => import('../pages/Services/ServiceList.vue')
    },
  ]
}
```

[Click here to read more on evaluating permissions](docs/permissions.md).

### `meta.featureFlagsLD`

Separately, or in addition to the `route.meta.isAuthorized()` guard, you may also guard a route with one or more Launch Darkly (LD) feature flags.

To guard a route with a LD feature flag, add another property `meta.featureFlagsLD` that is set to an array of Launch Darkly feature flags with a default value. Each flag in the array should evaluate to `true` if the user should be allowed to access the route.

Here's an example that combines both krn permissions with `meta.isAuthorized()` and a Launch Darkly feature flag with `meta.featureFlagsLD`:

```ts
{
  path: 'overview',
  name: 'service-overview',
  meta: {
    title: 'Service Overview',
    // Here, we are requiring `#root` or `#root-readonly` permissions
    isAuthorized: async (route: RouteLocationNormalized) => await canUserAccess({ service: 'accounts', action: '#root', resourcePath: null }) || await canUserAccess({ service: 'accounts', action: '#root-readonly', resourcePath: null }),
    featureFlagsLD: [{ key: 'kp-14-multi-geo', value: true }]
  },
  component: () => import('@KHCP/pages/Services/OverviewPage.vue')
},
```

### `meta.enterpriseOnly`

Adding a `route.meta.enterpriseOnly` property set to a value of `true` guards a route (and it's children) from access unless a user has Organization Admin or Organization Admin Readonly permissions.

### `meta.preventReadonlyUser`

Adding a `route.meta.preventReadonlyUser` property set to a value of `true` guards a route (and it's children) from access by users with only `#root-readonly` permissions.
