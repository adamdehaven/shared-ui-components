<template>
  <div v-if="packageComponent">
    <slot :package-component="packageComponent" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePackage } from '../src'

const { importPackage } = usePackage()

const packageComponent = ref(null)

onMounted(async () => {
  await importPackage({
    scripts: {
    // urls: ['https://packages.konghq.tech/@kong-ui/demo-component@0/dist/demo-component.umd.js'],
      urls: ['http://localhost:3333/demo-component.umd.js'],
    },
    styles: {
    // urls: ['https://packages.konghq.tech/@kong-ui/demo-component@0/dist/style.css'],
      urls: ['http://localhost:3333/style.css'],
    },
    onReady: async () => {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      packageComponent.value = KongUiDemoComponent?.TestButton
    },
  })
})
</script>
