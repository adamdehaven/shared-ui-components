import { ref, Ref, readonly, computed, ComputedRef, onBeforeMount, nextTick } from 'vue'

export interface ImportParams {
  /** @property {string[]} packageUrls Array of fully qualified URLs for the package location. */
  packageUrls: string[],
  /** @property Style import config object */
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
  importPackage: ({ packageUrls, styles, onReady }: ImportParams) => void,
  loadingPackage: Ref<boolean>,
  loadingStyles: Ref<boolean>,
} {
  // Loading state
  const loadingPackage: Ref<boolean> = ref(true)
  const loadingStyles: Ref<boolean> = ref(true)

  const injectStyles = async (styleUrls: string[], shadowRoot?: string): Promise<void> => {
    for (const url of styleUrls) {
      const styleLink = document.createElement('link')

      styleLink.type = 'text/css'
      styleLink.rel = 'stylesheet'
      styleLink.href = url

      const stylesParent = shadowRoot ? document.querySelector(shadowRoot) : null

      if (stylesParent) {
        try {
          stylesParent?.shadowRoot?.children[0]?.appendChild(styleLink)
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
  const importPackage = ({ packageUrls, styles, onReady }: ImportParams): void => {
    if (!packageUrls || !packageUrls.length || typeof window === 'undefined' || typeof document === 'undefined') return

    const useShadowDom: ComputedRef<boolean> = computed((): boolean => !!styles && !!styles?.urls && !!styles?.urls.length && !!styles.shadowRoot)

    // If no styles are being imported, set loadingStyles ref to false
    if (!styles || !styles?.urls || !styles?.urls?.length) {
      loadingStyles.value = false
    }

    onBeforeMount(async () => {
      // If injecting styles and NOT utilizing the shadowDOM, add the styles
      // to the document.head before mounting the component
      if (styles?.urls && !useShadowDom.value) {
        await injectStyles(styles.urls)
        loadingStyles.value = false
      }

      // TODO: Mock process.env.NODE_ENV for now
      // @ts-ignore
      window.process = { env: { NODE_ENV: 'production' } }

      // Create an array to store the requests we need to make
      const importArray: Promise<any>[] = []

      // Import package urls
      for (const url of packageUrls) {
        importArray.push(import(/* @vite-ignore */ url))
      }

      // Make requests
      await Promise.all(importArray)

      // Always set loadingPackage ref to false after calling the optional onReady() callback
      loadingPackage.value = false

      // Await a DOM refresh so that element(s) are potentially added to the DOM
      await nextTick()

      // Call onReady function now that package is imported
      if (typeof onReady === 'function') {
        await onReady()
      }

      // If injecting styles and ARE utilizing the shadowDOM, add the styles into the shadowRoot
      if (styles?.urls && useShadowDom.value) {
        // Since we are appending styles to the shadowRoot, this must be called AFTER
        // loadingPackage has been set to true and after the user onReady() callback to
        // ensure that the element is hopefully present in the DOM.
        await injectStyles(styles.urls, styles?.shadowRoot)
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
