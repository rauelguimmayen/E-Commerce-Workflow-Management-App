<template>
  
  <div class="container min-vh-100 d-flex justify-content-center align-items-center">
    <div v-if="step === 'qr'" >
      <h3>Scan this QR code with your authenticator app</h3>
      <img :src="qrCodeUrl" alt="2FA QR Code" class="qr-image mx-auto" />
      <p class="manual-secret">Or enter this code manually: {{ manualSecret }}</p>
      <input
        v-model="confirmCode"
        placeholder="Enter 6-digit code"
        maxlength="6"
        @keyup.enter="confirmSetup"
      />
      <button @click="confirmSetup" :disabled="confirmCode.length !== 6">
        Confirm & Enable
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
    <div v-else-if="step === 'done'">
        <p>✅ 2FA is now enabled on your account.</p>
        <div v-if="backupCodes.length">
          <h4>Save these backup codes somewhere safe:</h4>
          <ul>
            <li v-for="code in backupCodes" :key="code">{{ code }}</li>
          </ul>
          <p class="warning">
            These codes won't be shown again. Store them somewhere safe before continuing.
          </p>
        </div>
        <button @click="finish">I've saved my codes — Done</button>
      </div>
  </div>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { useRouter } from 'vue-router'
const step = ref('qr')
const qrCodeUrl = ref('')
const manualSecret = ref('')
const confirmCode = ref('')
const backupCodes = ref([])
const error = ref('')
const router = useRouter()
onMounted(async () => {
  try {
    const { data } = await api.post('/2fa/init')
    qrCodeUrl.value = data.qrCodeUrl
    manualSecret.value = data.manualSecret
  } catch (e) {
    error.value = 'Failed to start 2FA setup. Please try again.'
  }
})

async function confirmSetup() {
  error.value = ''
  try {
    const { data } = await api.post('/2fa/confirm', { code: confirmCode.value })
    backupCodes.value = data.backupCodes || []
    step.value = 'done'
  } catch (e) {
    error.value = 'Invalid code. Please try again.'
  }
}

function finish() {
  router.push({ name: 'ProfilePage' })
}

</script>

<style scoped>
.container {
  width: 25%;
  min-width: 300px;
  padding: 8px;
  color: white;
  text-align: center;
}
.qr-image {
  display: block;
  width: 220px;
  height: 220px;
  margin: 16px 0;
  background: white;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
}
.manual-secret {
  font-family: monospace;
  font-size: 1rem;
  text-align: center;
  opacity: 0.7;
  word-break: break-all;
}
input {
  width: 100%;
  padding: 10px;
  margin: 12px 0;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: white;
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  text-align: center;
}
button {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
.error { color: #ff6b6b; margin-top: 8px; }
</style>