<template>
  <section class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold">Departamentos</h2>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="openCreate">Nuevo departamento</button>
    </div>

    <div class="bg-white rounded-xl shadow p-4">
      <input v-model="search" placeholder="Buscar departamento..." class="w-full border rounded-lg px-3 py-2" />
    </div>

    <div class="bg-white rounded-xl shadow overflow-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-left">
          <tr>
            <th class="p-3">Emoji</th>
            <th class="p-3">Nombre</th>
            <th class="p-3">Color</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item._id" class="border-t">
            <td class="p-3 text-2xl">{{ item.icon || '🏬' }}</td>
            <td class="p-3">{{ item.name }}</td>
            <td class="p-3">
              <div class="w-10 h-6 rounded border" :style="{ backgroundColor: item.color || '#3B82F6' }"></div>
            </td>
            <td class="p-3 space-x-2">
              <button class="px-2 py-1 bg-slate-200 rounded" @click="openEdit(item)">Editar</button>
              <button class="px-2 py-1 bg-red-600 text-white rounded" @click="remove(item)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminModal v-model="showModal" :title="editingId ? 'Editar departamento' : 'Nuevo departamento'">
      <form class="grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="save">
        <input v-model="form.name" required placeholder="Nombre" class="border rounded px-3 py-2" />
        <input v-model="form.icon" maxlength="4" placeholder="Emoji (ej: 🏬)" class="border rounded px-3 py-2" />
        <input v-model="form.color" type="color" class="border rounded px-3 py-2 h-10" />
        <textarea v-model="form.description" rows="3" placeholder="Descripcion" class="border rounded px-3 py-2 md:col-span-2"></textarea>

        <div class="md:col-span-2 border rounded p-3 space-y-2">
          <input type="file" accept="image/*" @change="onImageFile" class="border rounded px-3 py-2 w-full" />
          <input v-model="imageUrlInput" type="url" placeholder="O URL de imagen" class="border rounded px-3 py-2 w-full" />
        </div>

        <div class="md:col-span-2 flex justify-end gap-2 mt-2">
          <button type="button" class="px-4 py-2 bg-slate-200 rounded" @click="showModal = false">Cancelar</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </form>
    </AdminModal>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '../services/api'
import AdminModal from '../components/AdminModal.vue'
import { useToast } from '../../composables/useToast'

const items = ref([])
const search = ref('')
const showModal = ref(false)
const editingId = ref('')
const imageFile = ref(null)
const imageUrlInput = ref('')
const toast = useToast()

const form = ref({ name: '', icon: '🏬', color: '#3B82F6', description: '' })

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return items.value
  return items.value.filter(item => item.name?.toLowerCase().includes(term))
})

async function loadAll() {
  try {
    const response = await api.departments.list('isActive=true')
    items.value = response.data || []
  } catch (error) {
    toast.error(error.message || 'No se pudieron cargar los departamentos')
  }
}

function openCreate() {
  editingId.value = ''
  imageFile.value = null
  imageUrlInput.value = ''
  form.value = { name: '', icon: '🏬', color: '#3B82F6', description: '' }
  showModal.value = true
}

function openEdit(item) {
  editingId.value = item._id
  imageFile.value = null
  imageUrlInput.value = item.image?.url || ''
  form.value = {
    name: item.name || '',
    icon: item.icon || '🏬',
    color: item.color || '#3B82F6',
    description: item.description || ''
  }
  showModal.value = true
}

function onImageFile(event) {
  imageFile.value = event.target.files?.[0] || null
}

async function save() {
  try {
    let finalImageUrl = imageUrlInput.value || ''

    if (imageFile.value) {
      const fd = new FormData()
      fd.append('image', imageFile.value)
      fd.append('entityType', 'departments')
      const uploadRes = await api.upload.image(fd)
      finalImageUrl = uploadRes.data.url
    }

    const payload = {
      ...form.value,
      isActive: true,
      image: finalImageUrl ? { url: finalImageUrl, alt: form.value.name } : undefined
    }

    if (editingId.value) {
      await api.departments.update(editingId.value, payload)
      toast.success('Departamento actualizado')
    } else {
      await api.departments.create(payload)
      toast.success('Departamento creado')
    }

    showModal.value = false
    await loadAll()
  } catch (error) {
    toast.error(error.message || 'No se pudo guardar el departamento')
  }
}

async function remove(item) {
  if (!confirm(`Eliminar departamento ${item.name}?`)) return
  try {
    await api.departments.remove(item._id)
    toast.success('Departamento eliminado')
    await loadAll()
  } catch (error) {
    toast.error(error.message || 'No se pudo eliminar el departamento')
  }
}

onMounted(loadAll)
</script>
