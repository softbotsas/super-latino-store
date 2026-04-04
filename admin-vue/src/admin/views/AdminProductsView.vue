<template>
  <section class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold">Productos</h2>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="openCreate">Nuevo producto</button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <input v-model="filters.search" placeholder="Buscar nombre o SKU..." class="border rounded-lg px-3 py-2" @input="onFilterChange" />
      <select v-model="filters.department" class="border rounded-lg px-3 py-2" @change="onDeptFilterChange">
        <option value="">Todos los departamentos</option>
        <option v-for="d in departments" :key="d._id" :value="d._id">{{ d.name }}</option>
      </select>
      <select v-model="filters.category" class="border rounded-lg px-3 py-2" @change="onFilterChange">
        <option value="">Todas las categorias</option>
        <option v-for="c in filteredCategoriesForFilter" :key="c._id" :value="c._id">{{ c.name }}</option>
      </select>
      <select v-model="filters.stock" class="border rounded-lg px-3 py-2" @change="onFilterChange">
        <option value="">Cualquier stock</option>
        <option value="low">Stock bajo (&lt;10)</option>
        <option value="out">Sin stock</option>
      </select>
    </div>

    <div class="bg-white rounded-xl shadow overflow-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-left">
          <tr>
            <th class="p-3">Imagen</th>
            <th class="p-3">Nombre</th>
            <th class="p-3">SKU</th>
            <th class="p-3">Precio</th>
            <th class="p-3">Stock</th>
            <th class="p-3">Estado</th>
            <th class="p-3">Canal</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="border-t">
            <td colspan="8" class="p-4 text-center text-slate-500">Cargando...</td>
          </tr>
          <tr v-else-if="items.length === 0" class="border-t">
            <td colspan="8" class="p-4 text-center text-slate-500">No se encontraron productos</td>
          </tr>
          <tr v-for="item in items" v-else :key="item._id" class="border-t hover:bg-slate-50">
            <td class="p-3">
              <img v-if="item.images?.[0]?.url" :src="resolveImageUrl(item.images[0].url)" :alt="item.name" class="w-12 h-12 object-cover rounded" />
              <div v-else class="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-xl">📦</div>
            </td>
            <td class="p-3 font-medium">{{ item.name }}</td>
            <td class="p-3 text-slate-500">{{ item.sku }}</td>
            <td class="p-3">
              <div class="flex flex-col">
                <span class="font-semibold text-slate-900">${{ Number(item.price).toFixed(2) }}</span>
                <span v-if="item.originalPrice && item.originalPrice > item.price" class="text-xs text-slate-400 line-through">
                  ${{ Number(item.originalPrice).toFixed(2) }}
                </span>
                <span v-if="item.discount > 0" class="text-xs font-semibold text-green-700">-{{ item.discount }}%</span>
              </div>
            </td>
            <td class="p-3">{{ item.stock }}</td>
            <td class="p-3">
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'">{{ item.isActive ? 'Activo' : 'Inactivo' }}</span>
            </td>
            <td class="p-3">{{ item.salesChannel || 'store' }}</td>
            <td class="p-3 space-x-2">
              <button class="px-2 py-1 bg-slate-200 rounded" @click="openEdit(item)">Editar</button>
              <button class="px-2 py-1 bg-red-600 text-white rounded" @click="remove(item)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginacion -->
    <div v-if="pagination.pages > 1" class="flex justify-center gap-1">
      <button class="px-3 py-1 rounded border" :disabled="pagination.page === 1" @click="goToPage(pagination.page - 1)">← Anterior</button>
      <button
        v-for="p in paginationPages"
        :key="p"
        class="px-3 py-1 rounded border"
        :class="p === pagination.page ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-slate-100'"
        @click="goToPage(p)"
      >{{ p }}</button>
      <button class="px-3 py-1 rounded border" :disabled="pagination.page === pagination.pages" @click="goToPage(pagination.page + 1)">Siguiente →</button>
    </div>

    <AdminModal v-model="showModal" :title="editingId ? 'Editar producto' : 'Nuevo producto'">
      <form class="grid grid-cols-1 md:grid-cols-2 gap-3" @submit.prevent="save">
        <input v-model="form.name" required placeholder="Nombre" class="border rounded px-3 py-2" />
        <input v-model="form.sku" required placeholder="SKU" class="border rounded px-3 py-2" />
        <label class="space-y-1">
          <span class="text-sm font-medium text-slate-700">Stock disponible</span>
          <input v-model.number="form.stock" required type="number" min="0" placeholder="Ej: 25" class="border rounded px-3 py-2 w-full" />
        </label>

        <div class="md:col-span-2 border rounded-xl p-4 bg-slate-50 space-y-4">
          <div>
            <p class="font-semibold text-slate-900">Precios y descuento</p>
            <p class="text-sm text-slate-500">Define el precio regular y el precio final de venta. El porcentaje se calcula automaticamente.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label class="space-y-1">
              <span class="text-sm font-medium text-slate-700">Precio regular</span>
              <input
                v-model.number="form.originalPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ej: 12.99"
                class="border rounded px-3 py-2 w-full bg-white"
                @input="onOriginalPriceInput"
              />
            </label>

            <label class="space-y-1">
              <span class="text-sm font-medium text-slate-700">Precio de venta</span>
              <input
                v-model.number="form.price"
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="Ej: 9.99"
                class="border rounded px-3 py-2 w-full bg-white"
                @input="onSalePriceInput"
              />
            </label>

            <label class="space-y-1">
              <span class="text-sm font-medium text-slate-700">Descuento %</span>
              <input
                v-model.number="form.discount"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="0"
                class="border rounded px-3 py-2 w-full bg-white"
                @input="onDiscountInput"
              />
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div class="rounded-lg bg-white border px-3 py-3">
              <p class="text-slate-500">Precio regular</p>
              <p class="text-lg font-semibold text-slate-900">{{ formatCurrency(form.originalPrice || form.price || 0) }}</p>
            </div>
            <div class="rounded-lg bg-white border px-3 py-3">
              <p class="text-slate-500">Precio final</p>
              <p class="text-lg font-semibold text-blue-700">{{ formatCurrency(form.price || 0) }}</p>
            </div>
            <div class="rounded-lg bg-white border px-3 py-3">
              <p class="text-slate-500">Ahorro del cliente</p>
              <p class="text-lg font-semibold text-green-700">{{ formatCurrency(discountAmount) }} <span v-if="safeDiscount > 0" class="text-sm">({{ safeDiscount }}%)</span></p>
            </div>
          </div>
        </div>

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

        <!-- Imagen con preview -->
        <div class="md:col-span-2 border rounded p-3 space-y-2">
          <p class="text-sm font-medium text-slate-600">Imagen del producto</p>
          <input type="file" accept="image/*" @change="onImageFile" class="border rounded px-3 py-2 w-full" />
          <input v-model="imageUrlInput" type="url" placeholder="O URL de imagen" class="border rounded px-3 py-2 w-full" @input="imagePreviewUrl = imageUrlInput" />
          <div v-if="imagePreviewUrl" class="mt-2">
            <img :src="resolveImageUrl(imagePreviewUrl)" alt="Preview" class="h-32 rounded border object-contain" />
          </div>
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

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')

