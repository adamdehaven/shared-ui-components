import type { App } from 'vue'
import validators from './generator/utils/validators'
import VueFormGenerator from './generator/FormGenerator.vue'
import * as sharedForms from './forms'
import { FORMS_API_KEY } from './const'

// Export Vue plugin as the default
export default {
  install: (app: App): void => {
    app.component('VueFormGenerator', VueFormGenerator)
  },
}

export { customFields } from './generator/fields/advanced/exports'

// this is to make kong-manager consume it old way with minimal changes
export const vfgPlugin = {
  install(app: App, options: any) {
    app.component('VueFormGenerator', VueFormGenerator)
    if (options) {
      if (options.validators) {
        for (const key in options.validators) {
          if ({}.hasOwnProperty.call(options.validators, key)) {
            validators[key] = options.validators[key]
          }
        }
      }
      if (options.apiService) {
        app.provide(FORMS_API_KEY, options.apiService)
      }
    }
  },
}

export { VueFormGenerator, sharedForms }

export const getSharedFormName = (modelName: string): string => {
  const mapping:Record<string, string> = {
    'openid-connect': 'OIDCForm',
    'post-function': 'PostFunction',
    // Pre and Post function plugins are using same component
    'pre-function': 'PostFunction',
  }

  return mapping[modelName]
}

export * from './const'
