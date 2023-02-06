import useI18n from './useI18n'
import { useWindow } from '@kong-ui/core'
import useSearchApi from './useSearchApi'

// All composables must be exported as part of the default object for Cypress test stubs
export default {
  useI18n,
  useWindow,
  useSearchApi,
}
