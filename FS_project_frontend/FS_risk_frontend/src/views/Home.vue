<template>
  <div>
    <TopNav status="API READY" />
    <main class="home-wrap">
      <section class="hero-card">
        <div class="logo-icon large">FS</div>
        <h1>Formula Student Risk Predictor</h1>
        <p>Select an option to continue. Teams must register or login before running component risk predictions.</p>
        <div class="home-actions">
          <button class="predict-btn" @click="$router.push('/login')">Login</button>
          <button class="secondary-btn" @click="$router.push('/register')">Register</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import TopNav from '../components/TopNav.vue'
export default { components: { TopNav } }
</script>
