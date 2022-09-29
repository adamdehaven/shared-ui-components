import { ref, Ref, readonly, computed, ComputedRef, onBeforeMount, nextTick } from 'vue'

export type ScriptType = 'umd' | 'es'

export interface PackageScripts {
  /** @property {string[]} urls Array of strings of URL scripts to import */
  urls: string[]
  /** @property {ScriptType} type The type of the script bundle being imported, one of 'umd' or 'es'. Default is 'umd' */
  type?: ScriptType
}

export interface ImportParams {
  /** @property {PackageScripts} scripts Script import config object */
  scripts: PackageScripts,
  /** @property {Object} styles Style import config object */
  styles?: {
    /** @property {string[]} urls Array of strings of CSS assets. */
    urls?: string[]
    /** @property {string} shadowRoot Query selector string of the shadowRoot element if adding the styles to the shadowDOM. */
    shadowRoot?: string
  }
  /** @property {function} Asynchronous function to call once package has been loaded. */
  onReady?: () => Promise<void>
}

export default function usePackage(): {
  importPackage: ({ scripts, styles, onReady }: ImportParams) => void,
  loadingPackage: Ref<boolean>,
  loadingStyles: Ref<boolean>,
} {
  // Loading state
  const loadingPackage: Ref<boolean> = ref(true)
  const loadingStyles: Ref<boolean> = ref(true)

  /**
   * Private function to import scripts via native ES import
   */
  const importScripts = async (scripts: PackageScripts, onReady?: () => Promise<void>) => {
    // Create an array to store the requests we need to make
    const { urls, type } = scripts
    const importType = type !== undefined && ['umd', 'es'].includes(type) ? type : 'umd'

    // Import ES Module(s)
    if (importType === 'es') {
      const importArray: Promise<any>[] = []

      for (const url of urls) {
        importArray.push(import(/* @vite-ignore */ url))
      }

      // Make requests
      await Promise.all(importArray)

      // Call onReady function now that package is imported
      if (typeof onReady === 'function') {
        await onReady()
      }

      return
    }

    // Scripts are umd files, so inject into the document.head with async attribute
    for (const url of urls) {
      const scriptTag = document.createElement('script')

      scriptTag.async = true
      scriptTag.src = url
      document.head.appendChild(scriptTag)

      // TODO: https://errorsandanswers.com/waiting-for-dynamically-loaded-script/
      // On multiple script load
      scriptTag.addEventListener('load', async () => {
        console.log('onLoad')
        // Call onReady function now that package is imported
        if (typeof onReady === 'function') {
          await onReady()
        }
      })
    }
  }

  /**
   * Private function to add `<link rel="stylesheet" href="" >` tags to the document.head, or within the shadowRoot.
   */
  const importStyles = async (styleUrls: string[], shadowRoot?: string): Promise<void> => {
    for (const url of styleUrls) {
      const styleLink = document.createElement('link')

      styleLink.type = 'text/css'
      styleLink.rel = 'stylesheet'
      styleLink.href = url

      const stylesParent = shadowRoot ? document.querySelector(shadowRoot) : null
      const shadowRootElement = shadowRoot ? stylesParent?.shadowRoot?.children[0] : null

      if (stylesParent && shadowRootElement) {
        try {
          shadowRootElement.appendChild(styleLink)
        } catch (err) {
          document.head.appendChild(styleLink)
        }
      } else {
        document.head.appendChild(styleLink)
      }
    }
  }

  /**
   * Import the package scripts/modules and corresponding CSS files - should only be called within the Vue `setup` function.
   */
  const importPackage = async ({ scripts, styles, onReady }: ImportParams): Promise<void> => {
    if (!scripts || !scripts.urls || !scripts.urls.length || typeof window === 'undefined' || typeof document === 'undefined') return

    const useShadowDom: ComputedRef<boolean> = computed((): boolean => !!styles && !!styles?.urls && !!styles?.urls.length && !!styles.shadowRoot)

    // If no styles are being imported, set loadingStyles ref to false
    if (!styles || !styles?.urls || !styles?.urls?.length) {
      loadingStyles.value = false
    }

    onBeforeMount(async () => {
      // If injecting styles and NOT utilizing the shadowDOM, add the styles
      // to the document.head before mounting the component
      if (styles?.urls && !useShadowDom.value) {
        await importStyles(styles.urls)
        loadingStyles.value = false
      }

      // TODO: Mock process.env.NODE_ENV for now (Currently resolved with the `define` entry in the vite.config.ts)
      // @ts-ignore
      // window.process = { env: { NODE_ENV: 'production' } }

      await importScripts(scripts, onReady)

      // Await a DOM refresh so that element(s) are potentially added to the DOM
      await nextTick()

      // Always set loadingPackage ref to false after calling the optional onReady() callback
      loadingPackage.value = false

      // If injecting styles and ARE utilizing the shadowDOM, add the styles into the shadowRoot
      if (styles?.urls && useShadowDom.value) {
      // Since we are appending styles to the shadowRoot, this must be called AFTER
      // loadingPackage has been set to true and after the user onReady() callback to
      // ensure that the element is hopefully present in the DOM.
        await importStyles(styles.urls, styles?.shadowRoot)

        // Await a DOM refresh so that styles are present in the DOM
        await nextTick()

        loadingStyles.value = false
      }
    })
  }

  return {
    importPackage,
    loadingPackage: readonly(loadingPackage),
    loadingStyles: readonly(loadingStyles),
  }
}
