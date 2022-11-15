<template>
  <div class="selection-group w-100 mb-2">
    <div
      v-for="(option, i) in schema.values"
      :key="i"
      class="option-group"
    >
      <div class="form-group mb-0">
        <label
          :class="option.name"
          class="k-input-label"
        >
          <input
            :id="schema.name+'-'+i"
            :value="option.value"
            :name="schema.name"
            :checked="checkOption(option)"
            type="radio"
            class="k-input"
            @change="onChange"
          >
          {{ option.name }}
        </label>
      </div>
    </div>
  </div>
</template>
<script>
import abstractField from '../abstractField'

export default {
  mixins: [abstractField],

  emits: ['model-updated'],

  methods: {
    updateModel(options) {
      // Emit value of field to EntityForm
      this.$emit('model-updated', options, this.schema.model)
    },

    checkOption(option) {
      if (this.model[this.schema.model]) {
        return option.value.toString() === this.model[this.schema.model].toString()
      }

      return option.checked
    },

    onChange(e) {
      let updatedValue = e.target.value.split(',')
      if (!this.schema.array) {
        updatedValue = updatedValue.toString()
      }

      this.updateModel(updatedValue)
    },
  },
}
</script>
