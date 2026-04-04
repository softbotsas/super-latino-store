<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <form class="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4" @submit.prevent="submit">
      <h1 class="text-2xl font-bold text-slate-900">Admin Login</h1>
      <p class="text-sm text-slate-600">Acceso al panel administrativo</p>

      <div>
        <label class="block text-sm mb-1">Email</label>
        <input v-model="email" type="email" required class="w-full border rounded-lg px-3 py-2" />
      </div>

      <div>
        <label class="block text-sm mb-1">Contrasena</label>
        <input v-model="password" type="password" required class="w-full border rounded-lg px-3 py-2" />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <button :disabled="auth.loading" class="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
        {{ auth.loading ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAdminAuthStore()

const email = ref('admin@superlatino.com')
const password = ref('admin123')
const error = ref('')

async function submit() {
  error.value = ''
  const result = await auth.login(email.value, password.value)
  if (!result.success) {
    error.value = result.message || 'No se pudo iniciar sesion'
    return
  }
  router.push('/admin/dashboard')
}
</script>
