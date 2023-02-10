import { RouteLocationNormalized } from 'vue-router'
import type { LaunchDarklyFeatureFlag } from './index'

// Define potential route.meta interfaces from Konnect Apps
declare module 'vue-router' {
  interface RouteMeta {
    /**
     * @prop {string} title Route title
     */
    title?: string
    /**
     * @prop {LaunchDarklyFeatureFlag[]} Array of Launch Darkly feature flags
     */
    featureFlagsLD?: LaunchDarklyFeatureFlag[]
    /**
     * @prop {boolean} enterpriseOnly Should the route only allow enterprise tier organization users
     */
    enterpriseOnly?: boolean
    /**
     * @prop {boolean} preventReadonlyUser Prevent users with only `#root-readonly` permissions from accessing the route
     */
    preventReadonlyUser?: boolean
    /**
     * @prop {(route: RouteLocationNormalized) => Promise<boolean>} isAuthorized Asynchronous function to determine if a user should have access to the route. Must utilize the `canUserAccess` function imported from `@kong-ui/konnect-app-shell`
     */
    isAuthorized?: (route: RouteLocationNormalized) => Promise<boolean>
  }
}
