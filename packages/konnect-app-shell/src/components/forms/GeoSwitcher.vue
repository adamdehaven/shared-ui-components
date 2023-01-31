<template>
  <div
    v-if="sessionExists && multiGeoEnabled && availableGeos && availableGeos.length"
    class="geo-switcher"
  >
    <NavbarDropdownMenu
      v-if="global"
      :key="`global-${showGlobalGeo}`"
      data-testid="geo-switcher-global-menu"
      :disabled="disabled || showGlobalGeo"
      :options="availableGeos"
      :tooltip="showGlobalGeo ? t('geo.global_disabled_tooltip') : undefined"
      width="220"
      @change="onGeoChange"
    >
      <KDropdownItem
        v-for="option in availableGeos"
        :key="option.value"
        :data-testid="'geo-switcher-global-menu-select-' + option.value"
        :disabled="availableGeos.length === 1"
        :selected="option.selected"
        @click="onGeoChange(option)"
      >
        {{ option.label }}
      </KDropdownItem>
      <KDropdownItem
        v-if="!isEnterprise"
        data-testid="geo-switcher-global-more-regions-option"
        has-divider
      >
        <KExternalLink
          class="width-100"
          data-testid="geo-switcher-global-more-regions-option-link"
          hide-icon
          :href="externalLinks.pricing"
        >
          <div class="display-block">
            <div>{{ t('geo.more_regions') }}</div>
            <div class="margin-top-2">
              <KonnectEnterpriseLogo />
            </div>
          </div>
        </KExternalLink>
      </KDropdownItem>
    </NavbarDropdownMenu>

    <div
      v-else
      :class="{ 'label-container': label && labelPosition === 'left' }"
    >
      <KLabel
        v-if="label && labelPosition === 'left'"
        class="label-class"
        data-testid="geo-switcher-select-label"
      >
        {{ label }}
      </KLabel>
      <KSelect
        :key="`non-global-${showGlobalGeo}`"
        appearance="select"
        data-testid="geo-switcher-select"
        :disabled="disabled"
        :items="availableGeos"
        :label="label && labelPosition !== 'left' ? label : undefined"
        :readonly="showGlobalGeo || disabled"
        :width="width"
        @change="onGeoChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import composables from '../../composables'
import type { Geo } from '../../types'

import type { NavbarDropdownMenuItem } from '@kong-ui-public/app-layout'
import { NavbarDropdownMenu } from '@kong-ui-public/app-layout'
import { KonnectEnterpriseLogo } from '../icons'

import { FeatureFlags } from '../../types'
import externalLinks from '../../external-links'

const props = defineProps({
  /**
   * Is the component displaying the global geolocation switch in the navigation bar?
   * Default: false
   */
  global: {
    type: Boolean,
    default: false,
  },
  /**
   * The label text to show above the select element
   */
  label: {
    type: String,
    default: '',
    required: false,
  },
  labelPosition: {
    type: String,
    default: 'left',
    validator: (position: string): boolean => ['left', 'top'].includes(position),
  },
  /**
   * The width to pass to the KSelect element
   */
  width: {
    type: String,
    default: '220', // Prevent text wrapping in the dropdown
  },
})
const { useI18n, useLaunchDarkly, useSession, useGeo, useWindow } = composables

const emit = defineEmits(['change'])

const win = useWindow()
// TODO: KHCP-5744 this needs to be fixed to support route is change by consuming app via vue-router from geo to global.
const showGlobalGeo = ref(win.getLocationPathname().startsWith('/global'))
const disabled = ref(false)
const { i18n: { t } } = useI18n()
const { geos, activeGeoOverride, getActiveGeo, setActiveGeoOverride } = useGeo()
const { session, exists: sessionExists } = useSession()
const isEnterprise = computed((): boolean => sessionExists.value && Boolean(session.value?.organization?.isEnterprise))

const { evaluateFeatureFlag, isInitialized } = useLaunchDarkly()

const multiGeoEnabled = computed((): boolean => {
  if (isInitialized.value) {
    return evaluateFeatureFlag(FeatureFlags.MultiGeo, false)
  }
  return false
})

const availableGeos = computed((): NavbarDropdownMenuItem[] => {
  if (showGlobalGeo.value) {
    return [
      {
        value: 'global',
        label: t('geo.global'),
        selected: true,
      },
    ]
  }

  // If we are displaying the global geo switcher in the navbar, use the active geo
  if (props.global) {
    return geos.value.map((geo: Geo) => ({
      value: geo.code,
      label: geo.name,
      selected: geo.isActive,
    }))
  }

  // Otherwise, we are displaying a local geo switcher within a component in the `/global/*` route
  // so allow overriding the active geo
  return geos.value.map((geo: Geo) => ({
    value: geo.code,
    label: geo.name,
    selected: activeGeoOverride.value?.code ? geo.isActiveOverride : geo.isActive,
  }))
})

const onGeoChange = (item: NavbarDropdownMenuItem): void => {
  // If displaying the global switcher, and not showing the 'Global' static option, and the user did not select the already active geo, trigger rehydration
  if (props.global && !showGlobalGeo.value) {
    // If the user selected the already active geo, exit early
    if (item.value === getActiveGeo({ allowOverride: false })?.code) {
      return
    }

    disabled.value = true
    const winOrigin = win.getLocationOrigin()
    const winPath = win.getLocationPathname()
    win.setLocationAssign(`${winOrigin}/${item.value}/${winPath.split('/').splice(2, 1)}`)

    return
  }

  // Since it's not the global switcher, trigger a geo override in the store
  // If the selected geo === the active one, just clear the override
  setActiveGeoOverride(item.value === getActiveGeo({ allowOverride: false })?.code ? null : item.value)

  // Emit the new value for non-global usage
  emit('change', geos.value.filter((geo: Geo) => geo.code === item.value)[0])
}

</script>

<style lang="scss" scoped>
@import "../../styles/variables";

.geo-switcher {
  --KButtonFontSize: 14px;

  // Decrease font-size when on mobile
  @media screen and (min-width: $viewport-sm) {
    --KButtonFontSize: unset;
  }

  .label-container {
    align-items: center;
    display: flex;
  }
  .width-100 {
    width: 100%;
  }
  .display-block {
    display: block;
  }
  .margin-top-2 {
    margin-top: 8px;
  }
  .label-class {
    margin-bottom: 0;
    margin-right: 12px;
  }
}
</style>
