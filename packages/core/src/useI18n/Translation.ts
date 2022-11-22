import { defineComponent, h } from 'vue'
import type { VNodeChild, App } from 'vue'
import type { IntlShapeEx } from '.'

const TranslationComponent = (i18n: IntlShapeEx) => defineComponent({
  name: 'I18nT',
  props: {
    keypath: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: 'span',
    },
  },
  setup(props, { slots }) {
    return (): VNodeChild => {
      const keys = Object.keys(slots).filter(key => key !== '_')
      const sourceString = i18n.messages[props.keypath].toString()

      //  "Previewing {rowsMax} of {rowsTotal} rows"
      //    -> (5)['Previewing {', 'rowsMax', '} of {', 'rowsTotal', '} rows']
      // eslint-disable-next-line
      let hArray: Array<any> = sourceString.split(/(?<=\{)([^\}]+)(?=\})/)

      // ['Previewing {', 'rowsMax', '} of {', 'rowsTotal', '} rows']
      // -> ['Previewing ', '{rowsMax}', ' of ', '{rowsTotal}', ' rows']
      for (let i = 0; i < hArray.length - 2; i++) {
        if (hArray[i].endsWith('{') && hArray[i + 2].startsWith('}')) {
          hArray[i + 1] = '{' + hArray[i + 1] + '}'

          hArray[i] = hArray[i].replace(/{$/, '')
          hArray[i + 2] = hArray[i + 2].replace(/^}/, '')
        }
      }

      hArray = hArray.filter(a => a !== '')

      // replacing slots
      hArray.forEach((element: string, i: number) => {
        if (!element.startsWith('{') && !element.endsWith('}')) {
          return
        }
        // eslint-disable-next-line
        const stripped = element.replace(/[\{\}]/g, '')
        if (stripped === '0' && slots.default) {
          hArray[i] = slots.default()
        } else if (keys.includes(stripped) && slots[stripped]) {
          // @ts-ignore
          hArray[i] = slots[stripped]()
        }
      })
      return h(props.tag, props, hArray)
    }
  },
})

// Export Vue plugin
export default {
  install(app: App, options: { i18n: IntlShapeEx }) {
    const { i18n } = options
    app.component('I18nT', TranslationComponent(i18n))
  },
}
