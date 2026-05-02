<template>
  <div class="risk-card" :class="`${component}-card`">
    <div class="risk-card-header">
      <div>
        <div class="risk-name">{{ label }}</div>
    
      </div>
      <div class="risk-badge" :class="`badge-${result.risk_level}`">
        {{ result.risk_level }}
      </div>
    </div>

    <div class="gauge-container">
      
      <div>
        <div class="gauge-number" :style="{ color: riskColor }">
          {{ result.risk_score }}%
        </div>
        <div class="gauge-label">FAILURE RISK</div>
      </div>
    </div>

    <div class="risk-bar-track">
      <div class="risk-bar-fill" :style="{ width: result.risk_score + '%', background: riskColor }"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    component: { type: String, required: true },
    result: { type: Object, required: true }
  },
  computed: {
    label() {
      if (this.component === 'engine') return 'ENGINE'
      if (this.component === 'brake') return 'BRAKES'
      return 'BATTERY'
    },
    riskColor() {
      const pct = Number(this.result.risk_score)
      if (pct >= 75) return 'var(--red)'
      if (pct >= 50) return 'var(--orange)'
      if (pct >= 25) return 'var(--yellow)'
      return 'var(--green)'
    },
    gaugeStyle() {
      return {
        background: `conic-gradient(${this.riskColor} ${this.result.risk_score}%, var(--border) 0)`
      }
    }
  }
}
</script>
