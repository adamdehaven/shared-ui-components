<template>
  <KDropdownMenu
    class="help-dropdown"
    data-testid="header-help-btn"
    :kpop-attributes="{
      placement: 'bottomEnd',
      popoverClasses: 'help-dropdown-popover'
    }"
    width="250"
  >
    <template #default>
      <KButton class="help-dropdown-btn">
        <KIcon
          color="var(--steel-300, #A3B6D9)"
          icon="help"
          size="24"
        />
      </KButton>
    </template>
    <template #items>
      <KDropdownItem>
        <div
          class="org-name width-100"
          data-testid="help-menu-org-name"
        >
          <span
            :title="orgName"
          >
            {{ orgName }}
          </span>
          <!-- TODO: fix to placement to bottomRight when KHCP-5756 is done -->
          <KTooltip
            class="margin-left-auto"
            :label="tooltipText"
            placement="bottom"
          >
            <KClipboardProvider v-slot="{ copyToClipboard }">
              <span @click.stop="onCopyOrgId(copyToClipboard)">
                <KIcon
                  class="copy-icon"
                  color="var(--black-45)"
                  data-testid="help-menu-copy-org-id"
                  hide-title
                  icon="copy"
                  size="16"
                />
              </span>
            </KClipboardProvider>
          </KTooltip>
        </div>
      </KDropdownItem>
      <KDropdownItem
        has-divider
      >
        <KExternalLink
          class="width-100"
          data-testid="docs-link"
          hide-icon
          :href="docsURL"
        >
          {{ t('navbar.help_menu.documentation_link') }}
        </KExternalLink>
      </KDropdownItem>
      <KDropdownItem>
        <KExternalLink
          class="width-100"
          data-testid="status-link"
          hide-icon
          :href="statusURL"
        >
          {{ t('navbar.help_menu.status_link') }}
        </KExternalLink>
      </KDropdownItem>
      <KDropdownItem>
        <KExternalLink
          class="width-100"
          data-testid="support-link"
          hide-icon
          :href="supportURL"
        >
          <div class="enterprize-logo width-100">
            {{ t('navbar.help_menu.support_link') }}
            <div class="margin-left-auto">
              <HelpKonnectEnterpriseLogo />
            </div>
          </div>
        </KExternalLink>
      </KDropdownItem>
      <!-- <AuthValidate
          v-slot="{ isAllowed }"
          :krn-args="{
            service: 'accounts',
            action: '#root',
            resourcePath: null
          }"
        > -->
      <KDropdownItem
        v-if="isQuickStartAllowed"
        data-testid="quick-start"
        has-divider
        @click="goToQuickStart"
      >
        {{ t('navbar.help_menu.goto_quick_start') }}
      </KDropdownItem>
      <!-- </AuthValidate> -->
    </template>
  </KDropdownMenu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { KonnectEnterpriseLogo as HelpKonnectEnterpriseLogo } from '../icons'
import composables from '../../composables'
import externalLinks from '../../external-links'

const { i18n: { t } } = composables.useI18n()
const win = composables.useWindow()
const { getActiveGeo } = composables.useGeo()

const docsURL = externalLinks.konnectDocsURL
const statusURL = externalLinks.platformStatusURL
const supportURL = externalLinks.konnectSupportURL
const { session } = composables.useSession()

const orgId = computed((): string => session.data?.organization?.id || '')
const orgName = computed((): string => session.data?.organization?.name || '')

// TODO: based this decision based on KRN or use future IsAuthorized component
const isQuickStartAllowed = computed((): boolean => true)

// TODO what do we do with segment analytics
// const { eventStrings, track } = composables.useSegmentAnalytics()

const goToQuickStart = () => {
  // track(eventStrings.QS_QUICK_START_MENU_STARTED)
  win.setLocationAssign(`/${(getActiveGeo({ allowOverride: true })?.code)}/quick-start`)
}

const tooltipText = ref(t('navbar.help_menu.copy_orgid_tooltip'))
const onCopyOrgId = async (copyToClipboard: (str: string) => Promise<boolean>): Promise<void> => {
  if (await copyToClipboard(orgId.value)) {
    tooltipText.value = t('navbar.help_menu.copy_orgid_success')
    setTimeout(() => {
      tooltipText.value = t('navbar.help_menu.copy_orgid_tooltip')
    }, 1500)
  }
}
</script>

<style lang="scss">
// scoped is not working for this icon
.help-dropdown {
  .kong-icon-copy {
    cursor: pointer;

    > svg {
      margin-right: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "../../styles/variables";

.help-dropdown {
  .k-button {
    background-color: transparent !important;
    border: none;
    box-shadow: none !important;
    cursor: pointer;
    font-weight: 400;
    position: relative;
    top: -3px;

    &.help-dropdown-btn {
      padding: 0;

      &:focus-visible {
        outline: 1px solid var(--steel-300, #A3B6D9) !important;
      }
    }

    .kong-icon.kong-icon-help,
    .kong-icon.kong-icon-help > svg {
      height: 24px;
      width: 24px;
    }
  }

  li.k-dropdown-item {
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }

  .width-100 {
    width: 100%;
  }

  .enterprize-logo {
    display: flex
  }

  .margin-left-auto {
    margin-left: auto;
  }

  .org-name {
    display: flex;
    font-weight: 500 !important;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  svg {
    margin-right: 0 !important;
  }

  :deep(.help-dropdown-popover.k-popover.k-dropdown-popover) {
    margin-top: 0 !important;
    position: relative;
    top: 17px !important;
  }
}
</style>
