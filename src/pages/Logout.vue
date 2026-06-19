<!-- ===== Logout.vue ===== -->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/global.js'

const router = useRouter()
const store = useGlobalStore()

onMounted(() => {
  localStorage.removeItem('token')
  store.getUserDetails(null)  // ← reuses the existing clear logic in your store
  router.push({ name: 'Home' })
})
</script>

<template>
  <div class="gs-logout-page">
    <div class="gs-logout-card">
      <div class="gs-logout-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </div>
      <h2 class="gs-logout-title">Signing out...</h2>
      <p class="gs-logout-sub">You've been logged out. Redirecting to home.</p>
      <div class="gs-logout-bar">
        <div class="gs-logout-progress"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-logout-page {
  min-height: 100vh; background: #08080f;
  display: flex; align-items: center; justify-content: center;
  font-family: 'DM Sans', sans-serif;
}
.gs-logout-card {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; padding: 48px;
  text-align: center; max-width: 360px; width: 90%;
  box-shadow: 0 40px 80px rgba(0,0,0,0.4);
  animation: fadeUp 0.4s ease;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

.gs-logout-icon {
  width: 64px; height: 64px; margin: 0 auto 20px;
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center; color: #f87171;
}
.gs-logout-title {
  font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800;
  color: #f0f0f5; margin: 0 0 8px;
}
.gs-logout-sub { font-size: 0.85rem; color: rgba(255,255,255,0.35); margin: 0 0 28px; }

.gs-logout-bar {
  width: 100%; height: 3px; background: rgba(255,255,255,0.06);
  border-radius: 3px; overflow: hidden;
}
.gs-logout-progress {
  height: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 3px;
  animation: progress 1.5s ease forwards;
}
@keyframes progress { from { width: 0; } to { width: 100%; } }
</style>