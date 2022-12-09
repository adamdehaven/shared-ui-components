<template>
  <AppLayout>
    <template #notification>
      <KAlert
        alert-message="I'm an alert from the host app"
        appearance="warning"
        :is-showing="showAlert"
        @closed="handleCloseAlert"
      />
    </template>
    <template #navbar>
      <NavLinks />
    </template>
    <!-- Default slot content -->

    <p>This is the LAYOUT page.</p>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, provide, readonly } from 'vue'
import symbolInjectionKeys from '../../src/symbol-injection-keys'
// Sandbox only
import NavLinks from '../components/NavLinks.vue'

const { appSidebarTopItems } = symbolInjectionKeys

const items = computed(() => ([
  {
    name: 'Mesh Manager',
    key: 'mesh-manager',
    to: '/mesh-manager/',
    external: true,
    icon: 'brain',
    active: true,
  },
]))

// Provide the top sidebar items; alternatively you could pass them as props on <AppLayout />
// Wrap in readonly to prevent mutation in the inject component
provide(appSidebarTopItems, readonly(items))

const showAlert = ref(true)
const handleCloseAlert = (): void => {
  showAlert.value = false
}
</script>
