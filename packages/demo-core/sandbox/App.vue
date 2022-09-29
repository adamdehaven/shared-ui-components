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
      <hr>
      <TestButton
        msg="Test"
        :the-button-is-visible="true"
      />
      <!-- <NewComponent msg="This is the button" /> -->
    </div>
  </main>
</template>

<script setup lang="ts">
import { usePackage } from '../src'
import { TestButton } from '@kong-ui/demo-component'

// const ButtonComponent: typeof TestButton = TestButton

// console.log(ButtonComponent)

const { importPackage, loadingPackage, loadingStyles } = usePackage()
// @ts-ignore
// const NewComponent = window.kongui.demo_component.TestButton

// let TestButton: any

// const TestButton = defineAsyncComponent({
//   // @ts-ignore
//   // loader: () => import('https://packages.konghq.tech/@kong-ui/demo-component@0.2.1/dist/kong-ui.demo-component.es.js'),
//   loader: () => import('@kong-ui/demo-component'),
//   timeout: 30000,
// })

importPackage({
  packageUrls: ['https://packages.konghq.tech/@kong/kong-auth-elements@1/dist/kong-auth-elements.es.js'],
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
//   packageUrls: ['https://packages.konghq.tech/@kong-ui/demo-component@0/dist/demo-component.es.js'],
//   styles: {
//     urls: ['https://packages.konghq.tech/@kong-ui/demo-component@0/dist/style.css'],
//   },
//   onReady: async () => {
//     // @ts-ignore
//     TestButton = window.kongui.demo_component.TestButton
//   },
// })
</script>
