<template>
  <aside class="kong-ui-poc-dynamic-sidebar">
    <div
      v-if="hasLogo"
      class="logo-container"
    >
      <slot name="logo" />
    </div>
    <nav>
      <ol class="level-primary">
        <SidebarItem
          v-for="item in topNavItems"
          :key="item.name"
          :item="item"
          @click="sidebarItemClicked"
        />

        <li
          v-if="topNavItems.length && bottomNavItems.length"
          class="sidebar-level-divider"
        />

        <SidebarItem
          v-for="item in bottomNavItems"
          :key="item.name"
          :item="item"
          @click="sidebarItemClicked"
        />
      </ol>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, useSlots, PropType } from 'vue'
import { SidebarPrimaryItem } from '../types'
import SidebarItem from './SidebarItem.vue'
import '@kong/kongponents/dist/style.css'

const emit = defineEmits(['click'])

const sidebarItemClicked = (item: SidebarPrimaryItem): void => {
  emit('click', item)
}

const props = defineProps({
  topItems: {
    type: Array as PropType<SidebarPrimaryItem[]>,
    required: false,
    default: () => ([]),
  },
  bottomItems: {
    type: Array as PropType<SidebarPrimaryItem[]>,
    required: false,
    default: () => ([]),
  },
})

const slots = useSlots()
const hasLogo = computed(() => !!slots.logo)

const prepareNavItems = (items: SidebarPrimaryItem[]): SidebarPrimaryItem[] => {
  return items.map((item: SidebarPrimaryItem) => {
    // If `item.key` is not provided, generate a key from the `item.name`
    if (!item.key || !item.key.trim()) {
      item.key = String(item.name || '').trim().toLowerCase().replace(/[^[a-z]/gi, '-')
    }

    // Loop through all secondary nav items and add the `parentKey` property set to the item.key value
    for (const childItem of item.items || []) {
      childItem.parentKey = item.key
    }

    return item
  })
}

const topNavItems = computed(() => props.topItems.length ? prepareNavItems(props.topItems) : [])
const bottomNavItems = computed(() => props.bottomItems.length ? prepareNavItems(props.bottomItems) : [])
</script>

<style lang="scss" scoped>
.kong-ui-poc-dynamic-sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--kongui-poc-dynamic-sidebar-background, linear-gradient(180deg, #053280 0%, #021D4B 100%));
  overflow-y: auto;
  font-family: "Inter", Helvetica, Arial, sans-serif;
}

li.sidebar-level-divider {
  width: 100%;
  height: 1px;
  margin: 32px 0;
  background-color: var(--steel-300, #A3B6D9);
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 0 16px;
  min-height: 60px;
}
</style>

<style lang="scss">
// Scope with wrapper class intead of using `scoped` so these styles will apply to child components
.kong-ui-poc-dynamic-sidebar {

  // Shared styles for the primary and secondary elements
  ol {
    margin: 0;
    padding: 0;
    list-style: none;

    &.level-primary {
      padding: 0 8px;
    }
  }
}
</style>
