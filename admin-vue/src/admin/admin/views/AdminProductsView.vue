<template>
  <section class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold">Productos</h2>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="openCreate">Nuevo producto</button>
    </div>

    <div class="bg-white rounded-xl shadow p-4">
      <input v-model="search" placeholder="Buscar por nombre, SKU o canal..." class="w-full border rounded-lg px-3 py-2" />
    </div>

    <div class="bg-white rounded-xl shadow overflow-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-left">
          <tr>
            <th class="p-3">Nombre</th>
            <th class="p-3">SKU</th>
            <th class="p-3">Precio</th>
            <th class="p-3">Canal</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item._id" class="border-t">
            <td class="p-3">{{ item.name }}</td>
            <td class="p-3">{{ item.sku }}</td>
            <td class="p-3">${{ Number(item.price).toFixed(2) }}</td>
            <td class="p-3">{{ item.salesChannel || 'store' }}</td>
            <td class="p-3 space-x-2">
              <button class="px-2 py-1 bg-slate-200 rounded" @click="openEdit(item)">Editar</button>
              <button class="px-2 py-1 bg-red-600 text-white rounded" @click="remove(item)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminModal v-model="showModal" :title="editingId ? 'Editar producto' : 'Nuevo producto'">
      <form class="grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="save">
        <input v-model="form.name" required placeholder="Nombre" class="border rounded px-3 py-2" />
        <input v-model="form.sku" required placeholder="SKU" class="border rounded px-3 py-2" />
        <input v-model.number="form.price" required type="number" step="0.01" placeholder="Precio" class="border rounded px-3 py-2" />
        <input v-model.number="form.stock" required type="number" min="0" placeholder="Stock" class="border rounded px-3 py-2" />

        <select v-model="form.department" required class="border rounded px-3 py-2">
          <option value="">Departamento</option>
          <option v-for="d in departments" :key="d._id" :value="d._id">{{ d.name }}</option>
        </select>

        <select v-model="form.category" required class="border rounded px-3 py-2">
          <option value="">Categoria</option>
          <option v-for="c in categoriesForDepartment" :key="c._id" :value="c._id">{{ c.name }}</option>
        </select>

        <select v-model="form.productType" class="border rounded px-3 py-2">
          <option value="general">General</option>
          <option value="alimentos">Alimentos</option>
          <option value="golosinas">Golosinas</option>
          <option value="ropa">Ropa</option>
          <option value="zapatos">Zapatos</option>
        </select>

        <select v-model="form.salesChannel" class="border rounded px-3 py-2">
          <option value="store">Solo tienda fisica</option>
          <option value="virtual">Solo tienda virtual</option>
          <option value="both">Tienda fisica + virtual</option>
        </select>

        <input v-model.number="form.discount" type="number" min="0" max="100" placeholder="Descuento %" class="border rounded px-3 py-2" />
        <input v-model.number="form.originalPrice" type="number" step="0.01" placeholder="Precio original" class="border rounded px-3 py-2" />

        <label class="flex items-center gap-2 md:col-span-2">
          <input v-model="form.featured" type="checkbox" /> Destacado
        </label>

        <textarea v-model="form.description" required rows="3" placeholder="Descripcion" class="border rounded px-3 py-2 md:col-span-2"></textarea>

        <div v-if="showSizes" class="md:col-span-2 border rounded p-3 space-y-2">
          <div class="flex justify-between items-center">
            <p class="font-medium">Tallas y cantidades</p>
            <button type="button" class="px-2 py-1 bg-slate-200 rounded" @click="addSizeRow">+ Talla</button>
          </div>
          <div v-for="(size, i) in form.availableSizes" :key="i" class="grid grid-cols-[1fr_110px_auto] gap-2">
            <input v-model="size.label" placeholder="Talla (ej: 40ft, M, 20)" class="border rounded px-3 py-2" />
            <input v-model.number="size.quantity" type="number" min="0" placeholder="Cantidad" class="border rounded px-3 py-2" />
            <button type="button" class="px-3 py-2 bg-red-100 text-red-700 rounded" @click="form.availableSizes.splice(i, 1)">x</button>
          </div>
        </div>

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
import { computed, onMounted, ref, watch } from 'vue'
import { api } from '../services/api'
import AdminModal from '../components/AdminModal.vue'
import { useToast } from '../../composables/useToast'

