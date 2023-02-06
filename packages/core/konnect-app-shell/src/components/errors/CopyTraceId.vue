<template>
  <div
    v-if="traceId"
    class="copy-trace-id"
    data-testid="copy-trace-id"
  >
    <KTooltip
      :label="tooltipText"
    >
      <KClipboardProvider v-slot="{ copyToClipboard }">
        <KButton
          data-testid="copy-traceid-button"
          icon="copy"
          @click="onCopyTraceId(copyToClipboard)"
        >
          {{ t('copyTraceId.traceId') }} : <span class="pl-2">{{ traceId }}</span>
        </KButton>
      </KClipboardProvider>
    </KTooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import composables from '../../composables'

const props = defineProps({
  traceId: {
    type: String,
    default: '',
  },
})

const { i18n: { t } } = composables.useI18n()
const tooltipText = ref(t('copyTraceId.tooltipText'))

const onCopyTraceId = async (copyToClipboard: (str: string) => Promise<boolean>): Promise<void> => {
  if (await copyToClipboard(props.traceId)) {
    tooltipText.value = t('copyTraceId.success')
    setTimeout(() => {
      tooltipText.value = t('copyTraceId.tooltipText')
    }, 1500)
  }
}
</script>
