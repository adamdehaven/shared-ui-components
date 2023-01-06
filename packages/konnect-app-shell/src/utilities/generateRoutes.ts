import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { GenerateRoutesParams } from '../types'
import { useI18n } from '../composables'

/**
 * Generate the vue-router:routes object with the required KonnectAppShell root and geo routes.
 * @param {KonnectPrimaryRouteKey} konnectPrimaryRouteKey The Konnect global primary route key that corresponds to the top-level navigation item. e.g. `runtime-manager` or `servicehub`
 * @param {'geo' | 'global'} type The type of routes the host app is adding, one of `geo` or `global`. Defaults to `geo`.
 * @param {RouteRecordRaw[]} routes Initial list of host app routes that should be added to the router. No route paths should start with a leading slash.
 * @param {string} defaultHomeRouteName The route name to redirect to when the user tries to go to the root of the host app.
 * @return {RouteRecordRaw[]} Array of vue-router route objects
 */
export default function generateRoutes({
  konnectPrimaryRouteKey,
  type,
  routes,
  defaultHomeRouteName,
}: GenerateRoutesParams): RouteRecordRaw[] {
  const routeType: string = type && ['geo', 'global'].includes(type) ? type : 'geo'
  const rootRedirectRoute = computed((): Partial<RouteRecordRaw> => {
    const redirectRouteName = defaultHomeRouteName || String(routes[0]?.name || '')

    if (redirectRouteName) {
      return {
        name: defaultHomeRouteName || String(routes[0]?.name || ''),
      }
    }

    return {
      path: routes[0]?.path,
    }
  })

  const { i18n: { t } } = useI18n()

  // Create a variable to store the route.path that has an error
  const routeWithError = {
    name: '',
    path: '',
  }
  // Check all routes (and nested routes) to ensure none start with a slash. If so, throw error
  const routesAreValid = (appRoutes: RouteRecordRaw[]): boolean => {
    return appRoutes.every((r: RouteRecordRaw): boolean => {
      if (r.path.startsWith('/')) {
        routeWithError.name = String(r.name || '')
        routeWithError.path = r.path || ''
        return false
      }

      if (r.children && r.children.length) {
        return routesAreValid(r.children)
      }

      return true
    })
  }

  // Throw an error if there is an invalid route
  if (!routesAreValid(routes)) {
    throw new Error(`${t('errors.routes.invalidPath')} generateRoutes({ name: '${routeWithError.name}', path: '${routeWithError.path}' })`)
  }

  const appRouteConfig: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'konnect-app-shell-root',
      children: [
        {
          path: routeType === 'geo' ? '/:geo([a-z]{2})' : '/global',
          name: routeType === 'geo' ? 'geo' : 'global',
          redirect: rootRedirectRoute.value, // Redirect to app home/landing page
          children: [
            {
              path: konnectPrimaryRouteKey, // Must be a child of geo route and match the top-level root app path, e.g. 'mesh-manager'
              name: konnectPrimaryRouteKey,
              redirect: rootRedirectRoute.value, // Redirect to app home/landing page
              children: [
                {
                  path: '',
                  name: 'konnect-app-shell-app-root',
                  redirect: rootRedirectRoute.value, // Redirect to app home/landing page
                  children: [
                    ...routes,
                    {
                      path: '404',
                      name: 'not-found',
                      alias: ':pathMatch(.*)*',
                      component: () => import('../components/errors/GlobalError.vue'),
                      props: {
                        header: t('errors.not_found.header'),
                        text: t('errors.not_found.text'),
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  return appRouteConfig
}
