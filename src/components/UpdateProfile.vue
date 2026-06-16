<script setup>
import { ref } from 'vue'
import { Notyf } from 'notyf'
import api from '../api.js'

const notyf = new Notyf()
const firstName = ref('')
const lastName = ref('')
const mobileNo = ref('')
const isLoading = ref(false)

async function handleUpdate() {
  if (!firstName.value && !lastName.value && !mobileNo.value) {
    notyf.error('Please fill in at least one field to update')
    return
  }
  isLoading.value = true
  try {
    const payload = {}
    if (firstName.value) payload.firstName = firstName.value
    if (lastName.value) payload.lastName = lastName.value
    if (mobileNo.value) payload.mobileNo = mobileNo.value
    await api.put('/users/update-profile', payload)
    notyf.success('Profile updated successfully!')
    firstName.value = ''; lastName.value = ''; mobileNo.value = ''
  } catch (e) {
    notyf.error(e.response?.data?.message || 'Update failed')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="gs-update-form">
    <div class="gs-field">
      <label class="gs-label">First Name</label>
      <input type="text" class="gs-input" v-model="firstName" placeholder="New first name" />
    </div>
    <div class="gs-field">
      <label class="gs-label">Last Name</label>
      <input type="text" class="gs-input" v-model="lastName" placeholder="New last name" />
    </div>
    <div class="gs-field">
      <label class="gs-label">Mobile Number</label>
      <input type="tel" class="gs-input" v-model="mobileNo" placeholder="New mobile number" />
    </div>
    <button @click="handleUpdate" class="gs-update-btn" :disabled="isLoading">
      <div v-if="isLoading" class="gs-btn-spinner"></div>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      {{ isLoading ? 'Saving...' : 'Save Changes' }}
    </button>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.gs-update-form { display: flex; flex-direction: column; gap: 16px; font-family: 'DM Sans', sans-serif; }

.gs-field { display: flex; flex-direction: column; gap: 6px; }
.gs-label {
  font-family: 'Syne', sans-serif; font-size: 0.75rem; font-weight: 700;
  color: rgba(255,255,255,0.4); letter-spacing: 0.03em;
}
.gs-input {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
  border-radius: 10px; padding: 11px 13px;
  color: #f0f0f5; font-size: 0.87rem; font-family: 'DM Sans', sans-serif;
  outline: none; transition: all 0.2s; width: 100%; box-sizing: border-box;
}
.gs-input:focus {
  border-color: rgba(99,102,241,0.45);
  background: rgba(99,102,241,0.04);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.gs-input::placeholder { color: rgba(255,255,255,0.17); }

.gs-update-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px; border-radius: 11px; border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; font-family: 'Syne', sans-serif;
  font-size: 0.85rem; font-weight: 700; cursor: pointer;
  transition: all 0.2s; box-shadow: 0 6px 18px rgba(99,102,241,0.28);
  margin-top: 4px;
}
.gs-update-btn:hover:not(:disabled) { opacity: 0.9; }
.gs-update-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.gs-btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
