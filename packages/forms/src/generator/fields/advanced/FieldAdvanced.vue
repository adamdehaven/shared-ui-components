<template>
  <div
    class="advanced-field-dropdown-wrapper"
    data-testid="advanced-field-dropdown-wrapper"
  >
    <div
      class="advanced-field-title"
      @click="handleOpen"
    >
      <i class="material-icons">{{ isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_right' }}</i>
      <span>{{ titleText }}</span>
    </div>
    <div
      :class="openClass"
      class="advanced-field-dropdown"
    >
      <vue-form-generator
        :schema="schema"
        :model="model"
        :options="{ helpAsHtml: true }"
        @model-updated="updateModel"
      />
    </div>
  </div>
</template>

<script>
import abstractField from '../abstractField'

export default {
  mixins: [abstractField],

  emits: ['model-updated'],

  data() {
    return {
      isOpen: false,
    }
  },

  computed: {
    openClass() {
      return this.isOpen ? 'open' : 'closed'
    },
    fieldCount() {
      return this.schema.fields.length
    },
    titleText() {
      return `${this.isOpen ? 'Hide' : 'View'} ${this.fieldCount} Advanced Fields`
    },
  },

  methods: {
    handleOpen() {
      this.isOpen = !this.isOpen
    },
    updateModel(model, schema) {
      this.$emit('model-updated', model, schema)
    },
  },
}
</script>

<style lang="scss" scoped>
.field-advanced {
  margin-top: -1rem;
  margin-bottom: 2rem !important;
}
.advanced-field-dropdown-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  .advanced-field-title {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    color: #0077cc;
    cursor: pointer;
    order: 2;
    i {
      font-size: 1rem;
    }
    &:hover span {
      text-decoration: underline;
    }
  }
  .advanced-field-dropdown {
    position: relative;
    display: block;
    width: 100%;
    max-height: 100%;
    height: auto;
    /* transition: max-height 300ms cubic-bezier(.785, .135, .15, .86); */
    &.closed {
      overflow: hidden;
      max-height: 0;
    }
  }
}
</style>