const items = ref([])
const departments = ref([])
const categories = ref([])
const search = ref('')
const showModal = ref(false)
const editingId = ref('')
const imageFile = ref(null)
const imageUrlInput = ref('')
const toast = useToast()

const form = ref({
  name: '', sku: '', price: 0, stock: 0,
  department: '', category: '', description: '', discount: 0,
  featured: false, salesChannel: 'store', productType: 'general',
  originalPrice: null,
  availableSizes: []
})

const showSizes = computed(() => form.value.productType === 'ropa' || form.value.productType === 'zapatos')
const categoriesForDepartment = computed(() => categories.value.filter(c => {
  const deptId = typeof c.department === 'string' ? c.department : c.department?._id
  return !form.value.department || deptId === form.value.department
}))

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return items.value
  return items.value.filter(item => {
    return [item.name, item.sku, item.salesChannel, item.productType]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(term))
  })
})

watch(() => form.value.productType, (type) => {
  if (!(type === 'ropa' || type === 'zapatos')) form.value.availableSizes = []
})

watch(() => form.value.department, () => {
  form.value.category = ''
})

function addSizeRow() {
  form.value.availableSizes.push({ label: '', quantity: 0 })
}

async function loadAll() {
  try {
    const [productsRes, departmentsRes, categoriesRes] = await Promise.all([
      api.products.list('limit=100'),
      api.departments.list('isActive=true'),
      api.categories.list('isActive=true')
    ])
    items.value = productsRes.data || []
    departments.value = departmentsRes.data || []
    categories.value = categoriesRes.data || []
  } catch (error) {
    toast.error(error.message || 'No se pudo cargar productos')
  }
}

function resetForm() {
  editingId.value = ''
  imageFile.value = null
  imageUrlInput.value = ''
  form.value = {
    name: '', sku: '', price: 0, stock: 0,
    department: '', category: '', description: '', discount: 0,
    featured: false, salesChannel: 'store', productType: 'general',
    originalPrice: null,
    availableSizes: []
  }
}

function openCreate() {
  resetForm()
  showModal.value = true
}

function openEdit(item) {
  editingId.value = item._id
  imageFile.value = null
  imageUrlInput.value = item.images?.[0]?.url || ''
  form.value = {
    name: item.name || '',
    sku: item.sku || '',
    price: item.price || 0,
    stock: item.stock || 0,
    department: item.department?._id || item.department || '',
    category: item.category?._id || item.category || '',
    description: item.description || '',
    discount: item.discount || 0,
    featured: !!item.featured,
    salesChannel: item.salesChannel || 'store',
    productType: item.productType || 'general',
    originalPrice: item.originalPrice || null,
    availableSizes: Array.isArray(item.availableSizes)
      ? item.availableSizes.map(s => (typeof s === 'string' ? { label: s, quantity: 0 } : { label: s.label || '', quantity: Number(s.quantity || 0) }))
      : []
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
      fd.append('entityType', 'products')
      const uploadRes = await api.upload.image(fd)
      finalImageUrl = uploadRes.data.url
    }

    if (!finalImageUrl) {
      toast.warning('Debes subir una imagen o indicar URL')
      return
    }

    const payload = {
      ...form.value,
      availableSizes: showSizes.value
        ? form.value.availableSizes.filter(s => s.label).map(s => ({ label: s.label, quantity: Number(s.quantity || 0) }))
        : [],
      stock: showSizes.value
        ? form.value.availableSizes.reduce((sum, s) => sum + Number(s.quantity || 0), 0)
        : Number(form.value.stock || 0),
      images: [{ url: finalImageUrl, alt: form.value.name, isPrimary: true }],
      isActive: true
    }

    if (editingId.value) {
      await api.products.update(editingId.value, payload)
      toast.success('Producto actualizado')
    } else {
      await api.products.create(payload)
      toast.success('Producto creado')
    }

    showModal.value = false
    await loadAll()
  } catch (error) {
    toast.error(error.message || 'No se pudo guardar el producto')
  }
}

async function remove(item) {
  if (!confirm(`Eliminar producto ${item.name}?`)) return
  try {
    await api.products.remove(item._id)
    toast.success('Producto eliminado')
    await loadAll()
  } catch (error) {
    toast.error(error.message || 'No se pudo eliminar el producto')
  }
}

onMounted(loadAll)
</script>
