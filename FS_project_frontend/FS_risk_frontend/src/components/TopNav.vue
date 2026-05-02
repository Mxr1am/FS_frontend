<template>
  <header>
    <div class="logo" @click="$router.push('/')">
      <div class="logo-icon">FS</div>
      <div>
        <div class="logo-text">RISK PREDICTOR</div>
        <div class="logo-sub">FORMULA STUDENT · COMPONENT HEALTH</div>
      </div>
    </div>
    <nav v-if="loggedIn">
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/history">History</router-link>
      <router-link to="/profile">Profile</router-link>
      <button class="link-btn" @click="logout">Logout</button>
    </nav>
    <div class="header-status"><div class="status-dot"></div><span>{{ status }}</span></div>
  </header>
</template>

<script>
import API from '../services/api'

export default {
  props: {
    status: { type: String, default: 'MODELS ACTIVE' }
  },
  computed: {
    loggedIn() {
      return !!localStorage.getItem('session_token')
    }
  },
  methods: {
    async logout() {
      try { await API.post('/logout') } catch (e) {}
      localStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
