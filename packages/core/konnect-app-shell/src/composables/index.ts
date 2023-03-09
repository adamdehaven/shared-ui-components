import useApiError from './useApiError'
import useAppConfig from './useAppConfig'
import useAppSidebar from './useAppSidebar'
import useGeo from './useGeo'
import useI18n from './useI18n'
import useKAuthApi from './useKAuthApi'
import useLaunchDarkly from './useLaunchDarkly'
import usePermissions from './usePermissions'
import useSession from './useSession'
import useDatadog from './useDatadog'

// Expose composables imported from `@kong-ui/core`
import { useWindow } from '@kong-ui/core'

// All composables must be exported as part of the default object for Cypress test stubs
export default {
  useApiError,
  useAppConfig,
  useAppSidebar,
  useGeo,
  useI18n,
  useKAuthApi,
  useLaunchDarkly,
  usePermissions,
  useSession,
  useDatadog,
  useWindow,
}
