<template>
  <header class="navbar">
    <nav>
      <SidebarToggle
        :active="mobileSidebarOpen"
        @toggle="sidebarToggled"
      />
      <router-link
        to="/"
        class="mobile-logo"
      >
        <GruceLogo />
      </router-link>
      <KButton
        :to="{ name: 'about' }"
        size="small"
      >
        About
      </KButton>
    </nav>
  </header>
  <div class="sandbox-container">
    <SidebarNav
      :top-items="sidebarItemsTop"
      :bottom-items="sidebarItemsBottom"
      :profile-items="sidebarItemsProfile"
      profile-name="Marty McFly"
      :open="mobileSidebarOpen"
      :header-height="60"
      mobile-enabled
      :z-index="6"
      :mobile-top-offset="60"
      :mobile-header-visible="false"
      @click="sidebarItemClick"
      @toggle="sidebarToggled"
    >
      <template #header>
        <div class="kong-logo d-flex w-100">
          <router-link
            to="/"
            class="d-flex align-items-center w-100"
          >
            <GruceLogo />
            <div class="d-flex pl-4 konnect-header-title">
              <AppLogo />
            </div>
          </router-link>
        </div>
      </template>
    </SidebarNav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SidebarNav, SidebarToggle, SidebarPrimaryItem, SidebarProfileItem, SidebarSecondaryItem } from '../src'
import GruceLogo from './GruceLogo.vue'
import AppLogo from './AppLogo.vue'
import '@kong/kongponents/dist/style.css'

const activeItem = ref<SidebarPrimaryItem | SidebarSecondaryItem | SidebarProfileItem>()

const sidebarItemClick = (item: SidebarPrimaryItem | SidebarSecondaryItem | SidebarProfileItem): void => {
  activeItem.value = item
  console.log('activeItem: %o', activeItem.value)
}

const sidebarItemsTop = computed((): SidebarPrimaryItem[] => {
  return [
    {
      name: 'Overview',
      to: '/?overview',
      // external: true,
      newWindow: true,
      key: 'overview',
      icon: 'sharedConfig',
      // TODO: using this item as a default when `activeItem` is undefined
      active: !activeItem.value || (activeItem.value as SidebarPrimaryItem)?.key === 'overview',
    },
    {
      name: 'Runtime Manager',
      to: '/?runtime-manager',
      label: 'retail-sandbox-rg', // runtime group name
      key: 'runtime-manager',
      active: (activeItem.value as SidebarPrimaryItem)?.key === 'runtime-manager',
      // TODO: actually when you click on Runtime Manager it would not expand until the user picks a runtime group
      expanded: (activeItem.value as SidebarPrimaryItem)?.key === 'runtime-manager' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'runtime-manager',
      icon: 'runtimes',
      items: [
        {
          name: 'Runtime Instances',
          to: '/?runtime-instances',
          active: activeItem.value?.name === 'Runtime Instances',
        },
        {
          name: 'Gateway Services',
          to: '/?gateway-services',
          active: activeItem.value?.name === 'Gateway Services',
        },
        {
          name: 'Routes',
          to: '/?routes',
          active: activeItem.value?.name === 'Routes',
        },
        {
          name: 'Consumers',
          to: '/?consumers',
          active: activeItem.value?.name === 'Consumers',
        },
        {
          name: 'Plugins',
          to: '/?plugins',
          active: activeItem.value?.name === 'Plugins',
        },
        {
          name: 'Upstreams',
          to: '/?upstreams',
          active: activeItem.value?.name === 'Upstreams',
        },
        {
          name: 'Certificates',
          to: '/?certificates',
          active: activeItem.value?.name === 'Certificates',
        },
        {
          name: 'SNIs',
          to: '/?snis',
          active: activeItem.value?.name === 'SNIs',
        },
      ],
    },
    {
      name: 'Service Hub',
      key: 'service-hub',
      to: '/?service-hub',
      label: 'Deloreans',
      active: (activeItem.value as SidebarPrimaryItem)?.key === 'service-hub',
      // TODO: actually when you click on Service Hub it would not expand until the user picks a service
      expanded: (activeItem.value as SidebarPrimaryItem)?.key === 'service-hub' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'service-hub',
      icon: 'serviceHub',
      items: [
        {
          name: 'Overview',
          to: '/?service-overview',
          active: activeItem.value?.name === 'Overview',
        },
        {
          name: 'Versions',
          to: '/?service-versions',
          active: activeItem.value?.name === 'Versions',
        },
      ],
    },
    {
      name: 'Dev Portal',
      key: 'dev-portal',
      to: '/?dev-portal',
      active: (activeItem.value as SidebarPrimaryItem)?.key === 'dev-portal',
      // This item can always show the subnav
      expanded: (activeItem.value as SidebarPrimaryItem)?.key === 'dev-portal' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'dev-portal',
      icon: 'devPortal',
      items: [
        {
          name: 'Published Services',
          to: '/?published-services',
          active: activeItem.value?.name === 'Published Services',
        },
        {
          name: 'Appearance',
          to: '/?appearance',
          active: activeItem.value?.name === 'Appearance',
        },
        {
          name: 'Access Requests',
          to: '/?access-requests',
          active: activeItem.value?.name === 'Access Requests',
          badgeCount: 100,
        },
        {
          name: 'Developers',
          to: '/?developers',
          active: activeItem.value?.name === 'Developers',
        },
        {
          name: 'Applications',
          to: '/?applications',
          active: activeItem.value?.name === 'Applications',
        },
        {
          name: 'Settings',
          to: '/?settings',
          active: activeItem.value?.name === 'Settings',
        },
      ],
    },
    {
      name: 'Analytics',
      key: 'analytics',
      to: '/?analytics',
      active: (activeItem.value as SidebarPrimaryItem)?.key === 'analytics',
      // This item can always show the subnav
      expanded: (activeItem.value as SidebarPrimaryItem)?.key === 'analytics' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'analytics',
      icon: 'vitalsChart',
      items: [
        {
          name: 'Overview',
          to: '/?overview',
          active: activeItem.value?.name === 'Overview',
        },
        {
          name: 'Reports',
          to: '/?reports',
          active: activeItem.value?.name === 'Reports',
        },
      ],
    },
  ]
})

