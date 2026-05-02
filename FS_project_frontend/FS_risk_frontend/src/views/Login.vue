<template>
  <div>
    <TopNav status="LOGIN" />
    <main class="form-page">
      <form class="auth-card" @submit.prevent="handleSubmit">
        <h1>Login</h1>
        <p class="muted">Login with team name and password.</p>

        <label>Team Name</label>
        <input v-model.trim="team_name" type="text" />
        <div v-show="submitted && !team_name" class="error">Team name is required.</div>

        <label>Password</label>
        <input v-model="password" type="password" />
        <div v-show="submitted && !password" class="error">Password is required.</div>

        <div v-if="error" class="error main-error">{{ error }}</div>

        <button class="predict-btn" type="submit">Login</button>
        <button class="secondary-btn" type="button" @click="$router.push('/register')">Create new account</button>
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
    return { team_name: '', password: '', submitted: false, error: '' }
  },
  methods: {
    async handleSubmit() {
      this.submitted = true
      this.error = ''
      if (!this.team_name || !this.password) return

      try {
        const login = await API.post('/login', {
          team_name: this.team_name,
          password: this.password
        })
        localStorage.setItem('session_token', login.data.session_token)
        localStorage.setItem('user_id', login.data.user_id)

        const dash = await API.get('/dashboard')
        localStorage.setItem('team_name', dash.data.team_name)
        localStorage.setItem('team_leader_name', dash.data.team_leader_name)
        localStorage.setItem('car_type', dash.data.car_type)
        localStorage.setItem('available_components', JSON.stringify(dash.data.available_components))

        this.$router.push('/dashboard')
      } catch (err) {
        this.error = err.response?.data?.detail || 'Login failed.'
      }
    }
  }
}
</script>
