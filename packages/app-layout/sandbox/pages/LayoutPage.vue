<template>
  <AppLayout :sidebar-top-items="topItems">
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
import { ref, computed } from 'vue'
// Sandbox only
import NavLinks from '../components/NavLinks.vue'

const topItems = computed(() => ([
  {
    name: 'Mesh Manager',
    key: 'mesh-manager',
    to: '/mesh-manager/',
    external: true,
    icon: 'brain',
    active: true,
  },
]))

const showAlert = ref(true)
const handleCloseAlert = (): void => {
  showAlert.value = false
}
</script>
