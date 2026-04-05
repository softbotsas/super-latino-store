<template>
  <div class="relative w-full">
    <!-- Search Input -->
    <div class="relative bg-white rounded-full shadow-lg border-2 border-gray-200 hover:border-latino-blue transition-all duration-300 group-hover:shadow-xl">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        @focus="showResults = true"
        type="text"
        placeholder="¿Qué estás buscando hoy? 🔍"
        class="w-full px-6 py-4 pr-16 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-lg"
      />
      <button
        @click="performSearch"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-latino-blue to-blue-600 text-white rounded-full p-3 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-110 shadow-lg"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </button>
    </div>

    <!-- Search Results Dropdown -->
    <Transition name="fade">
      <div
        v-if="showResults && (searchQuery.length >= 2 || recentSearches.length)"
        v-click-outside="closeResults"
        class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
      >
        <!-- Recent Searches -->
        <div v-if="recentSearches.length && !searchQuery" class="p-4 border-b">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-700">Búsquedas recientes</h3>
            <button
              @click="clearRecentSearches"
              class="text-sm text-gray-500 hover:text-latino-red"
            >
              Limpiar
            </button>
          </div>
          <div class="space-y-2">
            <button
              v-for="(search, index) in recentSearches"
              :key="index"
              @click="selectRecentSearch(search)"
              class="flex items-center gap-2 text-gray-700 hover:text-latino-blue w-full text-left"
            >
              <span>🕐</span>
              <span>{{ search }}</span>
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="searching" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-latino-blue"></div>
          <p class="mt-2 text-gray-600">Buscando...</p>
        </div>

        <!-- Results -->
        <div v-else-if="searchResults.length" class="p-2">
          <p class="text-sm text-gray-500 px-4 py-2">
            {{ searchResults.length }} resultado(s)
          </p>
          <div
            v-for="product in searchResults"
            :key="product._id"
            @click="goToProduct(product)"
            class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition"
          >
            <img
              :src="getImageUrl(product.images?.[0]?.url)"
              :alt="product.name"
              class="w-16 h-16 object-cover rounded-lg"
            />
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900">{{ product.name }}</h4>
              <p class="text-sm text-gray-600">{{ product.category?.name }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-latino-blue">${{ product.price.toFixed(2) }}</p>
              <p v-if="product.discount" class="text-xs text-red-600">-{{ product.discount }}% OFF</p>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="searchQuery.length >= 2" class="p-8 text-center">
          <p class="text-gray-600">No se encontraron resultados</p>
          <p class="text-sm text-gray-500 mt-2">Intenta con otros términos</p>
        </div>

        <!-- View All -->
        <div v-if="searchResults.length" class="border-t p-3">
          <button
            @click="viewAllResults"
            class="w-full py-2 text-latino-blue hover:bg-blue-50 rounded-lg font-semibold transition"
          >
            Ver todos los resultados →
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const UPLOADS_BASE = API_URL.replace(/\/api\/?$/, '')

const searchQuery = ref('')
const searchResults = ref([])
const showResults = ref(false)
const searching = ref(false)
const recentSearches = ref([])

let searchTimeout = null

// Load recent searches from localStorage
function loadRecentSearches() {
  try {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      recentSearches.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading recent searches:', error)
  }
}

// Save to localStorage
function saveRecentSearch(query) {
  if (!query || query.length < 2) return

  // Remove if exists
  recentSearches.value = recentSearches.value.filter(s => s !== query)

  // Add to beginning
  recentSearches.value.unshift(query)

  // Keep only last 5
  recentSearches.value = recentSearches.value.slice(0, 5)

  try {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
  } catch (error) {
    console.error('Error saving recent search:', error)
  }
}

function clearRecentSearches() {
  recentSearches.value = []
  localStorage.removeItem('recentSearches')
}

function selectRecentSearch(search) {
  searchQuery.value = search
  performSearch()
}

async function handleSearch() {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  clearTimeout(searchTimeout)
  searching.value = true

  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(`${API_URL}/products?search=${searchQuery.value}&limit=5`)
      const data = await response.json()

      if (data.success) {
        searchResults.value = data.data
      }
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      searching.value = false
    }
  }, 300)
}

function performSearch() {
  if (searchQuery.value.length < 2) return

  saveRecentSearch(searchQuery.value)
  router.push(`/catalogo?search=${searchQuery.value}`)
  closeResults()
}

function viewAllResults() {
  performSearch()
}

function goToProduct(product) {
  saveRecentSearch(searchQuery.value)
  router.push(`/producto/${product._id}`)
  closeResults()
}

function closeResults() {
  showResults.value = false
}

function getImageUrl(url) {
  if (!url) return 'https://via.placeholder.com/100x100?text=Sin+Imagen'
  if (url.startsWith('/uploads')) return `${UPLOADS_BASE}${url}`
  return url
}

// Click outside directive
const clickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Initialize
loadRecentSearches()

// Use directive
const vClickOutside = clickOutside
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


