<template>
  <a
    v-if="href"
    class="external-link"
    :href="href"
    rel="noopener"
    target="_blank"
  >
    <slot />
    <KIcon
      height="12"
      icon="externalLink"
      view-box="0 0 12 12"
      width="12"
    />
  </a>
</template>

<script>
import isValidUrl from '../../utils/isValidUrl'
export default {
  name: 'ExternalLink',

  props: {
    href: {
      type: String,
      required: true,
      validator: function(value) {
        return isValidUrl(value) || value === ''
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.external-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  svg {
    margin-left: 8px;
    path {
      fill: currentColor;
      fill-opacity: .5;
    }
  }
  &:hover {
    svg > path {
      fill-opacity: 1;
    }
  }
}
</style>
