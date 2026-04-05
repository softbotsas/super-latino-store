<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header :is-menu-open="isMenuOpen" @toggle-menu="isMenuOpen = !isMenuOpen" />

    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-latino-blue to-blue-600 text-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Catálogo de Productos</h1>
        <p class="text-xl text-blue-100">Encuentra todo lo que necesitas al mejor precio</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <!-- Sidebar - Filtros -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">Filtros</h2>

            <!-- Búsqueda -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Buscar
              </label>
              <input
                v-model="filters.search"
                @input="debouncedSearch"
                type="text"
                placeholder="Buscar productos..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue focus:border-transparent"
              />
            </div>

            <!-- Departamento -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                🏬 Departamento
              </label>
              <select
                v-model="filters.department"
                @change="applyFilters"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue"
              >
                <option value="">Todos los departamentos</option>
                <option
                  v-for="dept in departments"
                  :key="dept._id"
                  :value="dept._id"
                >
                  {{ dept.icon }} {{ dept.name }}
                </option>
              </select>
            </div>

            <!-- Categoría -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                📂 Categoría
              </label>
              <select
                v-model="filters.category"
                @change="applyFilters"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue"
              >
                <option value="">Todas las categorías</option>
                <option
                  v-for="cat in filteredCategories"
                  :key="cat._id"
                  :value="cat._id"
                >
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <!-- Rango de Precio -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                💰 Precio
              </label>
              <div class="flex gap-2">
                <input
                  v-model.number="filters.minPrice"
                  @change="applyFilters"
                  type="number"
                  placeholder="Min"
                  class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  v-model.number="filters.maxPrice"
                  @change="applyFilters"
                  type="number"
                  placeholder="Max"
                  class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <!-- Solo Destacados -->
            <div class="mb-6">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="filters.featured"
                  @change="applyFilters"
                  type="checkbox"
                  class="w-5 h-5 text-latino-blue border-gray-300 rounded focus:ring-latino-blue"
                />
                <span class="ml-2 text-sm font-semibold text-gray-700">
                  ⭐ Solo Destacados
                </span>
              </label>
            </div>

            <!-- Solo con Descuento -->
            <div class="mb-6">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="filters.onSale"
                  @change="applyFilters"
                  type="checkbox"
                  class="w-5 h-5 text-latino-red border-gray-300 rounded focus:ring-latino-red"
                />
                <span class="ml-2 text-sm font-semibold text-gray-700">
                  🔥 Con Descuento
                </span>
              </label>
            </div>

            <!-- Ordenar por -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                🔃 Ordenar por
              </label>
              <select
                v-model="filters.sortBy"
                @change="applyFilters"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue"
              >
                <option value="">Relevancia</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="rating-desc">Mejor Valorados</option>
                <option value="newest">Más Recientes</option>
              </select>
            </div>

            <!-- Limpiar Filtros -->
            <button
              @click="clearFilters"
              class="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
            >
              🗑️ Limpiar Filtros
            </button>
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="lg:col-span-3">
          <!-- Active Filters Chips -->
          <div v-if="activeFiltersCount > 0" class="bg-white rounded-xl shadow-lg p-4 mb-4">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm text-gray-600 font-semibold">Filtros activos:</span>

              <button
                v-if="filters.search"
                @click="filters.search = ''; applyFilters()"
                class="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
              >
                <span>🔍 "{{ filters.search }}"</span>
                <span class="text-lg">×</span>
              </button>

              <button
                v-if="filters.department"
                @click="filters.department = ''; applyFilters()"
                class="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition"
              >
                <span>🏬 {{ getDepartmentName(filters.department) }}</span>
                <span class="text-lg">×</span>
              </button>

              <button
                v-if="filters.category"
                @click="filters.category = ''; applyFilters()"
                class="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition"
              >
                <span>📂 {{ getCategoryName(filters.category) }}</span>
                <span class="text-lg">×</span>
              </button>

              <button
                v-if="filters.featured"
                @click="filters.featured = false; applyFilters()"
                class="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium hover:bg-yellow-200 transition"
              >
                <span>⭐ Destacados</span>
                <span class="text-lg">×</span>
              </button>

              <button
                v-if="filters.onSale"
                @click="filters.onSale = false; applyFilters()"
                class="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition"
              >
                <span>🔥 Con Descuento</span>
                <span class="text-lg">×</span>
              </button>

              <button
                v-if="filters.minPrice || filters.maxPrice"
                @click="filters.minPrice = null; filters.maxPrice = null; applyFilters()"
                class="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition"
              >
                <span>💰 Precio: ${{ filters.minPrice || 0 }} - ${{ filters.maxPrice || '∞' }}</span>
                <span class="text-lg">×</span>
              </button>

              <button
                @click="clearFilters"
                class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-300 transition"
              >
                Limpiar todo
              </button>
            </div>
          </div>

          <!-- Results Header -->
          <div class="bg-white rounded-xl shadow-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <p class="text-gray-600">
                <span class="font-bold text-gray-800">{{ totalProducts }}</span> productos encontrados
              </p>
            </div>
            <div class="flex gap-2">
              <button
                @click="viewMode = 'grid'"
                :class="viewMode === 'grid' ? 'bg-latino-blue text-white' : 'bg-gray-200'"
                class="px-4 py-2 rounded-lg transition"
              >
                📱 Grid
              </button>
              <button
                @click="viewMode = 'list'"
                :class="viewMode === 'list' ? 'bg-latino-blue text-white' : 'bg-gray-200'"
                class="px-4 py-2 rounded-lg transition"
              >
                📋 Lista
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-latino-blue"></div>
            <p class="mt-4 text-gray-600">Cargando productos...</p>
          </div>

          <!-- No Results -->
          <div v-else-if="products.length === 0" class="text-center py-12">
            <p class="text-2xl text-gray-400 mb-4">😢</p>
            <p class="text-xl text-gray-600 mb-4">No se encontraron productos</p>
            <button @click="clearFilters" class="btn-primary">
              Limpiar Filtros
            </button>
          </div>

          <!-- Products Grid View -->
          <div
            v-else-if="viewMode === 'grid'"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ProductCard
              v-for="product in products"
              :key="product._id"
              :product="product"
              @add-to-cart="addToCart"
              @quick-view="openQuickView"
            />
          </div>

          <!-- Products List View -->
          <div v-else class="space-y-4">
            <ProductListItem
              v-for="product in products"
              :key="product._id"
              :product="product"
              @add-to-cart="addToCart"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-8 flex justify-center gap-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              ← Anterior
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="page === currentPage ? 'bg-latino-blue text-white' : 'bg-white text-gray-700'"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {{ page }}
            </button>

            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </main>
      </div>
    </div>

    <!-- Footer -->
    <Footer />

    <!-- Quick View Modal -->
    <QuickViewModal
      :is-open="quickViewOpen"
      :product-id="quickViewProductId"
      @close="closeQuickView"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductListItem from '../components/ProductListItem.vue'
