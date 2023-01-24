<template>
  <div class="mt-0" />
  <div>
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
            color="var(--grey-500)"
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
          <ExternalLink
            class="width-100"
            data-testid="docs-link"
            hide-icon
            :href="docsURL"
          >
            {{ t('navbar.help_menu.documentation_link') }}
          </ExternalLink>
        </KDropdownItem>
        <KDropdownItem>
          <ExternalLink
            class="width-100"
            data-testid="status-link"
            hide-icon
            :href="statusURL"
          >
            {{ t('navbar.help_menu.status_link') }}
          </ExternalLink>
        </KDropdownItem>
        <KDropdownItem>
          <ExternalLink
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
          </ExternalLink>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ExternalLink } from '@kong-ui-public/app-layout'
import { KonnectEnterpriseLogo as HelpKonnectEnterpriseLogo } from './icons'
import composables from '../composables'
import externalLinks from '../external-links'

const { i18n: { t } } = composables.useI18n()
const win = composables.useWindow()
const { getActiveGeo } = composables.useGeo()

const docsURL = externalLinks.konnectDocsURL
const statusURL = externalLinks.platformStatusURL
const supportURL = externalLinks.konnectSupportURL
const { session } = composables.useSession()

const orgId = computed((): string => session.value?.organization?.id || '')
const orgName = computed((): string => session.value?.organization?.name || '')

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
@import "../styles/variables";

.help-dropdown {
  margin-top: 4px;

  @media screen and (min-width: $viewport-md) {
    padding-right: 28px;
  }

  .k-button {
    box-shadow: none !important;
    position: relative;
    top: -3px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-weight: 400;
    &.help-dropdown-btn {
      padding-right: 0;
      padding-left: 0;
    }

    .kong-icon.kong-icon-help,
    .kong-icon.kong-icon-help > svg {
      width: 24px;
      height: 24px;
    }
  }
  li.k-dropdown-item {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
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
    font-weight: 500 !important;
    display: flex;
    span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  svg {
    margin-right: 0 !important;
  }
}

.help-dropdown-popover.k-popover.dropdown-popover {
  position: relative;
  top: -5px !important;
  margin-top: 0 ! important;
}
</style>
