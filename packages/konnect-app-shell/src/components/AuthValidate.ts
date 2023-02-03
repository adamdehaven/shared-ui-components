import { watch, defineComponent, ref, onMounted, PropType } from 'vue'
import composables from '../composables'
import type { RequestedPermissionKrn, RequestedPermissionDictionary } from '../types'

/**
 * @description Returns true if the potentialKrnArgs object is of type RequestedPermissionKrn and not a dictionary
 * @param {RequestedPermissionKrn | RequestedPermissionDictionary} potentialKrnArgs The object to validate
 * @return {boolean} Is the object a single krn arg, rather than a dictionary
 */
const objectIsKrnArg = (potentialKrnArgs: RequestedPermissionKrn | RequestedPermissionDictionary): boolean => {
  const keys = Object.keys(potentialKrnArgs)

  return keys.every((key: string) => key === 'service' || key === 'action' || key === 'resourcePath')
}

/**
 * @description Does the krnArg include the required properties and have a valid resource path
 * @param {RequestedPermissionKrn | RequestedPermissionDictionary} krnArg The object to validate
 * @return {boolean}
 */
const krnArgIsValid = (krnArg: RequestedPermissionKrn | RequestedPermissionDictionary): boolean => {
  const keys = Object.keys(krnArg)

  // If all object properties are valid krn args, and required properties are set
  if (objectIsKrnArg(krnArg) && keys.includes('service') && keys.includes('action')) {
    // Ensure args.resourcePath does not include invalid characters in the path
    if (krnArg.resourcePath && !krnResourcePathIsValid(krnArg.resourcePath as string)) {
      return false
    }

    return true
  }

  return false
}

/**
 * @description Is the krn resourcePath (if present) valid (doesn't contain any restricted characters)
 * @param {string} [resourcePath] The krnArg resource path
 * @return {boolean}
 */
const krnResourcePathIsValid = (resourcePath?: string): boolean => {
  if (resourcePath && (resourcePath.includes('}') || resourcePath.includes('{'))) {
    // Log error to help developer find invalid array
    console.error(`Invalid krn resourcePath value: ${resourcePath}`)

    return false
  }

  return true
}

export default defineComponent({
  name: 'AuthValidate',
  props: {
    workspace: {
      type: String,
      required: false,
      default: 'default',
    },
    krnArgs: {
      type: Object as PropType<RequestedPermissionKrn | RequestedPermissionDictionary>,
      required: true,
      validator: (args: RequestedPermissionKrn | RequestedPermissionDictionary): boolean => {
        // If args is just set to the default empty object, return true
        if (!Object.keys(args).length) { return true }

        // If args is a valid RequestedPermissionKrn
        if (objectIsKrnArg(args)) {
          // Since we know they passed in a single krn arg, return if the krn args are valid
          return krnArgIsValid(args)
        }

        let requestedKrnDictionaryIsValid = true

        for (const [key, krnArgs] of Object.entries(args)) {
          if (['service', 'action', 'resourcePath'].includes(key)) {
            requestedKrnDictionaryIsValid = false
            // Log error to help developer find invalid key
            console.error(`Invalid krn object key: ${key}`)
            break
          }

          if (!krnArgIsValid(krnArgs)) {
            requestedKrnDictionaryIsValid = false
            break
          }
        }

        return requestedKrnDictionaryIsValid
      },
    },
  },
  setup(props, { slots }) {
    const { canUserAccess } = composables.usePermissions()
    const accessDictionary = ref<Record<string, RequestedPermissionKrn | RequestedPermissionDictionary | boolean>>({})

    // Revaluate permissions if prop changes
    watch(() => props.krnArgs, () => {
      evaluatePermissions()
    }, { deep: true })

    const evaluatePermissions = async (): Promise<void> => {
      // Create a non-reactive object to assemble the access dictionary
      let tempAccessDictionary: Record<string, RequestedPermissionKrn | RequestedPermissionDictionary | boolean> = {}

      // If props.krnArgs is a single set of krnArgs and is not a dictionary, map it to 'isAllowed' and assign the boolean
      if (objectIsKrnArg(props.krnArgs)) {
        if (krnArgIsValid(props.krnArgs)) {
          tempAccessDictionary = {
            isAllowed: await canUserAccess(props.krnArgs as RequestedPermissionKrn),
          }
        } else {
          tempAccessDictionary = {
            isAllowed: false,
          }
        }
      } else {
        for (const entry of Object.entries(props.krnArgs)) {
          const [key, krnArgs]: [string, RequestedPermissionKrn | RequestedPermissionDictionary] = entry

          if (key && !krnArgs) {
            tempAccessDictionary[key] = false
          } else {
            tempAccessDictionary[key] = await canUserAccess(krnArgs as RequestedPermissionKrn)
          }
        }
      }

      // Set reactive ref value to evaluated object
      accessDictionary.value = tempAccessDictionary
    }

    onMounted(() => {
      evaluatePermissions()
    })

    return () => slots && slots.default && slots.default({
      ...accessDictionary.value,
    })
  },
})
