<template>
  <div>
    <TopNav status="HISTORY" />
    <main class="single-column">
      <section class="panel-card">
        <div class="section-title">Saved Test History</div>
        <button class="secondary-btn" @click="loadHistory">Refresh</button>
        <div v-if="error" class="error main-error">{{ error }}</div>
        <div v-if="!history.length" class="idle-state">No saved tests yet.</div>
        <div v-for="item in history" :key="item.test_id" class="history-item">
          <div>
            <strong>{{ item.component.toUpperCase() }}</strong>
            <div class="muted">{{ formatDate(item.created_at) }}</div>
            <pre>{{ item.input_data }}</pre>
          </div>
          <div class="history-risk" :class="`text-${item.risk_level}`">
            {{ item.risk_score }}%<br />{{ item.risk_level }}
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import API from '../services/api'
import TopNav from '../components/TopNav.vue'

export default {
  components: { TopNav },
  data() {
    return { history: [], error: '' }
  },
  created() { this.loadHistory() },
  methods: {
    async loadHistory() {
      this.error = ''
      try {
        const res = await API.get('/history')
        this.history = res.data.history
      } catch (err) {
        this.error = err.response?.data?.detail || 'Could not load history.'
      }
    },
    formatDate(ms) {
      return new Date(ms).toLocaleString()
    }
  }
}
</script>
