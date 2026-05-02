<template>
  <div>
    <TopNav status="404" />
    <main class="home-wrap">
      <section class="hero-card">
        <h1>Page Not Found</h1>
        <button class="predict-btn" @click="$router.push('/')">Go Home</button>
      </section>
    </main>
  </div>
</template>
<script>
import TopNav from '../components/TopNav.vue'
export default { components: { TopNav } }
</script>
