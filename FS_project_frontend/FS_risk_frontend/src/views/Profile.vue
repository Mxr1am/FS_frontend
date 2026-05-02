<template>
  <div>
    <TopNav status="PROFILE" />
    <main class="single-column">
      <section class="panel-card">
        <h2 class="page-title">Team Profile</h2>
        <p class="muted">View and edit your team account details.</p>

        <div class="profile-grid">
          <div class="profile-row">
            <span>Team Name</span>
            <strong>{{ team.team_name || '—' }}</strong>
          </div>
          <div class="profile-row">
            <span>Team Leader</span>
            <strong>{{ team.team_leader_name || '—' }}</strong>
          </div>
          <div class="profile-row">
            <span>Email</span>
            <strong>{{ team.email || '—' }}</strong>
          </div>
          <div class="profile-row">
            <span>Car Type</span>
            <strong>{{ team.car_type || '—' }}</strong>
          </div>
          <div class="profile-row">
            <span>Components</span>
            <strong>{{ (team.available_components || []).join(', ') || '—' }}</strong>
          </div>
        </div>

        <div class="divider"></div>

        <h3 class="page-subtitle">Edit Profile</h3>
        <p class="muted" style="font-size: 0.85rem;">
          Only Team Leader Name and Email can be updated.
        </p>

        <form class="profile-form" @submit.prevent="updateProfile">
          <label>Team Leader Name</label>
          <input v-model.trim="form.team_leader_name" type="text" />

          <label>Email</label>
          <input v-model.trim="form.email" type="email" />

          <button class="primary-btn" type="submit" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>

          <div v-if="error" class="error main-error">{{ error }}</div>
          <div v-if="success" class="success">{{ success }}</div>
        </form>
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
    return {
      team: {
        team_name: '',
        team_leader_name: '',
        email: '',
        car_type: '',
        available_components: []
      },
      form: {
        team_leader_name: '',
        email: ''
      },
      saving: false,
      error: '',
      success: ''
    }
  },
  async created() {
    try {
      const res = await API.get('/dashboard')
      this.team = {
        team_name: res.data.team_name || '',
        team_leader_name: res.data.team_leader_name || '',
        // /dashboard does not currently return email; will populate after first PATCH
        email: res.data.email || '',
        car_type: res.data.car_type || '',
        available_components: res.data.available_components || []
      }
      this.form.team_leader_name = this.team.team_leader_name
      this.form.email = this.team.email
    } catch (err) {
      this.error = 'Could not load profile.'
    }
  },
  methods: {
    validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) },
    async updateProfile() {
      this.error = ''
      this.success = ''

      const payload = {}

      if (this.form.team_leader_name && this.form.team_leader_name !== this.team.team_leader_name) {
        payload.team_leader_name = this.form.team_leader_name
      }
      if (this.form.email && this.form.email !== this.team.email) {
        if (!this.validEmail(this.form.email)) {
          this.error = 'Please enter a valid email address.'
          return
        }
        payload.email = this.form.email
      }

      if (Object.keys(payload).length === 0) {
        this.error = 'No changes to save.'
        return
      }

      this.saving = true
      try {
        const res = await API.patch('/profile', payload)
        const updated = res.data.user || {}
        this.team.team_leader_name = updated.team_leader_name ?? this.team.team_leader_name
        this.team.email = updated.email ?? this.team.email
        this.form.team_leader_name = this.team.team_leader_name
        this.form.email = this.team.email
        if (updated.team_leader_name) {
          localStorage.setItem('team_leader_name', updated.team_leader_name)
        }
        this.success = res.data.message || 'Profile updated.'
      } catch (err) {
        this.error = err.response?.data?.detail || 'Update failed.'
      } finally {
        this.saving = false
      }
    }
  }
}
</script>