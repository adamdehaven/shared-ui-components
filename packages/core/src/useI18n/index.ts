// Important: do not utilize Vue reactive variables in this composable so that it may be used outside the setup() function
import { Options as IntlMessageFormatOptions } from 'intl-messageformat'
import { createIntl, createIntlCache, IntlShape, MessageDescriptor } from '@formatjs/intl'
import { flatten } from 'flat'

type MessageFormatPrimitiveValue = string | number | boolean | null | undefined

type SupportedLocales = 'en-us'

export type IntlShapeEx = IntlShape & {
  t: (translationKey: string, values?: Record<string, MessageFormatPrimitiveValue> | undefined, opts?: IntlMessageFormatOptions) => string,
  te: (translationKey: string) => boolean,
  tm: (translationKey: string) => Array<string>,
  source: Record<string, any>,
}

// this is internal formatJS function that caches instance of Intl and prevent memory leaks
const intlCache = createIntlCache()

// this is global var to hold global (application) instance of Intl
let globIntl: IntlShapeEx

export const createI18n = (locale: SupportedLocales, messages: Record<string, any>, isGlobal: boolean = false): IntlShapeEx => {
  const intl = createIntl(
    {
      locale,
      messages: flatten(messages, {
        safe: true, // Preserve arrays
      }),
    },
    intlCache,
  )

  const t = (translationKey: string, values?: Record<string, MessageFormatPrimitiveValue> | undefined, opts?: IntlMessageFormatOptions): string => {
    return intl.formatMessage(<MessageDescriptor>{ id: translationKey }, values, opts)
  }

  const te = (key: string): boolean => {
    return !!intl.messages[key]
  }

  const tm = (key: string): Array<string> => {
    // @ts-ignore
    return intl.messages[key] || []
  }

  const localIntl = {
    t,
    te,
    tm,
    ...intl,
    source: messages,
  }
  if (isGlobal) {
    globIntl = localIntl
  }

  return localIntl
}

// this returns global (application of Intl)
export default function useI18n(): IntlShapeEx {
  return globIntl
}
