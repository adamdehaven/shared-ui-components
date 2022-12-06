<template>
  <div class="kong-ui-copy-uuid">
    <div
      :title="uuid"
      data-testid="copy-id"
    >
      <div
        :class="[
          'uuid-container',
          truncated ? 'truncated-uuid' : null,
          useMono ? 'mono' : null
        ]"
      >
        {{ isHidden ? '**********' : uuid }}
      </div>
    </div>
    <div class="uuid-icon-wrapper">
      <KClipboardProvider v-slot="{ copyToClipboard }">
        <span
          role="button"
          tabindex="0"
          data-testid="copy-to-clipboard"
          @click.stop="copyIdToClipboard(copyToClipboard)"
        >
          <KIcon
            class="uuid-icon"
            :title="t('iconTitle')"
            icon="copy"
            color="var(--black-45)"
            size="16"
          />
        </span>
      </KClipboardProvider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, PropType } from 'vue'
import { createI18n } from '@kong-ui/core'
import english from '../locales/en.json'
import { KClipboardProvider, KIcon } from '@kong/kongponents'
import { COPY_UUID_NOTIFY_KEY } from '../const'
import { CopyUuidNotifyParam } from '../types'

const { t } = createI18n('en-us', english)

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
  truncated: {
    type: Boolean,
    default: true,
  },
  useMono: {
    type: Boolean,
    default: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
  notify: {
    type: Function as PropType<(param: CopyUuidNotifyParam) => void>,
    default: undefined,
  },
})

const notifyTrimLength = 15
const notify = props.notify || inject(COPY_UUID_NOTIFY_KEY)

const copyIdToClipboard = (executeCopy: (prop: string) => boolean) => {
  if (!executeCopy(props.uuid)) {
    if (typeof notify === 'function') {
      notify({
        type: 'error',
        message: t('message.fail'),
      })
    }
    return
  }

  const isTruncated = props.uuid.length > notifyTrimLength
  const messagePrefix = props.isHidden
    ? t('message.success.prefix')
    : `"${props.uuid.substring(0, notifyTrimLength) + (isTruncated ? '...' : '')}"`
  if (typeof notify === 'function') {
    notify({
      type: 'success',
      message: `${messagePrefix}${t('message.success.content')}`,
    })
  }
}

</script>

<style lang="scss" scoped>
.kong-ui-copy-uuid {
  display: flex;

  .uuid-container {
    white-space: nowrap;
    margin-right: 0.75rem;
  }

  .truncated-uuid {
    max-width: 10ch;
    margin-right: 1ch;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .uuid-icon-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .uuid-icon {
    display: flex;
  }
}
</style>
