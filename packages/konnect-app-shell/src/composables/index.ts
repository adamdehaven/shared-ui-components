import useLaunchDarkly from './useLaunchDarkly'
import useAppConfig from './useAppConfig'
import useAppSidebar from './useAppSidebar'
import useGeo from './useGeo'
import useI18n from './useI18n'
import useKAuthApi from './useKAuthApi'
import useSession from './useSession'
import { useWindow } from '@kong-ui/core'

// All composables must be exported as part of the default object for Cypress test stubs
export default {
  useLaunchDarkly,
  useAppConfig,
  useAppSidebar,
  useGeo,
  useI18n,
  useKAuthApi,
  useSession,
  useWindow,
}
