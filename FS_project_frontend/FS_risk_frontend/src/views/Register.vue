<template>
  <div>
    <TopNav status="REGISTER" />
    <main class="form-page">
      <form class="auth-card" @submit.prevent="handleSubmit">
        <h1>Register Team</h1>
        <p class="muted">Create a Formula Student team account.</p>

        <label>Team Name</label>
        <input v-model.trim="team_name" type="text" />
        <div v-show="submitted && !team_name" class="error">Team name is required.</div>

        <label>Team Leader Name</label>
        <input v-model.trim="team_leader_name" type="text" />
        <div v-show="submitted && !team_leader_name" class="error">Team leader name is required.</div>

        <label>Car Type</label>
        <select v-model="car_type">
          <option value="EV">EV</option>
          <option value="MECH">MECH</option>
        </select>

        <label>Contact Email</label>
        <input v-model.trim="email" type="email" />
        <div v-show="submitted && !email" class="error">Email is required.</div>

        <label>Password</label>
        <input v-model="password" type="password" />
        <div v-show="submitted && !password" class="error">Password is required.</div>

        <div v-if="error" class="error main-error">{{ error }}</div>
        <div v-if="success" class="success">{{ success }}</div>

        <button class="predict-btn" type="submit">Register</button>
        <button class="secondary-btn" type="button" @click="$router.push('/login')">Already have an account?</button>
      </form>
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
      team_name: '',
      team_leader_name: '',
      car_type: 'EV',
      email: '',
      password: '',
      submitted: false,
      error: '',
      success: ''
    }
  },
  methods: {
    validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) },
    async handleSubmit() {
      this.submitted = true
      this.error = ''
      this.success = ''

      if (!this.team_name || !this.team_leader_name || !this.email || !this.password) return
      if (!this.validEmail(this.email)) {
        this.error = 'Email must be valid.'
        return
      }

      try {
        await API.post('/users', {
          team_name: this.team_name,
          team_leader_name: this.team_leader_name,
          car_type: this.car_type,
          email: this.email,
          password: this.password
        })
        this.success = 'Account created. Please login.'
        setTimeout(() => this.$router.push('/login'), 800)
      } catch (err) {
        this.error = err.response?.data?.detail || 'Registration failed.'
      }
    }
  }
}
</script>
