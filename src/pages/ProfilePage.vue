<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global.js';
import UpdateProfile from '../components/UpdateProfile.vue';
const { user } = useGlobalStore();
import api from '../api.js';
const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const mobileNum = ref('');

onBeforeMount(async () => {
  if (!user.email) {
    router.push({ path: '/' });
    return;
  }
  try {
    const response = await api.get('/users/details');
    firstName.value = response.data.firstName;
    lastName.value = response.data.lastName;
    email.value = response.data.email;
    mobileNum.value = response.data.mobileNo;
  } catch (error) {
    console.error('Failed to fetch user details:', error);
  }
});
</script>

<template>
  <div class="gs-profile-page">
    <div class="gs-profile-inner">

      <!-- Hero -->
      <div class="gs-profile-hero">
        <div class="gs-profile-avatar">
          {{ (user.firstName?.[0] || user.email?.[0] || '?').toUpperCase() }}
        </div>
        <div>
          <h1 class="gs-profile-name">{{ user.firstName }} {{ user.lastName }}</h1>
          <p class="gs-profile-email">{{ user.email }}</p>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="gs-profile-grid">
        <div class="gs-profile-card">
          <h2 class="gs-profile-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Account Information
          </h2>

          <div class="gs-info-rows">
            <div class="gs-info-row">
              <span class="gs-info-label">First Name</span>
              <span class="gs-info-value">{{ user.firstName || '—' }}</span>
            </div>
            <div class="gs-info-row">
              <span class="gs-info-label">Last Name</span>
              <span class="gs-info-value">{{ user.lastName || '—' }}</span>
            </div>
            <div class="gs-info-row">
              <span class="gs-info-label">Email Address</span>
              <span class="gs-info-value">{{ user.email || '—' }}</span>
            </div>
            <div class="gs-info-row">
              <span class="gs-info-label">Mobile Number</span>
              <span class="gs-info-value">{{ user.mobileNo || mobileNum || '—' }}</span>
            </div>
            <div class="gs-info-row" v-if="user.isAdmin">
              <span class="gs-info-label">Role</span>
              <span class="gs-info-badge-admin">Administrator</span>
            </div>
            <div class="gs-info-row" v-else>
              <span class="gs-info-label">Role</span>
              <span class="gs-info-badge-user">Customer</span>
            </div>

            <div class="security-section">
                  <h5>Security</h5>
                  <p v-if="!user?.twoFactorEnabled">
                    Two-factor authentication is currently <strong>disabled</strong>.
                  </p>
                  <p v-else>
                    Two-factor authentication is currently <strong>enabled</strong>.
                  </p>

                  <router-link
                    v-if="!user?.twoFactorEnabled"
                    :to="{ name: 'TwoFactorSetup' }"
                    class="btn-enable-2fa"
                  >
                    Enable Two-Factor Authentication
                  </router-link>
                </div>
          </div>
        </div>

        <div class="gs-profile-card">
          <h2 class="gs-profile-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Update Profile
          </h2>
          <UpdateProfile />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-profile-page {
  min-height: 100vh; background: #08080f;
  padding: 90px 0 60px;
  font-family: 'DM Sans', sans-serif; color: #f0f0f5;
}
.gs-profile-inner { max-width: 900px; margin: 0 auto; padding: 0 24px; }

/* Hero */
.gs-profile-hero {
  display: flex; align-items: center; gap: 22px;
  margin-bottom: 40px; padding: 28px;
  background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05));
  border: 1px solid rgba(99,102,241,0.15);
  border-radius: 20px;
}
.gs-profile-avatar {
  width: 72px; height: 72px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif; font-size: 1.8rem;
  font-weight: 800; color: white; flex-shrink: 0;
}
.gs-profile-name {
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem; font-weight: 800;
  color: #f0f0f5; margin: 0 0 4px; letter-spacing: -0.02em;
}
.gs-profile-email { font-size: 0.85rem; color: rgba(255,255,255,0.38); margin: 0; }

/* Grid */
.gs-profile-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.gs-profile-card {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px; padding: 28px;
}

.gs-profile-section-title {
  display: flex; align-items: center; gap: 9px;
  font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700;
  color: rgba(255,255,255,0.6); margin: 0 0 22px;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.gs-profile-section-title svg { color: #6366f1; }

.security-section {
  font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700;
  color: rgba(255,255,255,0.6); margin: 0 0 22px;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.security-section p {
  font-family: 'Syne', sans-serif; padding: 3px 10px; border-radius: 100px;
  font-size: 0.7rem;
  text-decoration: none;
}
/* Info Rows */
.gs-info-rows { display: flex; flex-direction: column; gap: 0; }
.gs-info-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.gs-info-row:last-child { border-bottom: none; }
.gs-info-label { font-size: 0.8rem; color: rgba(255,255,255,0.35); }
.gs-info-value { font-size: 0.88rem; font-weight: 600; color: #f0f0f5; }

.gs-info-badge-admin {
  background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
  color: #818cf8; font-size: 0.72rem; font-weight: 700;
  font-family: 'Syne', sans-serif; padding: 3px 10px; border-radius: 100px;
  letter-spacing: 0.04em;
}
.gs-info-badge-user {
  background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2);
  color: #34d399; font-size: 0.72rem; font-weight: 700;
  font-family: 'Syne', sans-serif; padding: 3px 10px; border-radius: 100px;
  letter-spacing: 0.04em;
}

@media (max-width: 640px) {
  .gs-profile-grid { grid-template-columns: 1fr; }
  .gs-profile-hero { flex-direction: column; text-align: center; }
}
</style>
