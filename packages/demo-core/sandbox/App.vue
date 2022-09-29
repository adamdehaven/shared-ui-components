<template>
  <main>
    <div>
      <h1>Core Sandbox</h1>
      <p v-if="loadingPackage">
        Loading...
      </p>
      <!-- We must use v-show here so that the kong-auth-login element exists in the DOM -->
      <div v-show="!loadingPackage && !loadingStyles">
        <p>The component has loaded!</p>
        <kong-auth-login />
      </div>
    <!-- <test-button msg="This is the button text" /> -->
    </div>
  </main>
</template>

<script setup lang="ts">
import { usePackage } from '../src'

const { importPackage, loadingPackage, loadingStyles } = usePackage()

// importPackage({
//   scripts: {
//     // urls: ['https://packages.konghq.tech/@kong-ui/demo-component@0/dist/demo-component.umd.js'],
//     urls: ['http://localhost:3333/demo-component.umd.js'],
//   },
//   styles: {
//     // urls: ['https://packages.konghq.tech/@kong-ui/demo-component@0/dist/style.css'],
//     urls: ['http://localhost:3333/style.css'],
//   },
//   onReady: async () => {
//     console.log('onReady')
//     // @ts-ignore
//     // eslint-disable-next-line no-undef
//     // TestButton = KongUiDemoComponent.TestButton
//   },
// })

importPackage({
  scripts: {
    urls: ['https://packages.konghq.tech/@kong/kong-auth-elements@1/dist/kong-auth-elements.es.js'],
    type: 'es',
  },
  styles: {
    urls: ['https://packages.konghq.tech/@kong/kong-auth-elements@1/dist/style.css'],
    shadowRoot: 'kong-auth-login',
  },
  onReady: async () => {
    console.log('onReady component')
    // @ts-ignore
    window.registerKongAuthNativeElements({
      userEntity: 'user',
    })
  },
})
</script>