const items = ref([])
const departments = ref([])
const categories = ref([])
const loading = ref(false)
const showModal = ref(false)
const editingId = ref('')
const imageFile = ref(null)
const imageUrlInput = ref('')
const imagePreviewUrl = ref('')
const toast = useToast()

const filters = ref({ search: '', department: '', category: '', stock: '' })
const pagination = ref({ page: 1, pages: 1, total: 0, limit: 20 })

const form = ref({
  name: '', sku: '', price: 0, stock: 0,
  department: '', category: '', description: '', discount: 0,
  featured: false, salesChannel: 'store', productType: 'general',
  originalPrice: null,
  availableSizes: []
})

const safeDiscount = computed(() => {
  const discount = Number(form.value.discount || 0)
  return Math.min(100, Math.max(0, Number(discount.toFixed(2))))
})

const discountAmount = computed(() => {
  const original = Number(form.value.originalPrice || 0)
  const price = Number(form.value.price || 0)
  if (!original || original <= price) return 0
  return Number((original - price).toFixed(2))
})

const showSizes = computed(() => form.value.productType === 'ropa' || form.value.productType === 'zapatos')

const categoriesForDepartment = computed(() => categories.value.filter(c => {
  const deptId = typeof c.department === 'string' ? c.department : c.department?._id
  return !form.value.department || deptId === form.value.department
}))

const filteredCategoriesForFilter = computed(() => {
  if (!filters.value.department) return categories.value
  return categories.value.filter(c => {
    const deptId = typeof c.department === 'string' ? c.department : c.department?._id
    return deptId === filters.value.department
  })
})

