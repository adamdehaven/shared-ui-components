import useAxios from './useAxios'
import useI18n from './useI18n'

// All composables must be exported as part of the default object for Cypress test stubs
export default {
  useAxios,
  useI18n,
}
