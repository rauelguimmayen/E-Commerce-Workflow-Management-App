<script setup>
import { watch, ref, onBeforeMount } from 'vue';
import { Notyf } from 'notyf';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global';
import api from '../api.js';

const notyf = new Notyf();
const router = useRouter();
const { getUserDetails, user } = useGlobalStore();

const email = ref("");
const password = ref("");
const isEnabled = ref(false);
const showPassword = ref(false);

watch([email, password], (currentValue) => {
  isEnabled.value = currentValue.every(input => input !== "");
});

async function handleSubmit() {
  try {
    let res = await api.post('/users/login', {
      email: email.value,
      password: password.value
    });
    if (res.data.access) {
      notyf.success("Welcome back!");
      localStorage.setItem("token", res.data.access);
      getUserDetails(res.data.access);
      email.value = "";
      password.value = "";
      router.push({ path: '/' });
    }
  } catch (e) {
    if (e.response?.status === 401) {
      notyf.error(e.response.data.message);
    } else {
      console.error(e);
      notyf.error("Login failed. Please try again.");
    }
  }
}

onBeforeMount(() => {
  if (user.token) router.push({ path: '/' });
});
</script>

<template>
  <div class="gs-auth-wrap">
    <div class="gs-auth-bg">
      <div class="gs-auth-orb-1"></div>
      <div class="gs-auth-orb-2"></div>
      <div class="gs-auth-grid"></div>
    </div>

    <div class="gs-auth-card">
      <!-- Logo -->
      <div class="gs-auth-logo">
        <div class="gs-auth-logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <span class="gs-auth-logo-text">Global<span>Shop</span></span>
      </div>

      <h1 class="gs-auth-title">Welcome back</h1>
      <p class="gs-auth-subtitle">Sign in to continue to your account</p>

      <form @submit.prevent="handleSubmit" class="gs-auth-form">
        <div class="gs-field">
          <label class="gs-label">Email Address</label>
          <div class="gs-input-wrap">
            <svg class="gs-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input
              id="userEmail"
              type="email"
              class="gs-input"
              placeholder="you@example.com"
              v-model="email"
            />
          </div>
        </div>

        <div class="gs-field">
          <label class="gs-label">Password</label>
          <div class="gs-input-wrap">
            <svg class="gs-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              class="gs-input"
              placeholder="Your password"
              v-model="password"
            />
            <button type="button" class="gs-input-toggle" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>

        <button
          id="loginBtn"
          type="submit"
          class="gs-submit-btn"
          :class="{ disabled: !isEnabled }"
          :disabled="!isEnabled"
        >
          <span v-if="isEnabled">Sign In</span>
          <span v-else>Enter email & password to continue</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </form>

      <p class="gs-auth-footer">
        Don't have an account?
        <router-link to="/register" class="gs-auth-link">Create one →</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-auth-wrap {
  min-height: 100vh;
  background: #08080f;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 40px;
  position: relative;
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
}

/* Background */
.gs-auth-bg { position: absolute; inset: 0; z-index: 0; }
.gs-auth-orb-1 {
  position: absolute;
  width: 600px; height: 600px;
  background: radial-gradient(circle, #6366f1, transparent 70%);
  top: -200px; left: -200px;
  opacity: 0.1;
  filter: blur(80px);
  border-radius: 50%;
}
.gs-auth-orb-2 {
  position: absolute;
  width: 400px; height: 400px;
  background: radial-gradient(circle, #8b5cf6, transparent 70%);
  bottom: -100px; right: -100px;
  opacity: 0.1;
  filter: blur(80px);
  border-radius: 50%;
}
.gs-auth-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* Card */
.gs-auth-card {
  position: relative;
  z-index: 1;
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 48px 44px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
  animation: fadeUp 0.5s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Logo */
.gs-auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}
.gs-auth-logo-icon {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  color: white;
}
.gs-auth-logo-text {
  font-family: 'Syne', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #f0f0f5;
}
.gs-auth-logo-text span { color: #818cf8; }

.gs-auth-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: #f0f0f5;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}
.gs-auth-subtitle {
  font-size: 0.88rem;
  color: rgba(255,255,255,0.38);
  margin: 0 0 32px;
}

/* Form */
.gs-auth-form { display: flex; flex-direction: column; gap: 20px; }

.gs-field { display: flex; flex-direction: column; gap: 7px; }

.gs-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  font-family: 'Syne', sans-serif;
  letter-spacing: 0.02em;
}

.gs-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.gs-input-icon {
  position: absolute;
  left: 14px;
  color: rgba(255,255,255,0.25);
  pointer-events: none;
}
.gs-input {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  padding: 13px 14px 13px 42px;
  color: #f0f0f5;
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
  outline: none;
}
.gs-input:focus {
  border-color: rgba(99,102,241,0.5);
  background: rgba(99,102,241,0.05);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
}
.gs-input::placeholder { color: rgba(255,255,255,0.2); }

.gs-input-toggle {
  position: absolute;
  right: 13px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}
.gs-input-toggle:hover { color: rgba(255,255,255,0.6); }

/* Submit */
.gs-submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  margin-top: 8px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-family: 'Syne', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 8px 24px rgba(99,102,241,0.3);
  letter-spacing: 0.01em;
}
.gs-submit-btn:hover:not(.disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 32px rgba(99,102,241,0.4);
}
.gs-submit-btn.disabled {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.2);
  box-shadow: none;
  cursor: not-allowed;
}

/* Footer */
.gs-auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.3);
}
.gs-auth-link {
  color: #818cf8;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}
.gs-auth-link:hover { color: #a5b4fc; }
</style>
