<template>
  <div class="kong-ui-konnect-app-shell">
    <!-- <NavbarHeader /> -->

    <SidebarNav
      data-testid="sidebar"
      :top-items="[{
        name: 'Mesh Manager',
        to: '/mesh-manager/',
        active: true,
        external: true,
        key: 'mesh-manager',
        icon: 'brain',
      }]"
      :header-height="60"
      mobile-enabled
      :mobile-top-offset="60"
      :mobile-header-visible="false"
    >
      <template #header>
        <div class="kong-logo d-flex w-100">
          <a
            href="/"
            class="d-flex align-items-center w-100"
          >
            <GruceLogo />
            <div class="d-flex pl-4 konnect-header-title">
              <AppLogo theme="dark" />
            </div>
          </a>
        </div>
      </template>
    </SidebarNav>

    <main>
      <slot name="default" />
    </main>
  </div>
</template>

<script setup lang="ts">
// import { NavbarHeader } from '@kong-ui/navbar'
import { SidebarNav } from '@kong-ui/sidebar'
import '@kong-ui/sidebar/dist/style.css'
import AppLogo from '../Logos/AppLogo.vue'
import GruceLogo from '../Logos/GruceLogo.vue'
</script>

<style lang="scss" scoped>
.kong-ui-konnect-app-shell {
  font-family: "Inter", Helvetica, Arial, sans-serif;
}
</style>
