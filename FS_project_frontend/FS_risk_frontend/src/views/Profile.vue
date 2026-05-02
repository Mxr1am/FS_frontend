<template>
  <div>
    <TopNav status="PROFILE" />
    <main class="single-column">
      <section class="panel-card">
        <div class="section-title">Team Profile</div>
        <div class="profile-grid">
          <div><span>Team Name</span><strong>{{ team.team_name }}</strong></div>
          <div><span>Team Leader</span><strong>{{ team.team_leader_name }}</strong></div>
          <div><span>Car Type</span><strong>{{ team.car_type }}</strong></div>
          <div><span>Components</span><strong>{{ team.available_components.join(', ') }}</strong></div>
        </div>
        <p class="muted">
          This page displays profile data returned by GET /dashboard. Your uploaded backend does not currently expose a PATCH /profile endpoint, so editing is not enabled here.
        </p>
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
        car_type: '',
        available_components: []
      }
    }
  },
  async created() {
    const res = await API.get('/dashboard')
    this.team = res.data
  }
}
</script>