import QuickViewModal from '../components/QuickViewModal.vue'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

// API URL
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')
const UPLOADS_BASE = API_URL.replace(/\/api\/?$/, '')

// Mobile Menu
const isMenuOpen = ref(false)

// State
const products = ref([])
const departments = ref([])
const categories = ref([])
const loading = ref(false)
const viewMode = ref('grid')

// Quick View
const quickViewOpen = ref(false)
const quickViewProductId = ref(null)

// Pagination
const currentPage = ref(1)
const totalPages = ref(1)
const totalProducts = ref(0)
const limit = ref(12)

// Filters
const filters = ref({
  search: '',
  department: '',
  category: '',
  minPrice: null,
  maxPrice: null,
  featured: false,
  onSale: false,
  sortBy: ''
})

function getDepartmentIdFromCategory(category) {
  if (!category || !category.department) return ''
  if (typeof category.department === 'string') return category.department
  return category.department._id || ''
}

// Computed
const filteredCategories = computed(() => {
  if (!filters.value.department) return categories.value
  return categories.value.filter(cat => getDepartmentIdFromCategory(cat) === filters.value.department)
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.search) count++
  if (filters.value.department) count++
  if (filters.value.category) count++
  if (filters.value.minPrice || filters.value.maxPrice) count++
  if (filters.value.featured) count++
  if (filters.value.onSale) count++
  return count
})

function getDepartmentName(id) {
  return departments.value.find(d => d._id === id)?.name || ''
}

function getCategoryName(id) {
  return categories.value.find(c => c._id === id)?.name || ''
}

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
async function fetchProducts() {
  loading.value = true

  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      limit: limit.value
    })

    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.department) params.append('department', filters.value.department)
    if (filters.value.category) params.append('category', filters.value.category)
    if (filters.value.minPrice) params.append('minPrice', filters.value.minPrice)
    if (filters.value.maxPrice) params.append('maxPrice', filters.value.maxPrice)
    if (filters.value.featured) params.append('featured', 'true')
    if (filters.value.onSale) params.append('onSale', 'true')
    if (filters.value.sortBy) {
      const [field, order] = filters.value.sortBy.split('-')
      params.append('sortBy', field)
      params.append('order', order || 'asc')
    }

    const response = await fetch(`${API_URL}/products?${params}`)
    const data = await response.json()

    if (data.success) {
      products.value = data.data
      totalPages.value = data.pagination?.pages || 1
      totalProducts.value = data.pagination?.total || data.data.length
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    showNotification('Error al cargar productos', 'error')
  } finally {
    loading.value = false
  }
}

async function fetchDepartments() {
  try {
    const response = await fetch(`${API_URL}/departments`)
    const data = await response.json()
    if (data.success) {
      departments.value = data.data
    }
  } catch (error) {
    console.error('Error fetching departments:', error)
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`)
    const data = await response.json()
    if (data.success) {
      categories.value = data.data
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

function applyFilters() {
  currentPage.value = 1
  fetchProducts()
}

function clearFilters() {
  filters.value = {
    search: '',
    department: '',
    category: '',
    minPrice: null,
    maxPrice: null,
    featured: false,
    onSale: false,
    sortBy: ''
  }
  applyFilters()
}

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Debounced search
let searchTimeout = null
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

function addToCart(product) {
  const result = cartStore.addItem(product)
  if (result.success) {
    cartStore.openCart()
    showNotification(result.message, 'success')
  } else {
    showNotification(result.message, 'error')
  }
}

function showNotification(message, type = 'info') {
  // Simple notification - could be improved with a toast component
  alert(message)
}

function openQuickView(product) {
  quickViewProductId.value = product._id
  quickViewOpen.value = true
}

function closeQuickView() {
  quickViewOpen.value = false
  quickViewProductId.value = null
}

// Lifecycle
onMounted(() => {
  if (route.query.department) {
    filters.value.department = String(route.query.department)
  }
  if (route.query.category) {
    filters.value.category = String(route.query.category)
  }
  if (route.query.onSale === 'true') {
    filters.value.onSale = true
  }
  if (route.query.featured === 'true') {
    filters.value.featured = true
  }
  fetchProducts()
  fetchDepartments()
  fetchCategories()
})

// Watch department changes to reset category
watch(() => filters.value.department, () => {
  filters.value.category = ''
})
</script>

<style scoped>
.btn-primary {
  @apply px-6 py-3 bg-latino-blue hover:bg-blue-700 text-white font-bold rounded-lg transition;
}
</style>

