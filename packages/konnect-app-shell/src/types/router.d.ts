import type { LaunchDarklyFeatureFlag } from './index'

// Define potential route.meta interfaces from Konnect Apps
declare module 'vue-router' {
  interface RouteMeta {
    /**
     * @prop {LaunchDarklyFeatureFlag[]} Array of Launch Darkly feature flags
     */
    featureFlagsLD?: LaunchDarklyFeatureFlag[]
    /**
     * @prop {boolean} enterpriseOnly Should the route only allow enterprise tier organization users
     */
    enterpriseOnly?: boolean
    /**
     * @prop {boolean} preventReadonlyUser Prevent `#root-readonly` users from accessing the route (e.g. 'quick-start' routes are Org Admin only)
     */
    preventReadonlyUser?: boolean
    /**
     * @prop {boolean} full Fullpage route component
     */
    full?: boolean
    /**
     * @prop {string} title Route title
     */
    title?: string
    /**
     * @prop {boolean} excludeAsBreadcrumb Exclude the route from breadcrumbs
     */
    excludeAsBreadcrumb?: boolean
  }
}
