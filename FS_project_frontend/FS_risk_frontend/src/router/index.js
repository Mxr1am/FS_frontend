import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import History from '../views/History.vue'
import Profile from '../views/Profile.vue'
import NotFound from '../views/NotFound.vue'

function requireAuth(to, from, next) {
  const token = localStorage.getItem('session_token')
  if (!token) next('/login')
  else next()
}

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, beforeEnter: requireAuth },
  { path: '/history', component: History, beforeEnter: requireAuth },
  { path: '/profile', component: Profile, beforeEnter: requireAuth },
  { path: '/:pathMatch(.*)*', component: NotFound }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
