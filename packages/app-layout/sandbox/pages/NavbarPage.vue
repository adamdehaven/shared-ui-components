<template>
  <AppNavbar :left-offset="0">
    <template #mobile-logo>
      <a
        class="navbar-logo-link"
        href="/"
      >
        <GruceLogo />
        <div class="logo-title">
          <KonnectLogo theme="light" />
        </div>
      </a>
    </template>
    <NavLinks />
  </AppNavbar>
  <div class="sandbox-container">
    <main>
      <p>This is the NAVBAR page.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { AppNavbar, GruceLogo, KonnectLogo } from '../../src'
// Sandbox only
import NavLinks from '../components/NavLinks.vue'
</script>

<style lang="scss" scoped>
main {
  max-width: 1366px;
  min-height: 2000px; // fake a height so the container scrolls
  margin: 60px auto 0; // $navbar-height
  padding: 16px;
}

.navbar-logo-link {
  display: flex;
  align-items: center;
}

.logo-title {
  display: none;
  padding-left: 16px;

  @media (min-width: 640px) { // $viewport-sm
    display: flex;
  }
}
</style>