const sidebarItemsBottom = computed((): SidebarPrimaryItem[] => {
  return [
    {
      name: 'Organization',
      key: 'organization',
      to: '/?organization',
      active: (activeItem.value as SidebarPrimaryItem)?.key === 'organization',
      // This item can always show the subnav
      expanded: (activeItem.value as SidebarPrimaryItem)?.key === 'organization' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'organization',
      icon: 'organizations',
      items: [
        {
          name: 'Teams',
          to: '/?teams',
          active: activeItem.value?.name === 'Teams',
        },
        {
          name: 'Users',
          to: '/?users',
          active: activeItem.value?.name === 'Users',
        },
      ],
    },
    {
      name: 'Settings',
      key: 'settings',
      to: '/?settings',
      active: (activeItem.value as SidebarPrimaryItem)?.key === 'settings',
      // This item can always show the subnav
      expanded: (activeItem.value as SidebarPrimaryItem)?.key === 'settings' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'settings',
      icon: 'cogwheel',
      items: [
        {
          name: 'Billing and Usage',
          to: '/?billing-and-usage',
          active: activeItem.value?.name === 'Billing and Usage',
        },
        {
          name: 'Auth Settings',
          to: '/?auth-settings',
          active: activeItem.value?.name === 'Auth Settings',
        },
      ],
    },
  ]
})

const sidebarItemsProfile = computed((): SidebarProfileItem[] => {
  return [
    {
      name: 'Personal access tokens',
      to: '/?personal-access-tokens',
    },
    {
      name: 'External',
      to: 'https://google.com/',
      newWindow: true,
    },
    {
      name: 'Logout',
      to: '/?logout',
      hasDivider: true,
    },
  ]
})

const mobileSidebarOpen = ref(false)
const sidebarToggled = (isOpen: boolean) => {
  mobileSidebarOpen.value = isOpen
}
</script>

<style lang="scss">
$navbar-height: 60px;

html,
body {
  padding: 0;
  margin: 0;
  font-family: "Inter", Helvetica, Arial, sans-serif;
}

.logo-link {
  color: #fff;
  text-decoration: none;
}

.sandbox-container {
  display: flex;
}

main {
  width: 100%;
  min-height: 2000px; // fake a height so the container scrolls
  margin-top: $navbar-height;
  padding: 16px 24px;

  @media screen and (min-width: 768px) {
    margin-left: 240px; // $sidebar-width
  }
}

.sidebar-container {
  height: calc(100vh - #{$navbar-height});
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: $navbar-height;
  background: #eee;

  @media screen and (min-width: 768px) {
    left: 240px;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 16px;
    color: var(--blue-500);
    width: 100%;
    padding: 0 24px;
  }

  .mobile-logo {
    display: flex;
    align-items: center;

    @media screen and (min-width: 768px) {
      display: none;
    }
  }
}
</style>
