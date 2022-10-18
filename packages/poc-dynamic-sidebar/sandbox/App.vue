<template>
  <div class="sandbox-container">
    <div class="sidebar-container">
      <DynamicSidebar
        :top-items="sidebarItemsTop"
        :bottom-items="sidebarItemsBottom"
        @click="sidebarItemClick"
      >
        <template #logo>
          <p>This is my logo for now</p>
        </template>
      </DynamicSidebar>
    </div>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DynamicSidebar, SidebarPrimaryItem, SidebarSecondaryItem } from '../src'
import '@kong/kongponents/dist/style.css'

const activeItem = ref<SidebarPrimaryItem>()

const sidebarItemClick = (item: SidebarPrimaryItem): void => {
  activeItem.value = item
  console.log('activeItem: %o', activeItem.value)
}

const sidebarItemsTop = computed((): SidebarPrimaryItem[] => {
  return [
    {
      name: 'Overview',
      to: '/?overview',
      key: 'overview',
      icon: 'sharedConfig',
      // TODO: using this item as a default when `activeItem` is undefined
      active: !activeItem.value || activeItem.value?.key === 'overview',
      testId: 'overview',
    },
    {
      name: 'Runtime Manager',
      to: '/?runtime-manager',
      label: 'retail-sandbox-rg', // runtime group name
      key: 'runtime-manager',
      active: activeItem.value?.key === 'runtime-manager',
      // TODO: actually when you click on Runtime Manager it would not expand until the user picks a runtime group
      expanded: activeItem.value?.key === 'runtime-manager' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'runtime-manager',
      testId: 'runtime-manager',
      icon: 'runtimes',
      items: [
        {
          name: 'Runtime Instances',
          testId: 'runtime-instances',
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
      active: activeItem.value?.key === 'service-hub',
      // TODO: actually when you click on Service Hub it would not expand until the user picks a service
      expanded: activeItem.value?.key === 'service-hub' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'service-hub',
      testId: 'service-hub',
      icon: 'serviceHub',
      items: [
        {
          name: 'Services',
          to: '/?services',
          active: activeItem.value?.name === 'Services',
          testId: 'services',
        },
      ],
    },
    {
      name: 'Dev Portal',
      key: 'dev-portal',
      to: '/?dev-portal',
      active: activeItem.value?.key === 'dev-portal',
      // This item can always show the subnav
      expanded: activeItem.value?.key === 'dev-portal' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'dev-portal',
      testId: 'dev-portal',
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
      active: activeItem.value?.key === 'analytics',
      // This item can always show the subnav
      expanded: activeItem.value?.key === 'analytics' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'analytics',
      testId: 'analytics',
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
      to: '/?organization',
      active: activeItem.value?.key === 'organization',
      // This item can always show the subnav
      expanded: activeItem.value?.key === 'organization' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'organization',
      testId: 'organization',
      icon: 'people',
      items: [
        {
          name: 'Teams',
          testId: 'teams',
          to: '/?teams',
          active: activeItem.value?.name === 'Teams',
        },
        {
          name: 'Users',
          testId: 'users',
          to: '/?users',
          active: activeItem.value?.name === 'Users',
        },
      ],
    },
    {
      name: 'Settings',
      to: '/?settings',
      active: activeItem.value?.key === 'settings',
      // This item can always show the subnav
      expanded: activeItem.value?.key === 'settings' || (activeItem.value as SidebarSecondaryItem)?.parentKey === 'settings',
      testId: 'settings',
      icon: 'cogwheel',
      items: [
        {
          name: 'Billing and Usage',
          testId: 'billing-and-usage',
          to: '/?billing-and-usage',
          active: activeItem.value?.name === 'Billing and Usage',
        },
        {
          name: 'Auth Settings',
          testId: 'auth-settings',
          to: '/?auth-settings',
          active: activeItem.value?.name === 'Auth Settings',
        },
      ],
    },
  ]
})
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
}

.sandbox-container {
  display: flex;

  main {
    padding: 16px 0;
    margin-left: 36px;
  }
}

.sidebar-container {
  min-width: 245px;
  height: 100vh;
}
</style>
