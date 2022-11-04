<template>
  <aside
    class="kong-ui-sidebar-nav"
  >
    <div
      v-if="hasHeader"
      class="sidebar-header"
      :style="headerContainerStyles"
    >
      <slot name="header" />
    </div>
    <nav :style="navContainerStyles">
      <ul
        v-if="topNavItems.length"
        class="level-primary top-items"
      >
        <SidebarItem
          v-for="item in topNavItems"
          :key="item.name"
          :item="item"
          @click="itemClick"
        />
      </ul>

      <div
        v-if="topNavItems.length && bottomNavItems.length"
        class="sidebar-level-divider"
        role="separator"
      />

      <ul
        v-if="bottomNavItems.length"
        class="level-primary bottom-items"
      >
        <SidebarItem
          v-for="item in bottomNavItems"
          :key="item.name"
          :item="item"
          @click="itemClick"
        />
      </ul>
    </nav>

    <SidebarFooter
      v-if="profileName || profileItems.length"
      :name="profileName"
      :item-count="profileItems.length"
      class="sidebar-profile-menu"
    >
      <KDropdownItem
        v-for="item in profileItems"
        :key="item.name"
        :has-divider="item.hasDivider"
        :class="[{ 'has-divider': item.hasDivider },{ 'external-profile-dropdown-link': item.external && typeof item.to === 'string' }]"
        :item="item.external && typeof item.to === 'string' ? null : { label: item.name, to: item.to }"
        @click="itemClick(item)"
      >
        <a
          v-if="item.external && typeof item.to === 'string'"
          class="sidebar-item-external-link"
          :href="item.to"
          target="_blank"
        >
          {{ item.name }}
          <KIcon
            icon="externalLink"
            color="var(--black-70, rgba(0,0,0,0.7))"
            size="20"
            viewBox="0 0 20 20"
          />
        </a>
      </KDropdownItem>
    </SidebarFooter>
  </aside>
</template>

<script setup lang="ts">
import { computed, useSlots, PropType } from 'vue'
import { SidebarPrimaryItem, SidebarProfileItem } from '../types'
import SidebarItem from './SidebarItem.vue'
import SidebarFooter from './SidebarFooter.vue'

const emit = defineEmits(['click'])

const itemClick = (item: SidebarPrimaryItem | SidebarProfileItem): void => {
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
  profileItems: {
    type: Array as PropType<SidebarProfileItem[]>,
    required: false,
    default: () => ([]),
  },
  profileName: {
    type: String,
    required: false,
    default: '',
  },
  headerHeight: {
    type: Number,
    required: false,
    default: 60,
  },
})

const headerContainerStyles = computed(() => ({
  minHeight: `${props.headerHeight}px`,
}))

const navContainerStyles = computed(() => ({
  marginTop: `${props.headerHeight}px`,
}))

const slots = useSlots()
const hasHeader = computed(() => !!slots.header)

const prepareNavItems = (items: SidebarPrimaryItem[]): SidebarPrimaryItem[] => {
  return items.map((item: SidebarPrimaryItem) => {
    if (item) {
      // If `item.key` is not provided, generate a key from the `item.name`
      if (!item.key || !item.key?.trim()) {
        item.key = String(item.name || '').trim().toLowerCase().replace(/[^[a-z]/gi, '-')
      }

      // If `item.testId` is not provided, generate a testId from the `item.name`
      if (!item.testId || !item.testId?.trim()) {
        item.testId = String(item.name || '').trim().toLowerCase().replace(/[^[a-z]/gi, '-')
      }

      // Loop through all secondary nav items and add the `parentKey` property set to the item.key value
      for (const childItem of item.items || []) {
        childItem.parentKey = item.key

        // If `childItem.testId` is not provided, generate a testId from the `item.name`
        if (!childItem.testId || !childItem.testId?.trim()) {
          childItem.testId = String(childItem.name || '').trim().toLowerCase().replace(/[^[a-z]/gi, '-')
        }
      }
    }

    return item
  })
}

const topNavItems = computed(() => props.topItems.length ? prepareNavItems(props.topItems) : [])
const bottomNavItems = computed(() => props.bottomItems.length ? prepareNavItems(props.bottomItems) : [])
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.kong-ui-sidebar-nav {
  position: relative;
  display: flex;
  flex-direction: column;
  width: $sidebar-width;
  height: 100vh;
  background: $sidebar-background;

  nav {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll; // Must use `scroll` so that the scrollbar width is always accounted for. Cannot use `overlay` here as it breaks in Firefox
    padding-top: $sidebar-header-spacing;
    @include scrollbarBase;

    // Only show scrollbar when hovering over nav
    &:hover {
      @include scrollbarVisible;
    }
  }

  :deep(.k-dropdown-item) {
    font-size: $sidebar-item-font-size;
    line-height: 1.3;
  }
}

.sidebar-level-divider {
  width: calc(100% - 32px);
  height: 1px;
  min-height: 1px; // required for when scrollbar is present
  margin: 24px auto;
  background-color: rgba(#fff, 0.5);
}

.sidebar-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #fff;
  background: linear-gradient(180deg, #003694 70.83%, rgba(0, 54, 148, 0) 100%);
  -webkit-user-select: none;
  user-select: none;

  // Force the immediate child to be display flex
  :deep(>) {
    * {
      display: flex;
    }
  }

  &:after{
    content: '';
    display: block;
    background-image: linear-gradient(#003496, #78785400);
    height: $sidebar-header-spacing;
    margin-bottom: -$sidebar-header-spacing;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
  }
}

.external-profile-dropdown-link {
  // Override padding on `button` element to apply to `.sidebar-item-external-link` instead
  :deep(button.k-dropdown-item-trigger) {
    padding: 0 !important;
  }
}

.sidebar-item-external-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 1.3;
  text-decoration: none;

  .external-profile-dropdown-link & {
    padding: var(--spacing-md) var(--spacing-lg);
  }

  :deep(.kong-icon) {
    display: inline-flex;
    margin-bottom: -7px;
  }
}
</style>

<style lang="scss">
@import "../styles/variables";

// Scope with wrapper class intead of using `scoped` so these styles will apply to child components
.kong-ui-sidebar-nav {
  // Shared styles for the primary and secondary elements
  .level-primary,
  .level-secondary {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .level-primary {
    display: flex;
    flex-direction: column;
    padding: 0 0 0 8px;

    &:last-of-type {
      margin-bottom: $sidebar-header-spacing * 2;
    }
  }
}
</style>
