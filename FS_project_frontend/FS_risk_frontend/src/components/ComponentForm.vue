<template>
  <section class="component-section" :class="`comp-${component}`">
    <div class="comp-header">
      <div class="comp-dot"></div>
      <span class="comp-label">{{ title }}</span>
    </div>

    <div class="fields-grid">
      <div class="field-item" v-for="field in fields" :key="field.key" :class="fieldClass(field)">
        <div class="field-label">{{ field.label }}</div>
        <input
          class="field-input"
          type="number"
          :step="field.step || 1"
          :min="field.min"
          :max="field.max"
          v-model.number="localValues[field.key]"
          @input="emitChange"
        />
        <div class="field-unit">{{ field.unit }} · allowed: {{ field.min }}–{{ field.max }}</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    component: { type: String, required: true },
    title: { type: String, required: true },
    fields: { type: Array, required: true },
    modelValue: { type: Object, required: true }
  },
  emits: ['update:modelValue'],
  data() {
    return { localValues: { ...this.modelValue } }
  },
  watch: {
    modelValue: {
      deep: true,
      handler(value) { this.localValues = { ...value } }
    }
  },
  methods: {
    emitChange() {
      this.$emit('update:modelValue', { ...this.localValues })
    },
    fieldClass(field) {
      const value = Number(this.localValues[field.key])
      if (Number.isNaN(value)) return 'danger'
      if (value < field.min || value > field.max) return 'danger'
      if (field.safeLow !== undefined && field.safeHigh !== undefined) {
        if (value < field.safeLow || value > field.safeHigh) return 'warn'
      }
      return ''
    }
  }
}
</script>
