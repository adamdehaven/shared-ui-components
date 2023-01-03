<template>
  <div
    v-if="multiGeoEnabled && availableGeos && availableGeos.length"
    class="geo-switcher"
  >
    <TopBarDropdownMenu
      v-if="global"
      :key="`global-${showGlobalGeo}`"
      data-testid="geo-switcher-global-menu"
      :disabled="disabled || showGlobalGeo"
      :options="availableGeos"
      :tooltip="showGlobalGeo ? english.geo.globalDisabledTooltip : undefined"
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
        <ExternalLink
          class="w-100"
          data-testid="geo-switcher-global-more-regions-option-link"
          hide-icon
          :href="pricingURL"
        >
          <div class="d-block">
            <div>{{ english.geo.moreRegions }}</div>
            <div class="mt-2">
              <HelpKonnectEnterpriseLogo />
            </div>
          </div>
        </ExternalLink>
      </KDropdownItem>
    </TopBarDropdownMenu>

    <div
      v-else
      :class="{ 'd-flex align-items-center': label && labelPosition === 'left' }"
    >
      <KLabel
        v-if="label && labelPosition === 'left'"
        class="mr-3 mb-0"
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

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import composables from '@KHCP/composables'
import { useGeoStore, Geo, useSessionStore } from '@KHCP/stores'
import { storeToRefs } from 'pinia'
import TopBarDropdownMenu, { TopBarDropdownMenuItem } from '@KHCP/components/topbar/TopBarDropdownMenu.vue'
import ExternalLink from '@KHCP/components/ExternalLink.vue'
import HelpKonnectEnterpriseLogo from '@KHCP/components/logos/HelpKonnectEnterpriseLogo.vue'
import { FeatureFlags } from '@KHCP/core/enums/feature-flags'
import externalLinks from '@KHCP/external-links'

export default defineComponent({
  name: 'GeoSwitcher',
  components: {
    TopBarDropdownMenu,
    ExternalLink,
    HelpKonnectEnterpriseLogo
  },
  props: {
    /**
     * Is the component displaying the global geolocation switch in the navigation bar?
     * Default: false
     */
    global: {
      type: Boolean,
      default: false
    },
    /**
     * The label text to show above the select element
     */
    label: {
      type: String,
      default: '',
      required: false
    },
    labelPosition: {
      type: String,
      default: 'left',
      validator: (position: string): boolean => ['left', 'top'].includes(position)
    },
    /**
     * The width to pass to the KSelect element
     */
    width: {
      type: String,
      default: '220' // Prevent text wrapping in the dropdown
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const sessionStore = useSessionStore()
    const { isEnterprise } = storeToRefs(sessionStore)
    const geoStore = useGeoStore()
    const win = composables.useWindow()
    const showGlobalGeo = ref(false)
    const disabled = ref(false)
    const multiGeoEnabled = composables.useLDFeatureFlag(FeatureFlags.MultiGeo, false)
    const i18n = composables.useI18n()

    const availableGeos = computed((): TopBarDropdownMenuItem[] => {
      if (showGlobalGeo.value) {
        return [
          {
            value: 'global',
            label: i18n.source.geo.global,
            selected: true
          }
        ]
      }

      // If we are displaying the global geo switcher in the navbar, use the active geo
      if (props.global) {
        return geoStore.geos.map((geo: Geo) => ({
          value: geo.code,
          label: geo.name,
          selected: geo.isActive
        }))
      }

      // Otherwise, we are displaying a local geo switcher within a component in the `/global/*` route
      // so allow overriding the active geo
      return geoStore.geos.map((geo: Geo) => ({
        value: geo.code,
        label: geo.name,
        selected: !!geoStore.activeGeoOverride && geoStore.activeGeoOverride?.code ? geo.isActiveOverride : geo.isActive
      }))
    })

    const onGeoChange = (item: TopBarDropdownMenuItem): void => {
      // If displaying the global switcher, and not showing the 'Global' static option, and the user did not select the already active geo, trigger rehydration
      if (props.global && !showGlobalGeo.value) {
        // If the user selected the already active geo, exit early
        if (item.value === geoStore.getActiveGeo({ allowOverride: false })?.code) {
          return
        }

        disabled.value = true
        // eslint-disable-next-line no-undef
        win.setLocationHref(`${globalThis.location.origin}/${item.value}/${globalThis.location.pathname.split('/').splice(2, 1)}`)

        return
      }

      // Since it's not the global switcher, trigger a geo override in the store
      // If the selected geo === the active one, just clear the override
      geoStore.setActiveGeoOverride(item.value === geoStore.getActiveGeo({ allowOverride: false }).code ? null : item.value)

      // Emit the new value for non-global usage
      emit('change', geoStore.geos.filter((geo: Geo) => geo.code === item.value)[0])
    }

    const pricingURL = externalLinks.pricing

    return {
      availableGeos,
      onGeoChange,
      disabled,
      showGlobalGeo,
      pricingURL,
      english: i18n.source,
      isEnterprise,
      multiGeoEnabled
    }
  },
  watch: {
    '$route.path': {
      handler(newPath, oldPath) {
        // If the path didn't change, there's no need to refresh the nav
        // also - we only need showGlobal if global prop is set to true
        if (this.global && newPath !== oldPath) {
          this.showGlobalGeo = newPath.startsWith('/global/')
        }
      },
      immediate: true
    }
  }
})
</script>

<style lang="scss" scoped>
.geo-switcher {
  --KButtonFontSize: 14px;

  // Decrease font-size when on mobile
  @media screen and (min-width: $viewport-sm) {
    --KButtonFontSize: unset;
  }
}
</style>
