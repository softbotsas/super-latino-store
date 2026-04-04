<template>
  <section class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold">Categorias</h2>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="openCreate">Nueva categoria</button>
    </div>

    <div class="bg-white rounded-xl shadow p-4">
      <input v-model="search" placeholder="Buscar categoria..." class="w-full border rounded-lg px-3 py-2" />
    </div>

    <div class="bg-white rounded-xl shadow overflow-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-left">
          <tr>
            <th class="p-3">Nombre</th>
            <th class="p-3">Departamento</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item._id" class="border-t">
            <td class="p-3">{{ item.name }}</td>
            <td class="p-3">{{ item.department?.name || '-' }}</td>
            <td class="p-3 space-x-2">
              <button class="px-2 py-1 bg-slate-200 rounded" @click="openEdit(item)">Editar</button>
              <button class="px-2 py-1 bg-red-600 text-white rounded" @click="remove(item)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminModal v-model="showModal" :title="editingId ? 'Editar categoria' : 'Nueva categoria'">
      <form class="grid grid-cols-1 gap-3" @submit.prevent="save">
        <input v-model="form.name" required placeholder="Nombre" class="border rounded px-3 py-2" />
        <select v-model="form.department" required class="border rounded px-3 py-2">
          <option value="">Departamento</option>
          <option v-for="d in departments" :key="d._id" :value="d._id">{{ d.icon || '🏬' }} {{ d.name }}</option>
        </select>
        <textarea v-model="form.description" rows="3" placeholder="Descripcion" class="border rounded px-3 py-2"></textarea>

        <div class="border rounded p-3 space-y-2">
          <input type="file" accept="image/*" @change="onImageFile" class="border rounded px-3 py-2 w-full" />
          <input v-model="imageUrlInput" type="url" placeholder="O URL de imagen" class="border rounded px-3 py-2 w-full" />
        </div>

        <div class="flex justify-end gap-2 mt-2">
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
const departments = ref([])
const search = ref('')
const showModal = ref(false)
const editingId = ref('')
const imageFile = ref(null)
const imageUrlInput = ref('')
const form = ref({ name: '', department: '', description: '' })
const toast = useToast()

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return items.value
  return items.value.filter(item => {
    return item.name?.toLowerCase().includes(term) || item.department?.name?.toLowerCase().includes(term)
  })
})

async function loadAll() {
  try {
    const [categoriesRes, departmentsRes] = await Promise.all([
      api.categories.list('isActive=true'),
      api.departments.list('isActive=true')
    ])
    items.value = categoriesRes.data || []
    departments.value = departmentsRes.data || []
  } catch (error) {
    toast.error(error.message || 'No se pudieron cargar las categorias')
  }
}

function openCreate() {
  editingId.value = ''
  imageFile.value = null
  imageUrlInput.value = ''
  form.value = { name: '', department: '', description: '' }
  showModal.value = true
}

function openEdit(item) {
  editingId.value = item._id
  imageFile.value = null
  imageUrlInput.value = item.image?.url || ''
  form.value = {
    name: item.name || '',
    department: item.department?._id || item.department || '',
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
      fd.append('entityType', 'categories')
      const uploadRes = await api.upload.image(fd)
      finalImageUrl = uploadRes.data.url
    }

    const payload = {
      ...form.value,
      isActive: true,
      image: finalImageUrl ? { url: finalImageUrl, alt: form.value.name } : undefined
    }
    if (editingId.value) {
      await api.categories.update(editingId.value, payload)
      toast.success('Categoria actualizada')
    } else {
      await api.categories.create(payload)
      toast.success('Categoria creada')
    }

    showModal.value = false
    await loadAll()
  } catch (error) {
    toast.error(error.message || 'No se pudo guardar la categoria')
  }
}

async function remove(item) {
  if (!confirm(`Eliminar categoria ${item.name}?`)) return
  try {
    await api.categories.remove(item._id)
    toast.success('Categoria eliminada')
    await loadAll()
  } catch (error) {
    toast.error(error.message || 'No se pudo eliminar la categoria')
  }
}

onMounted(loadAll)
</script>
