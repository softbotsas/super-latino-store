<template>
  <section class="py-16 bg-gradient-to-br from-gray-50 to-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          Productos Destacados
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Los mejores productos con precios increíbles para toda la familia
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-300"></div>
          <div class="p-6 space-y-3">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-3 bg-gray-300 rounded w-full"></div>
            <div class="h-3 bg-gray-300 rounded w-2/3"></div>
            <div class="h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div v-for="product in featuredProducts" :key="product._id"
             @click="goToProduct(product)"
             class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group overflow-hidden cursor-pointer">
          <!-- Product Image -->
          <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
              v-if="product.images && product.images[0]"
              :src="getImageUrl(product.images[0].url)"
              :alt="product.name"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <span class="text-6xl">📦</span>
            </div>
            <!-- Discount Badge -->
            <div v-if="product.discount && product.discount > 0" class="absolute top-4 left-4 bg-latino-red text-white px-3 py-1 rounded-full text-sm font-bold">
              -{{ product.discount }}% OFF
            </div>
            <!-- Featured Badge -->
            <div v-if="product.featured" class="absolute top-4 right-4 bg-latino-yellow text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
              ⭐ Destacado
            </div>
            <!-- Favorite Button -->
            <button class="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-latino-red hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>

          <!-- Product Info -->
          <div class="p-6">
            <h3 class="font-bold text-lg text-gray-900 mb-2 group-hover:text-latino-blue transition-colors">
              {{ product.name }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ product.description }}
            </p>

            <!-- Price -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <span class="text-2xl font-bold text-latino-blue">${{ product.price }}</span>
                <span v-if="product.originalPrice" class="text-lg text-gray-400 line-through">
                  ${{ product.originalPrice }}
                </span>
              </div>
              <div class="flex items-center text-yellow-500">
                <template v-for="i in 5" :key="i">
                  <svg class="w-4 h-4" :class="i <= Math.round(product.rating?.average || product.rating || 0) ? 'fill-current' : 'text-gray-300 fill-current'" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </template>
                <span class="text-sm text-gray-600 ml-1">({{ product.rating?.count || 0 }})</span>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button
              @click.stop="goToProduct(product)"
              class="w-full bg-gradient-to-r from-latino-blue to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Ver Producto
            </button>
          </div>
        </div>
      </div>

      <!-- View All Button -->
      <div class="text-center">
        <button @click="router.push('/catalogo')" class="bg-latino-red text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg">
          Ver Todos los Productos
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const featuredProducts = ref([])
const loading = ref(true)

// Fetch productos destacados del backend
async function fetchFeaturedProducts() {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/products?featured=true&limit=8`)
    const data = await response.json()

    if (data.success) {
      featuredProducts.value = data.data
    }
  } catch (error) {
    console.error('Error fetching featured products:', error)
  } finally {
    loading.value = false
  }
}

function getImageUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')
  return `${base}${url}`
}

function goToProduct(product) {
  router.push(`/producto/${product._id}`)
}

onMounted(() => {
  fetchFeaturedProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

