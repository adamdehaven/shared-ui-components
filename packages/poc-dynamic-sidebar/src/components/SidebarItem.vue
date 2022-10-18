<template>
  <li
    :data-testid="item.testId ? item.testId : null"
    :class="[!subnavItem ? 'sidebar-item-primary' : 'sidebar-item-secondary', { 'expanded': (item as SidebarPrimaryItem).expanded }, { 'active': item.active }]"
  >
    <component
      :is="useAnchorTag ? 'a' : 'router-link'"
      :to="!item.external ? item.to : null"
      :href="useAnchorTag ? item.to || '#' : null"
      :target="openInNewWindow ? '_blank' : null"
      @click="itemClick(item)"
    >
      <div
        class="sidebar-item-display"
        :class="{ 'has-label': !!(item as SidebarPrimaryItem).label && (item as SidebarPrimaryItem).expanded }"
      >
        <div
          v-if="(item as SidebarPrimaryItem).icon"
          class="sidebar-item-icon"
        >
          <KIcon
            :icon="String((item as SidebarPrimaryItem).icon)"
            :color="item.active || (item as SidebarPrimaryItem).expanded ? 'var(--white, #fff)' : '#B5BECD'"
            size="20"
          />
        </div>
        <div class="sidebar-item-name">
          <div>{{ item.name }}</div>
          <div
            v-if="(item as SidebarPrimaryItem).label && (item as SidebarPrimaryItem).expanded"
            class="sidebar-item-label"
          >
            {{ (item as SidebarPrimaryItem).label }}
          </div>
        </div>
      </div>
    </component>
    <ol
      v-if="(item as SidebarPrimaryItem).items && (item as SidebarPrimaryItem).expanded"
      class="level-secondary"
    >
      <SidebarItem
        v-for="childItem in (item as SidebarPrimaryItem).items"
        :key="childItem.name"
        :item="childItem"
        :subnav-item="true"
        @click="itemClick(childItem)"
      />
    </ol>
  </li>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { SidebarPrimaryItem, SidebarSecondaryItem } from '../types'
import { KIcon } from '@kong/kongponents'
import '@kong/kongponents/dist/style.css'

const emit = defineEmits(['click'])

const props = defineProps({
  item: {
    type: Object as PropType<SidebarPrimaryItem | SidebarSecondaryItem>,
    required: true,
  },
  subnavItem: {
    type: Boolean,
    default: false,
  },
})

// Force anchor tag if `item.external` is true, or `item.to` starts with `http`
const useAnchorTag = computed((): boolean => (!!props.item.external && typeof props.item.to === 'string') || (typeof props.item.to === 'string' && props.item.to.startsWith('http')))

// Should component use an anchor tag and open the link in a new window
const openInNewWindow = computed((): boolean => {
  if (!props.item.to || typeof props.item.to !== 'string' || !props.item.external) {
    return false
  }

  return props.item.external && props.item.to.startsWith('http')
})

const itemClick = (item: SidebarPrimaryItem | SidebarSecondaryItem) => {
  emit('click', item)
}
</script>

<style lang="scss" scoped>
// Shared styles for the primary and secondary elements
li {
  display: flex;
  flex-direction: column;
  position: relative;
  white-space: nowrap;
  margin-bottom: 4px;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 48px;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    color: var(--steel-300, #A3B6D9);
    cursor: pointer;
    transition: color .2s ease-out;

    // SVG color transition (initial values)
    :deep(path) {
      color: currentColor;
      fill: currentColor;
      transition: all .2s ease-out;
    }

    &:hover {
      color: var(--white, #fff);

      // SVG fill color on hover
      :deep(path) {
        fill: var(--white, #fff);
      }
    }
  }

  &.active > a,
  &.expanded > a {
    color: var(--white, #fff);
  }

  ol.level-secondary {
    padding-top: 4px;
    border-top: 1px solid var(--black-25, rgba(0, 0, 0, 0.25));
  }
}

// Primary-level nav item
li.sidebar-item-primary {
  &.active,
  &.expanded {
    background: rgba(255, 255, 255, .1);
    border-radius: 8px;
  }

  > a > .sidebar-item-display {
    &.has-label {
      padding-top: 12px;
      padding-bottom: 12px;
    }
  }
}

// Secondary-level nav item
li.sidebar-item-secondary {
 a {
  min-height: 36px;
  font-size: 16px;
  // Add a left border by default so the item doesn't "shift" to the right when active
  border-left: 2px solid transparent;
 }

  &.active > a {
    color: var(--white, #fff);
    background: var(--black-25, rgba(0, 0, 0, .25));
    border-left: 2px solid var(--teal-300, #169FCC);
  }
}

.sidebar-item-display {
  display: flex;
  padding: 0 16px;

  .sidebar-item-name {
    line-height: 1.3;
    -webkit-user-select: none;
    user-select: none;
  }

  .sidebar-item-label {
    color: var(--steel-300, #A3B6D9);
    font-size: 12px;
  }

  .sidebar-item-icon {
    display: flex;
    padding-right: 16px;
    line-height: 1;
  }
}
</style>
