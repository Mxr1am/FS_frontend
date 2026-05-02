<template>
  <div>
    <TopNav :status="`${carType || 'TEAM'} DASHBOARD`" />

    <main>
      <div class="input-panel">
        <div>
          <div class="section-title">Telemetry Input</div>
          <p class="muted">
            {{ teamName }} · {{ carType }} team · Available components: {{ availableComponents.join(', ') }}
          </p>
          <div class="presets-bar">
            <button class="preset-btn" @click="loadPreset('normal')">◎ Normal</button>
            <button class="preset-btn" v-if="showEngine" @click="loadPreset('engineStress')">🔥 Engine Stress</button>
            <button class="preset-btn" @click="loadPreset('brakeStress')">⚠ Brake Stress</button>
            <button class="preset-btn" v-if="showBattery" @click="loadPreset('batteryStress')">⚡ Battery Stress</button>
            <button class="preset-btn" @click="loadPreset('multi')">💀 Multi Stress</button>
          </div>
        </div>

        <ComponentForm
          v-if="showEngine"
          component="engine"
          title="Engine"
          :fields="engineFields"
          v-model="engine"
        />

        <ComponentForm
          v-if="showBrake"
          component="brake"
          title="Brake System"
          :fields="brakeFields"
          v-model="brake"
        />

        <ComponentForm
          v-if="showBattery"
          component="battery"
          title="Battery / Electrical"
          :fields="batteryFields"
          v-model="battery"
        />

        <label class="save-toggle">
          <input type="checkbox" v-model="save_result" /> Save this test to history
        </label>

        <button class="predict-btn" @click="predict" :disabled="loading">
          {{ loading ? '⏳ ANALYSING...' : '▶ RUN PREDICTION' }}
        </button>

        <div v-if="error" class="error main-error">{{ error }}</div>
      </div>

      <div class="results-panel">
        <div class="section-title">Risk Assessment</div>
        <div v-if="!results.length" class="idle-state">
          <div class="idle-icon">⬡</div>
          Enter telemetry values and click<br />RUN PREDICTION
        </div>
        <RiskCard
          v-for="result in results"
          :key="result.component"
          :component="result.component"
          :result="result"
        />
      </div>
    </main>
  </div>
</template>

<script>
import API from '../services/api'
import TopNav from '../components/TopNav.vue'
import ComponentForm from '../components/ComponentForm.vue'
import RiskCard from '../components/RiskCard.vue'

const ENGINE_DEFAULT = { engine_temp_c: 90, oil_pressure_psi: 50, engine_rpm: 7000, vibration_g: 1.2, coolant_temp_c: 82 }
const BRAKE_DEFAULT = { brake_temp_c: 180, brake_pad_wear_mm: 1.5, brake_fluid_psi: 1000, brake_fade_idx: 0.15 }
const BATTERY_DEFAULT = { battery_voltage_v: 12.8, battery_temp_c: 28, battery_current_a: 20, battery_health_pct: 90 }

