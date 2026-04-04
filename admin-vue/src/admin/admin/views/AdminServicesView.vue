<template>
  <section class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold">Servicios</h2>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="openCreate">Nuevo servicio</button>
    </div>

    <div class="bg-white rounded-xl shadow p-4">
      <input v-model="search" placeholder="Buscar servicio..." class="w-full border rounded-lg px-3 py-2" />
    </div>

    <div class="bg-white rounded-xl shadow overflow-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-left">
          <tr>
            <th class="p-3">Nombre</th>
            <th class="p-3">Categoria</th>
            <th class="p-3">Precio</th>
            <th class="p-3">Tipo precio</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item._id" class="border-t">
            <td class="p-3">{{ item.name }}</td>
            <td class="p-3">{{ item.category || '-' }}</td>
            <td class="p-3">${{ Number(item.price || 0).toFixed(2) }}</td>
            <td class="p-3">{{ item.pricingType || 'fixed' }}</td>
            <td class="p-3 space-x-2">
              <button class="px-2 py-1 bg-slate-200 rounded" @click="openEdit(item)">Editar</button>
              <button class="px-2 py-1 bg-red-600 text-white rounded" @click="remove(item)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminModal v-model="showModal" :title="editingId ? 'Editar servicio' : 'Nuevo servicio'">
      <form class="grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="save">
        <input v-model="form.name" required placeholder="Nombre" class="border rounded px-3 py-2" />
        <select v-model="form.category" required class="border rounded px-3 py-2">
          <option value="">Categoria de servicio</option>
          <option v-for="option in categories" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <input v-model="form.icon" placeholder="Icono (ej: ⚡)" class="border rounded px-3 py-2" />
        <input v-model.number="form.price" type="number" step="0.01" placeholder="Precio" class="border rounded px-3 py-2" />
        <select v-model="form.pricingType" class="border rounded px-3 py-2">
          <option value="fixed">Fijo</option>
          <option value="variable">Variable</option>
          <option value="percentage">Porcentaje</option>
          <option value="free">Gratis</option>
        </select>

        <textarea v-model="form.description" rows="3" placeholder="Descripcion" class="border rounded px-3 py-2 md:col-span-2"></textarea>

        <div class="md:col-span-2 border rounded p-3 space-y-2">
          <input type="file" accept="image/*" @change="onImageFile" class="border rounded px-3 py-2 w-full" />
          <input v-model="imageUrlInput" type="url" placeholder="O URL de imagen" class="border rounded px-3 py-2 w-full" />
        </div>

        <label class="flex items-center gap-2 md:col-span-2">
          <input v-model="form.featured" type="checkbox" /> Destacado
        </label>

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

const categories = [
  { value: 'money-transfers', label: 'Transferencias de dinero' },
  { value: 'money-order', label: 'Money order' },
  { value: 'cell-phone-topups', label: 'Recargas celular' },
  { value: 'international-topups', label: 'Recargas internacionales' },
  { value: 'cell-phone-activations', label: 'Activaciones celulares' },
  { value: 'international-call-topups', label: 'Llamadas internacionales' },
  { value: 'domestic-topups', label: 'Recargas domesticas' },
  { value: 'gift-cards', label: 'Gift cards' },
  { value: 'utility-payments', label: 'Pagos servicios' },
  { value: 'rent-payments', label: 'Pagos renta' },
  { value: 'insurance-services', label: 'Seguros' },
  { value: 'iptv-television', label: 'IPTV television' },
  { value: 'advertising-services', label: 'Publicidad' },
  { value: 'social-media-management', label: 'Gestion redes sociales' }
]

const form = ref({
  name: '',
  category: '',
  icon: '⚡',
  price: 0,
  pricingType: 'fixed',
  description: '',
  featured: false
})

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return items.value
  return items.value.filter(item => {
    return [item.name, item.category, item.pricingType]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(term))
  })
})

async function loadAll() {
  try {
    const response = await api.services.list()
    items.value = response.data || []
  } catch (error) {
    toast.error(error.message || 'No se pudieron cargar los servicios')
  }
}

function openCreate() {
  editingId.value = ''
  imageFile.value = null
  imageUrlInput.value = ''
  form.value = {
    name: '',
    category: '',
    icon: '⚡',
    price: 0,
    pricingType: 'fixed',
    description: '',
    featured: false
  }
  showModal.value = true
}

function openEdit(item) {
  editingId.value = item._id
  imageFile.value = null
  imageUrlInput.value = item.image?.url || ''
  form.value = {
    name: item.name || '',
    category: item.category || '',
    icon: item.icon || '⚡',
    price: item.price || 0,
    pricingType: item.pricingType || 'fixed',
    description: item.description || '',
    featured: !!item.featured
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
      fd.append('entityType', 'general')
      const uploadRes = await api.upload.image(fd)
      finalImageUrl = uploadRes.data.url
    }

    const payload = {
      ...form.value,
      isActive: true,
      image: finalImageUrl ? { url: finalImageUrl, alt: form.value.name } : undefined
    }
    if (editingId.value) {
      await api.services.update(editingId.value, payload)
      toast.success('Servicio actualizado')
    } else {
      await api.services.create(payload)
      toast.success('Servicio creado')
    }

    showModal.value = false
    await loadAll()
  } catch (error) {
    toast.error(error.message || 'No se pudo guardar el servicio')
  }
}

async function remove(item) {
  if (!confirm(`Eliminar servicio ${item.name}?`)) return
  try {
    await api.services.remove(item._id)
    toast.success('Servicio eliminado')
    await loadAll()
  } catch (error) {
    toast.error(error.message || 'No se pudo eliminar el servicio')
  }
}

onMounted(loadAll)
</script>
