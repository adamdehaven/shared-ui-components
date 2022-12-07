<template>
  <KonnectAppShell>
    <template #notification>
      <KAlert
        :is-showing="showAlert"
        alert-message="I'm an alert from the host app"
        dismiss-type="icon"
        appearance="danger"
        @closed="handleCloseAlert"
      />
    </template>
    <template #navbar>
      <span>Navbar content from sandbox</span>
    </template>
    <router-view />
  </KonnectAppShell>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showAlert = ref(true)
const handleCloseAlert = (): void => {
  showAlert.value = false
}
</script>
