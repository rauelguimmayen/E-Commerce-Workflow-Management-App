// stores/auth.js
import { defineStore } from 'pinia'
import api from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    status: 'logged-out', // 'logged-out' | 'pending-2fa' | 'authenticated'
    tempToken: null,      // short-lived token issued after password check
    token: null,          // full session token
    user: null,
  }),

  actions: {
    async login(email, password) {
      const { data } = await api.post('/users/login', { email, password })
      if (data.requires2FA) {
        this.status = 'pending-2fa'
        this.tempToken = data.tempToken
      } else {
        this.status = 'authenticated'
        this.token = data.token
        this.user = data.user
        localStorage.setItem('token', data.token)
      }
    },

    async verify2FA(code) {
      const { data } = await api.post('/2fa/verify', {
        code,
        tempToken: this.tempToken,
      })
      this.status = 'authenticated'
      this.token = data.token
      this.user = data.user
      this.tempToken = null
      localStorage.setItem('token', data.token)
    },

    logout() {
      this.status = 'logged-out'
      this.token = null
      this.tempToken = null
      this.user = null
      localStorage.removeItem('token')
    },
  },
})