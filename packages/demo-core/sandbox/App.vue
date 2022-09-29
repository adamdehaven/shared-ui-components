<template>
  <main>
    <div>
      <h1>Core Sandbox</h1>
      <p v-if="loadingPackage">
        Loading...
      </p>
      <div v-show="!loadingPackage && !loadingStyles">
        <p>The component has loaded!</p>
        <kong-auth-login />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { usePackage } from '../src'

const { importPackage, loadingPackage, loadingStyles } = usePackage()
// @ts-ignore
// const NewComponent = window.kongui.demo_component.TestButton

importPackage({
  scripts: ['https://packages.konghq.tech/@kong/kong-auth-elements@1/dist/kong-auth-elements.es.js'],
  styles: {
    urls: ['https://packages.konghq.tech/@kong/kong-auth-elements@1/dist/style.css'],
    shadowRoot: 'kong-auth-login',
  },
  onReady: async () => {
    // @ts-ignore
    window.registerKongAuthNativeElements({
      userEntity: 'user',
    })
  },
})

// importPackage({
//   scripts: ['https://packages.konghq.tech/@kong-ui/demo-component@0/dist/demo-component.es.js'],
//   styles: {
//     urls: ['https://packages.konghq.tech/@kong-ui/demo-component@0/dist/style.css'],
//   },
//   onReady: async () => {
//     // @ts-ignore
//     TestButton = window.kongui.demo_component.TestButton
//   },
// })
</script>
