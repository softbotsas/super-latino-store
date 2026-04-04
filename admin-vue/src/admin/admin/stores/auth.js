import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'

const TOKEN_KEY = 'adminToken'
const USER_KEY = 'adminUser'

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))

  function persistSession(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  }

  function clearSession() {
    token.value = ''
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async function login(email, password) {
    loading.value = true
    try {
      const response = await api.auth.login(email, password)
      persistSession(response.data.token, response.data.user)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  async function verify() {
    if (!token.value) return false
    try {
      const response = await api.auth.verify()
      user.value = response.data.user
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))
      return true
    } catch {
      clearSession()
      return false
    }
  }

  async function logout() {
    try {
      if (token.value) await api.auth.logout()
    } catch {
      // ignore
    } finally {
      clearSession()
    }
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    login,
    verify,
    logout,
    clearSession
  }
})