const paginationPages = computed(() => {
  const total = pagination.value.pages
  const current = pagination.value.page
  const maxVisible = 5
  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(total, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function resolveImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function roundMoney(value) {
  return Number(Number(value || 0).toFixed(2))
}

function recalculateDiscountFromPrices() {
  const original = Number(form.value.originalPrice || 0)
  const price = Number(form.value.price || 0)

  if (!original || original <= 0 || price <= 0 || original <= price) {
    form.value.discount = 0
    if (original && price && original <= price) {
      form.value.originalPrice = roundMoney(price)
    }
    return
  }

  form.value.discount = roundMoney(((original - price) / original) * 100)
}

function recalculateSalePriceFromDiscount() {
  const original = Number(form.value.originalPrice || 0)
  const discount = Math.min(100, Math.max(0, Number(form.value.discount || 0)))

  if (!original || original <= 0) return

  form.value.discount = roundMoney(discount)
  form.value.price = roundMoney(original * (1 - discount / 100))
}

function onOriginalPriceInput() {
  if (!form.value.originalPrice) {
    form.value.discount = 0
    return
  }

  if (!form.value.price || Number(form.value.price) <= 0) {
    form.value.price = roundMoney(form.value.originalPrice)
    form.value.discount = 0
    return
  }

  if (Number(form.value.discount || 0) > 0) {
    recalculateSalePriceFromDiscount()
    return
  }

  recalculateDiscountFromPrices()
}

function onSalePriceInput() {
  form.value.price = roundMoney(form.value.price)
  recalculateDiscountFromPrices()
}

function onDiscountInput() {
  recalculateSalePriceFromDiscount()
}

watch(() => form.value.productType, (type) => {
  if (!(type === 'ropa' || type === 'zapatos')) form.value.availableSizes = []
})

watch(() => form.value.department, () => {
  form.value.category = ''
})

let searchTimer = null
function onFilterChange() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadProducts(1), 350)
}

function onDeptFilterChange() {
  filters.value.category = ''
  onFilterChange()
}

function goToPage(page) {
  loadProducts(page)
}

function addSizeRow() {
  form.value.availableSizes.push({ label: '', quantity: 0 })
}

async function loadProducts(page = 1) {
  loading.value = true
  try {
    const params = new URLSearchParams({ page, limit: pagination.value.limit })
    if (filters.value.search) params.set('search', filters.value.search)
    if (filters.value.department) params.set('department', filters.value.department)
    if (filters.value.category) params.set('category', filters.value.category)
    if (filters.value.stock === 'low') params.set('maxStock', '9')
    if (filters.value.stock === 'out') params.set('maxStock', '0')

    const res = await api.products.list(params.toString())
    items.value = res.data || []
    if (res.pagination) pagination.value = { ...pagination.value, ...res.pagination }
  } catch (error) {
    toast.error(error.message || 'No se pudo cargar productos')
  } finally {
    loading.value = false
  }
}

async function loadAll() {
  try {
    const [departmentsRes, categoriesRes] = await Promise.all([
      api.departments.list('isActive=true'),
      api.categories.list('isActive=true')
    ])
    departments.value = departmentsRes.data || []
    categories.value = categoriesRes.data || []
  } catch (error) {
    toast.error(error.message || 'No se pudo cargar datos auxiliares')
  }
  await loadProducts(1)
}

function resetForm() {
  editingId.value = ''
  imageFile.value = null
  imageUrlInput.value = ''
  imagePreviewUrl.value = ''
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
  const existingUrl = item.images?.[0]?.url || ''
  imageUrlInput.value = existingUrl
  imagePreviewUrl.value = existingUrl
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
  const file = event.target.files?.[0] || null
  imageFile.value = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => { imagePreviewUrl.value = e.target.result }
    reader.readAsDataURL(file)
  }
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

    const normalizedOriginalPrice = Number(form.value.originalPrice || 0)
    const normalizedPrice = Number(form.value.price || 0)
    const hasRealDiscount = normalizedOriginalPrice > 0 && normalizedOriginalPrice > normalizedPrice

    const payload = {
      ...form.value,
      price: roundMoney(normalizedPrice),
      originalPrice: hasRealDiscount ? roundMoney(normalizedOriginalPrice) : null,
      discount: hasRealDiscount ? roundMoney(((normalizedOriginalPrice - normalizedPrice) / normalizedOriginalPrice) * 100) : 0,
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
    await loadProducts(pagination.value.page)
  } catch (error) {
    toast.error(error.message || 'No se pudo eliminar el producto')
  }
}

onMounted(loadAll)
</script>
