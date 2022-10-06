<template>
  <div class="greetings">
    <h1 class="green">
      {{ msg }}
    </h1>
    <h2>Adam testing</h2>
    <br>
    <div v-if="!loadingButtons">
      <TestButton
        msg="This is another test"
      />
      <RedButton
        custom-text="This is the red button"
      />
    </div>

    <hr class="line-break">
    <!-- We must use v-show here so that the kong-auth-login element exists in the DOM -->
    <div v-show="!loadingKongAuthElements">
      <p>The component has loaded!</p>
      <kong-auth-login />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount } from 'vue'
import { usePackage } from '@kong-ui/core'

defineProps<{
  msg: string
}>()

// Import 2 button components from the same package
const { importPackage: importButtons, loadingPackage: loadingButtons } = usePackage({
  script: {
    libName: 'demo-component', // Required for UMD builds
    url: 'http://localhost:3333/demo-component.umd.js',
    type: 'umd',
  },
  styles: {
    urls: ['http://localhost:3333/style.css'],
  },
})

// Import kong-auth-elements
const { importPackage: importKongAuthElements, loadingPackage: loadingKongAuthElements } = usePackage({
  script: {
    libName: 'kong-auth-elements',
    url: 'https://packages.konghq.tech/@kong/kong-auth-elements@1/dist/kong-auth-elements.umd.js',
    type: 'umd',
  },
  styles: {
    urls: ['https://packages.konghq.tech/@kong/kong-auth-elements@1/dist/style.css'],
    shadowRoot: 'kong-auth-login',
  },
  onReady: async () => {
    // When package is imported, call the provided function to register the web components to the window
    // @ts-ignore
    window.registerKongAuthNativeElements({
      userEntity: 'user',
    })
  },
})

const TestButton = defineAsyncComponent(async (): Promise<any> => {
  const { TestButton } = await importButtons()
  // @ts-ignore
  return TestButton
})

const RedButton = defineAsyncComponent(async (): Promise<any> => {
  const { RedButton } = await importButtons()
  // @ts-ignore
  return RedButton
})

// Since we're not using the `defineAsyncComponent` method and just registering the web component to the window, we need to use the `onBeforeMount` hook
onBeforeMount(async () => {
  await importKongAuthElements()
})
</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

.line-break {
  margin: 20px 0;
}
</style>