export default {
  components: { TopNav, ComponentForm, RiskCard },
  data() {
    return {
      teamName: localStorage.getItem('team_name') || '',
      carType: localStorage.getItem('car_type') || '',
      availableComponents: JSON.parse(localStorage.getItem('available_components') || '[]'),
      engine: { ...ENGINE_DEFAULT },
      brake: { ...BRAKE_DEFAULT },
      battery: { ...BATTERY_DEFAULT },
      save_result: true,
      results: [],
      loading: false,
      error: '',
      engineFields: [
        { key: 'engine_temp_c', label: 'Engine Temp', unit: '°C', min: 40, max: 150, safeLow: 50, safeHigh: 115 },
        { key: 'oil_pressure_psi', label: 'Oil Pressure', unit: 'psi', min: 8, max: 80, safeLow: 25, safeHigh: 75 },
        { key: 'engine_rpm', label: 'Engine RPM', unit: 'RPM', min: 800, max: 14500, safeLow: 1000, safeHigh: 12500 },
        { key: 'vibration_g', label: 'Vibration', unit: 'g', min: 0.1, max: 6.5, safeLow: 0.1, safeHigh: 4, step: 0.1 },
        { key: 'coolant_temp_c', label: 'Coolant Temp', unit: '°C', min: 35, max: 125, safeLow: 35, safeHigh: 105 }
      ],
      brakeFields: [
        { key: 'brake_temp_c', label: 'Brake Temp', unit: '°C', min: 15, max: 560, safeLow: 15, safeHigh: 400 },
        { key: 'brake_pad_wear_mm', label: 'Pad Wear', unit: 'mm worn', min: 0, max: 8, safeLow: 0, safeHigh: 6, step: 0.1 },
        { key: 'brake_fluid_psi', label: 'Fluid Pressure', unit: 'psi', min: 400, max: 1400, safeLow: 700, safeHigh: 1400 },
        { key: 'brake_fade_idx', label: 'Fade Index', unit: '0–1', min: 0, max: 1, safeLow: 0, safeHigh: 0.5, step: 0.01 }
      ],
      batteryFields: [
        { key: 'battery_voltage_v', label: 'Voltage', unit: 'V', min: 9, max: 15.5, safeLow: 11.5, safeHigh: 15, step: 0.1 },
        { key: 'battery_temp_c', label: 'Battery Temp', unit: '°C', min: 5, max: 75, safeLow: 5, safeHigh: 50 },
        { key: 'battery_current_a', label: 'Current Draw', unit: 'A', min: 0, max: 90, safeLow: 0, safeHigh: 65 },
        { key: 'battery_health_pct', label: 'Battery Health', unit: '%', min: 25, max: 100, safeLow: 55, safeHigh: 100 }
      ]
    }
  },
  computed: {
    showEngine() { return this.availableComponents.includes('engine') },
    showBrake() { return this.availableComponents.includes('brake') },
    showBattery() { return this.availableComponents.includes('battery') }
  },
  async created() {
    await this.refreshDashboard()
  },
  methods: {
    async refreshDashboard() {
      try {
        const res = await API.get('/dashboard')
        this.teamName = res.data.team_name
        this.carType = res.data.car_type
        this.availableComponents = res.data.available_components
        localStorage.setItem('team_name', res.data.team_name)
        localStorage.setItem('team_leader_name', res.data.team_leader_name)
        localStorage.setItem('car_type', res.data.car_type)
        localStorage.setItem('available_components', JSON.stringify(res.data.available_components))
      } catch (err) {
        this.error = 'Could not load dashboard. Please login again.'
      }
    },
    loadPreset(name) {
      this.engine = { ...ENGINE_DEFAULT }
      this.brake = { ...BRAKE_DEFAULT }
      this.battery = { ...BATTERY_DEFAULT }

      if (name === 'engineStress') this.engine = { engine_temp_c: 145, oil_pressure_psi: 10, engine_rpm: 14000, vibration_g: 6, coolant_temp_c: 120 }
      if (name === 'brakeStress') this.brake = { brake_temp_c: 430, brake_pad_wear_mm: 6, brake_fluid_psi: 650, brake_fade_idx: 0.75 }
      if (name === 'batteryStress') this.battery = { battery_voltage_v: 10.8, battery_temp_c: 55, battery_current_a: 70, battery_health_pct: 45 }
      if (name === 'multi') {
        this.engine = { engine_temp_c: 145, oil_pressure_psi: 10, engine_rpm: 14000, vibration_g: 6, coolant_temp_c: 120 }
        this.brake = { brake_temp_c: 520, brake_pad_wear_mm: 7.5, brake_fluid_psi: 450, brake_fade_idx: 0.95 }
        this.battery = { battery_voltage_v: 9.5, battery_temp_c: 70, battery_current_a: 85, battery_health_pct: 30 }
      }
    },
    async predict() {
      this.loading = true
      this.error = ''
      this.results = []

      const payload = { save_result: this.save_result }
      if (this.showEngine) payload.engine = this.engine
      if (this.showBrake) payload.brake = this.brake
      if (this.showBattery) payload.battery = this.battery

      try {
        const res = await API.post('/predict', payload)
        this.results = res.data.results
      } catch (err) {
        this.error = err.response?.data?.detail || 'Prediction failed.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
