<!-- TwoFactorVerify.vue -->
<template>
  <div class="verify-2fa">
    <h3>Enter your authentication code</h3>
    <input
      v-model="code"
      maxlength="6"
      placeholder="000000"
      @keyup.enter="verify"
      autofocus
    />
    <button @click="verify" :disabled="loading">Verify</button>
    <p v-if="error" class="error">{{ error }}</p>
    <a href="#" @click="useBackupCode = true" v-if="!useBackupCode">
      Use a backup code instead
    </a>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const code = ref('')
const error = ref('')
const loading = ref(false)
const useBackupCode = ref(false)

async function verify() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.post('/2fa/verify', { code: code.value })
    localStorage.setItem('token', data.token) // or use a proper auth store
    router.push({ name: 'ProfilePage' })
  } catch (e) {
    error.value = 'Invalid or expired code.'
  } finally {
    loading.value = false
  }
}
</script>