<template>
  <section class="geo-select-form">
    <div>
      <div
        class="select-region-card col-10 col-md-6"
      >
        <KCard has-shadow>
          <template #body>
            <div class="form-logo">
              <KonnectLogo
                height="26"
                width="180"
              />
            </div>
            <form
              data-testid="kong-ui-konnect-app-shell-region-select-form"
              @submit.prevent
            >
              <p
                v-if="t('geo.selection.instruction_text')"
                class="select-region-instruction-text"
              >
                {{ t('geo.selection.instruction_text') }}
              </p>

              <KSelect
                id="select-region-control"
                v-model="selectedGeoCode"
                appearance="select"
                autocomplete
                data-testid="kong-ui-konnect-app-shell-region-select-input"
                :items="regionOptions"
                :label="t('geo.selection.region_select_label')"
                :label-attributes="{ for: 'select-region-control' }"
                :placeholder="t('geo.selection.region_select_placeholder')"
                @selected="(item: GeoSelectOptionItem) => onRegionSelected(item)"
              />

              <KButton
                appearance="primary"
                class="select-submit"
                data-testid="kong-ui-konnect-app-shell-region-select-submit"
                :disabled="!selectedGeoCode || loading"
                type="submit"
                @click.prevent="submitForm"
              >
                <KIcon
                  v-if="loading"
                  class="button-loading-spinner"
                  color="var(--grey-400)"
                  icon="spinner"
                  size="16"
                />
                {{ t('geo.selection.submit') }}
              </KButton>
            </form>
          </template>
        </KCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import composables from '../../composables'
import type { GeoSelectOptionItem, Geo } from '../../types'
import { KonnectLogo } from '@kong-ui/app-layout'

const emit = defineEmits<{
  (e: 'select', geo: Geo): void,
}>()

const { i18n: { t } } = composables.useI18n()
const { geos, setActiveGeo, getActiveGeo } = composables.useGeo()
const loading = ref<boolean>(false)

const regionOptions = computed((): GeoSelectOptionItem[] => {
  // Loop through all available regions from the store
  return geos.value.map((geo: Geo, idx: number) => {
    return {
      value: geo.code,
      label: geo.name,
      selected: idx === 0,
    }
  })
})

const selectedGeoCode = ref<string>()

// Set the selected option to the selected geo or fallback to the first item in the array
watchEffect(() => {
  if (selectedGeoCode.value) {
    return
  }

  selectedGeoCode.value = regionOptions.value.find((geoItem: GeoSelectOptionItem) => geoItem.selected)?.value || regionOptions.value[0]?.value
})

const onRegionSelected = (item: GeoSelectOptionItem) => {
  selectedGeoCode.value = item.value
}

const submitForm = async (): Promise<void> => {
  loading.value = true

  // Store the selected region
  setActiveGeo(selectedGeoCode.value)

  const activeGeo: Geo = getActiveGeo({ allowOverride: false }) as Geo

  // Emit the selected geo
  emit('select', activeGeo)
}
</script>

<style lang="scss" scoped>
.geo-select-form {
  --KCardPaddingY: var(--spacing-xxl, 48px);
  --KCardPaddingX: 42px;
  --KCardBorderRadius: 10px;
  --KButtonPaddingY: var(--spacing-sm, 12px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;

  .select-region-card {
    max-width: 428px;
  }

  .select-region-instruction-text {
    font-size: 16px;
    line-height: 1.5;
    margin: 24px 0;
  }

  .k-select {
    width: 100% !important;

    .k-select-input {
      width: 100% !important;
      height: 44px !important;
    }
  }
}

.form-logo {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.select-submit {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 32px;
  font-size: 18px;
}

.button-loading-spinner {
  padding-right: 0;
  margin-right: 8px;
}
</style>
