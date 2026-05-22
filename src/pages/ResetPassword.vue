	<template>
	  <!-- Modal -->
	  <div v-if="show" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
	    <div class="modal-dialog">
	      <div class="modal-content">
	        <div class="modal-header">
	          <h5 class="modal-title">Reset Password</h5>
	          <button class="btn-close" @click="closeModal"></button>
	        </div>
	        <div class="modal-body">
	          <div class="mb-3">
	            <label class="form-label">Old Password</label>
	            <input v-model="oldPassword" type="password" class="form-control" />
	          </div>
	          <div class="mb-3">
	            <label class="form-label">New Password</label>
	            <input v-model="newPassword" type="password" class="form-control" />
	          </div>
	          <div class="mb-3">
	            <label class="form-label">Confirm Password</label>
	            <input v-model="confirmPassword" type="password" class="form-control" />
	          </div>
	        </div>
	        <div class="modal-footer">
	          <button class="btn btn-secondary" @click="closeModal">Cancel</button>
	          <button class="btn btn-primary" @click="saveEdit">Save Changes</button>
	        </div>
	      </div>
	    </div>
	  </div>
	</template>
	<script setup>
	import { ref } from 'vue'
	import { Notyf } from 'notyf'
	import api from '../api.js'

	const props = defineProps({ show: Boolean })
	const emit = defineEmits(['close'])

	const notyf = new Notyf()
	const oldPassword = ref('')
	const newPassword = ref('')
	const confirmPassword = ref('')

	function closeModal() {
	  oldPassword.value = ''
	  newPassword.value = ''
	  confirmPassword.value = ''
	  emit('close')
	}

	async function saveEdit() {
	  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
	    notyf.error('Please fill in all fields')
	    return
	  }
	  if (newPassword.value !== confirmPassword.value) {
	    notyf.error('New passwords do not match')
	    return
	  }
	  if (newPassword.value.length < 8) {
	    notyf.error('Password must be at least 8 characters')
	    return
	  }
	  try {
	    await api.patch('/users/update-password', {
	      oldPassword: oldPassword.value,
	      newPassword: newPassword.value
	    })
	    notyf.success('Password updated successfully')
	    closeModal()
	  } catch (error) {
	    notyf.error(error.response?.data?.message ?? 'Failed to update password')
	  }
	}
	</script>
