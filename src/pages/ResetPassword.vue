<script setup>
import { ref } from 'vue'
import { Notyf } from 'notyf'
import api from '../api.js'

const notyf = new Notyf()
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const passwordMatch = ref(true)

function checkMatch() {
  passwordMatch.value = !confirmPassword.value || newPassword.value === confirmPassword.value
}

async function handleReset() {
  if (newPassword.value !== confirmPassword.value) {
    notyf.error("Passwords don't match")
    return
  }
  if (newPassword.value.length < 6) {
    notyf.error("Password must be at least 6 characters")
    return
  }
  isLoading.value = true
  try {
    await api.patch('/users/update-password', { newPassword: newPassword.value })
    notyf.success('Password updated successfully!')
    newPassword.value = ''; confirmPassword.value = ''
  } catch (e) {
    notyf.error(e.response?.data?.message || 'Failed to update password')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="gs-reset-page">
    <div class="gs-reset-inner">
      <div class="gs-reset-card">
        <div class="gs-reset-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>
        <h1 class="gs-reset-title">Reset Password</h1>
        <p class="gs-reset-sub">Choose a strong new password for your account</p>

        <form @submit.prevent="handleReset" class="gs-reset-form">
          <div class="gs-field">
            <label class="gs-label">New Password</label>
            <div class="gs-input-wrap">
              <input
                :type="showNew ? 'text' : 'password'"
                class="gs-input"
                v-model="newPassword"
                placeholder="Enter new password"
              />
              <button type="button" class="gs-eye-btn" @click="showNew = !showNew">
                <svg v-if="!showNew" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <div class="gs-field">
            <label class="gs-label">Confirm Password</label>
            <div class="gs-input-wrap">
              <input
                :type="showConfirm ? 'text' : 'password'"
                class="gs-input"
                :class="{ 'gs-input-error': !passwordMatch }"
                v-model="confirmPassword"
                placeholder="Repeat new password"
                @input="checkMatch"
              />
              <button type="button" class="gs-eye-btn" @click="showConfirm = !showConfirm">
                <svg v-if="!showConfirm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <span class="gs-field-error" v-if="!passwordMatch">Passwords don't match</span>
          </div>

          <button type="submit" class="gs-reset-btn" :disabled="isLoading || !newPassword || !confirmPassword">
            <div v-if="isLoading" class="gs-spinner"></div>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {{ isLoading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-reset-page {
  min-height: 100vh; background: #08080f;
  display: flex; align-items: center; justify-content: center;
  padding: 80px 20px;
  font-family: 'DM Sans', sans-serif;
}
.gs-reset-inner { width: 100%; max-width: 420px; }
.gs-reset-card {
  background: #0f0f18;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px; padding: 44px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.4);
  animation: fadeUp 0.4s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.gs-reset-icon {
  width: 52px; height: 52px;
  background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2));
  border: 1px solid rgba(99,102,241,0.25);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  color: #818cf8; margin-bottom: 20px;
}
.gs-reset-title {
  font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800;
  color: #f0f0f5; margin: 0 0 6px; letter-spacing: -0.02em;
}
.gs-reset-sub { font-size: 0.86rem; color: rgba(255,255,255,0.35); margin: 0 0 28px; }

.gs-reset-form { display: flex; flex-direction: column; gap: 18px; }
.gs-field { display: flex; flex-direction: column; gap: 7px; }
.gs-label {
  font-family: 'Syne', sans-serif; font-size: 0.76rem; font-weight: 700;
  color: rgba(255,255,255,0.45); letter-spacing: 0.03em;
}

.gs-input-wrap { position: relative; }
.gs-input {
  width: 100%; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09); border-radius: 11px;
  padding: 12px 44px 12px 14px;
  color: #f0f0f5; font-size: 0.88rem; font-family: 'DM Sans', sans-serif;
  outline: none; transition: all 0.2s; box-sizing: border-box;
}
.gs-input:focus {
  border-color: rgba(99,102,241,0.45);
  background: rgba(99,102,241,0.04);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.gs-input::placeholder { color: rgba(255,255,255,0.18); }
.gs-input-error { border-color: rgba(239,68,68,0.4) !important; }

.gs-eye-btn {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: rgba(255,255,255,0.28);
  cursor: pointer; padding: 4px; transition: color 0.2s;
}
.gs-eye-btn:hover { color: rgba(255,255,255,0.6); }

.gs-field-error { font-size: 0.72rem; color: #f87171; }

.gs-reset-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 13px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; font-family: 'Syne', sans-serif;
  font-size: 0.9rem; font-weight: 700; cursor: pointer;
  transition: all 0.2s; box-shadow: 0 6px 20px rgba(99,102,241,0.3);
  margin-top: 6px;
}
.gs-reset-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.gs-reset-btn:disabled { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.2); box-shadow: none; cursor: not-allowed; transform: none; }

.gs-spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
