<template>
  <section class="space-y-6 max-w-2xl">
    <h2 class="text-2xl font-semibold">Configuracion</h2>

    <!-- Conexion API -->
    <div class="bg-white rounded-xl shadow p-6 space-y-4">
      <h3 class="font-semibold text-lg border-b pb-2">Conexion al backend</h3>

      <div>
        <label class="block text-sm font-medium mb-1">URL del API</label>
        <input v-model="apiUrl" type="url" class="w-full border rounded-lg px-3 py-2" placeholder="http://localhost:5000/api" />
        <p class="text-xs text-slate-500 mt-1">Cambia esto si el backend corre en otro servidor o puerto</p>
      </div>

      <div class="flex gap-2">
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="saveApiUrl">Guardar URL</button>
        <button class="px-4 py-2 bg-slate-200 rounded-lg" @click="testConnection">Probar conexion</button>
      </div>

      <div v-if="connectionStatus" class="text-sm font-medium" :class="connectionOk ? 'text-green-600' : 'text-red-600'">
        {{ connectionStatus }}
      </div>
    </div>

    <!-- Cuenta admin -->
    <div class="bg-white rounded-xl shadow p-6 space-y-4">
      <h3 class="font-semibold text-lg border-b pb-2">Cuenta actual</h3>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="text-slate-500">Usuario</div>
        <div class="font-medium">{{ user?.username || '-' }}</div>
        <div class="text-slate-500">Email</div>
        <div class="font-medium">{{ user?.email || '-' }}</div>
        <div class="text-slate-500">Rol</div>
        <div class="font-medium">{{ user?.role || '-' }}</div>
      </div>
    </div>

    <!-- Cambio de contrasena -->
    <div class="bg-white rounded-xl shadow p-6 space-y-4">
      <h3 class="font-semibold text-lg border-b pb-2">Cambiar contrasena</h3>
      <form class="space-y-3" @submit.prevent="changePassword">
        <input v-model="pwForm.current" type="password" required placeholder="Contrasena actual" class="w-full border rounded-lg px-3 py-2" />
        <input v-model="pwForm.next" type="password" required placeholder="Nueva contrasena (min. 8 caracteres)" minlength="8" class="w-full border rounded-lg px-3 py-2" />
        <input v-model="pwForm.confirm" type="password" required placeholder="Repetir nueva contrasena" class="w-full border rounded-lg px-3 py-2" />
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Cambiar contrasena</button>
      </form>
    </div>

    <!-- Base de datos -->
    <div class="bg-white rounded-xl shadow p-6 space-y-4">
      <h3 class="font-semibold text-lg border-b pb-2">Base de datos</h3>
      <p class="text-sm text-slate-600">Para poblar la base de datos con datos de prueba, ejecuta en la terminal del backend:</p>
      <pre class="bg-slate-900 text-green-400 rounded-lg p-3 text-sm overflow-x-auto">cd backend &amp;&amp; npm run seed</pre>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminAuthStore } from '../stores/auth'
import { api } from '../services/api'
import { useToast } from '../../composables/useToast'

const auth = useAdminAuthStore()
const toast = useToast()

const user = auth.user
const apiUrl = ref(localStorage.getItem('apiUrl') || import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
const connectionStatus = ref('')
const connectionOk = ref(false)

const pwForm = ref({ current: '', next: '', confirm: '' })

function saveApiUrl() {
  localStorage.setItem('apiUrl', apiUrl.value)
  toast.success('URL guardada. Recarga la pagina para aplicar.')
}

async function testConnection() {
  connectionStatus.value = 'Probando...'
  connectionOk.value = false
  try {
    const res = await fetch(`${apiUrl.value.replace(/\/$/, '')}/departments?limit=1`)
    if (res.ok) {
      connectionStatus.value = 'Conexion exitosa ✓'
      connectionOk.value = true
    } else {
      connectionStatus.value = `Error: HTTP ${res.status}`
    }
  } catch {
    connectionStatus.value = 'No se pudo conectar al servidor'
  }
}

async function changePassword() {
  if (pwForm.value.next !== pwForm.value.confirm) {
    toast.error('Las contrasenas no coinciden')
    return
  }
  try {
    await api.auth.changePassword(pwForm.value.current, pwForm.value.next)
    toast.success('Contrasena cambiada')
    pwForm.value = { current: '', next: '', confirm: '' }
  } catch (error) {
    toast.error(error.message || 'No se pudo cambiar la contrasena')
  }
}
</script>
