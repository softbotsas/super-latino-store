<template>
  <section class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold">Servicios</h2>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-slate-200 rounded-lg" @click="openCategoryCreate">Nueva categoría</button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="openCreate">Nuevo servicio</button>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6">
      <div class="space-y-4">
        <div class="bg-white rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input v-model="search" placeholder="Buscar servicio..." class="w-full border rounded-lg px-3 py-2" />
          <select v-model="categoryFilter" class="border rounded-lg px-3 py-2">
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category._id" :value="category.slug">
              {{ category.icon || '⚡' }} {{ category.name }}
            </option>
          </select>
        </div>

        <div class="bg-white rounded-xl shadow overflow-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-left">
              <tr>
                <th class="p-3">Imagen</th>
                <th class="p-3">Nombre</th>
                <th class="p-3">Categoría</th>
                <th class="p-3">Destacado</th>
                <th class="p-3">Acciones cliente</th>
                <th class="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredItems.length === 0" class="border-t">
                <td colspan="6" class="p-4 text-center text-slate-500">No se encontraron servicios</td>
              </tr>
              <tr v-for="item in filteredItems" :key="item._id" class="border-t">
                <td class="p-3">
                  <img v-if="item.image?.url" :src="resolveImageUrl(item.image.url)" :alt="item.name" class="w-12 h-12 rounded object-cover" />
                  <div v-else class="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-xl">{{ categoryIcon(item.category) }}</div>
                </td>
                <td class="p-3 font-medium">{{ item.name }}</td>
                <td class="p-3">{{ categoryName(item.category) }}</td>
                <td class="p-3">
                  <span :class="item.featured ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'" class="px-2 py-1 rounded-full text-xs font-semibold">
                    {{ item.featured ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td class="p-3">
                  <div class="flex flex-col text-xs text-slate-600">
                    <span>WhatsApp</span>
                    <span>Cómo llegar</span>
                  </div>
                </td>
                <td class="p-3 space-x-2">
                  <button class="px-2 py-1 bg-slate-200 rounded" @click="openEdit(item)">Editar</button>
                  <button class="px-2 py-1 bg-red-600 text-white rounded" @click="remove(item)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg">Categorías de servicios</h3>
          <span class="text-sm text-slate-500">{{ categories.length }} activas</span>
        </div>

        <div v-if="categories.length === 0" class="text-sm text-slate-500">No hay categorías creadas.</div>
        <div v-else class="space-y-3">
          <div v-for="category in categories" :key="category._id" class="border rounded-lg p-3 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="font-medium text-slate-800">{{ category.icon || '⚡' }} {{ category.name }}</p>
              <p class="text-xs text-slate-500">Slug: {{ category.slug }}</p>
            </div>
            <div class="flex gap-2">
              <button class="px-2 py-1 bg-slate-200 rounded text-sm" @click="openCategoryEdit(category)">Editar</button>
              <button class="px-2 py-1 bg-red-600 text-white rounded text-sm" @click="removeCategory(category)">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AdminModal v-model="showModal" :title="editingId ? 'Editar servicio' : 'Nuevo servicio'">
      <form class="grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="save">
        <input v-model="form.name" required placeholder="Nombre" class="border rounded px-3 py-2" />
        <select v-model="form.category" required class="border rounded px-3 py-2">
          <option value="">Categoría de servicio</option>
          <option v-for="category in categories" :key="category._id" :value="category.slug">{{ category.icon || '⚡' }} {{ category.name }}</option>
        </select>

        <div class="md:col-span-2 rounded-lg border bg-slate-50 p-3 text-sm text-slate-600">
          El cliente verá estas acciones en la tienda: <span class="font-semibold">Más información por WhatsApp</span> y <span class="font-semibold">Cómo llegar</span>.
        </div>

        <textarea v-model="form.description" rows="3" placeholder="Descripción" class="border rounded px-3 py-2 md:col-span-2"></textarea>

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

    <AdminModal v-model="showCategoryModal" :title="editingCategoryId ? 'Editar categoría de servicio' : 'Nueva categoría de servicio'">
      <form class="grid grid-cols-1 gap-3" @submit.prevent="saveCategory">
        <input v-model="categoryForm.name" required placeholder="Nombre de categoría" class="border rounded px-3 py-2" />
        <input v-model="categoryForm.slug" placeholder="Slug (opcional)" class="border rounded px-3 py-2" />
        <input v-model="categoryForm.icon" placeholder="Icono (ej: ⚡)" class="border rounded px-3 py-2" />

        <div class="flex justify-end gap-2 mt-2">
          <button type="button" class="px-4 py-2 bg-slate-200 rounded" @click="showCategoryModal = false">Cancelar</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Guardar categoría</button>
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
const categories = ref([])
const search = ref('')
const categoryFilter = ref('')
const showModal = ref(false)
const showCategoryModal = ref(false)
const editingId = ref('')
const editingCategoryId = ref('')
const imageFile = ref(null)
const imageUrlInput = ref('')
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')
const toast = useToast()

const form = ref({
  name: '',
  category: '',
  description: '',
  featured: false
})

const categoryForm = ref({
  name: '',
  slug: '',
  icon: '⚡'
})

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase()
  return items.value.filter((item) => {
    const matchesTerm = !term || [item.name, item.category, item.pricingType]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term))

    const matchesCategory = !categoryFilter.value || item.category === categoryFilter.value
    return matchesTerm && matchesCategory
  })
})

function makeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function categoryName(slug) {
  return categories.value.find((category) => category.slug === slug)?.name || slug || '-'
}

function categoryIcon(slug) {
  return categories.value.find((category) => category.slug === slug)?.icon || '⚡'
}

function resolveImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

async function loadAll() {
  try {
    const [servicesRes, categoriesRes] = await Promise.all([
      api.services.list(),
      api.serviceCategories.list('isActive=true')
    ])
    items.value = servicesRes.data || []
    categories.value = categoriesRes.data || []
  } catch (error) {
    toast.error(error.message || 'No se pudieron cargar los servicios')
  }
}

function resetServiceForm() {
  editingId.value = ''
  imageFile.value = null
  imageUrlInput.value = ''
  form.value = {
    name: '',
    category: '',
    description: '',
    featured: false
  }
}

function openCreate() {
  resetServiceForm()
  showModal.value = true
}

function openEdit(item) {
  editingId.value = item._id
  imageFile.value = null
  imageUrlInput.value = item.image?.url || ''
  form.value = {
    name: item.name || '',
    category: item.category || '',
    description: item.description || '',
    featured: !!item.featured
  }
  showModal.value = true
}

function openCategoryCreate() {
  editingCategoryId.value = ''
  categoryForm.value = { name: '', slug: '', icon: '⚡' }
  showCategoryModal.value = true
}

function openCategoryEdit(category) {
  editingCategoryId.value = category._id
  categoryForm.value = {
    name: category.name || '',
    slug: category.slug || '',
    icon: category.icon || '⚡'
  }
  showCategoryModal.value = true
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
      name: form.value.name,
      category: makeSlug(form.value.category),
      description: form.value.description,
      featured: !!form.value.featured,
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

async function saveCategory() {
  try {
    const payload = {
      ...categoryForm.value,
      slug: makeSlug(categoryForm.value.slug || categoryForm.value.name),
      isActive: true
    }

    if (editingCategoryId.value) {
      await api.serviceCategories.update(editingCategoryId.value, payload)
      toast.success('Categoría actualizada')
    } else {
      await api.serviceCategories.create(payload)
      toast.success('Categoría creada')
    }

    showCategoryModal.value = false
    await loadAll()
  } catch (error) {
    toast.error(error.message || 'No se pudo guardar la categoría')
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

async function removeCategory(category) {
  if (!confirm(`Eliminar categoría ${category.name}?`)) return
  try {
    await api.serviceCategories.remove(category._id)
    toast.success('Categoría eliminada')
    await loadAll()
  } catch (error) {
    toast.error(error.message || 'No se pudo eliminar la categoría')
  }
}

onMounted(loadAll)
</script>
