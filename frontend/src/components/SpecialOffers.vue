<template>
  <section class="py-16 bg-gradient-to-r from-latino-red to-red-600 text-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4">🔥 Ofertas del Dia</h2>
        <p class="text-xl text-red-100">Productos con descuento activos en este momento</p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="bg-white/20 rounded-2xl h-80 animate-pulse"></div>
      </div>

      <div v-else-if="offers.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="offer in offers"
          :key="offer._id"
          @click="goToProduct(offer)"
          class="bg-white rounded-2xl shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
            <img
              v-if="offer.images?.[0]?.url"
              :src="getImageUrl(offer.images[0].url)"
              :alt="offer.name"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <span class="text-7xl">🛍️</span>
            </div>

            <div class="absolute top-4 left-4 bg-latino-yellow text-latino-red px-4 py-2 rounded-full text-lg font-bold shadow-lg">
              -{{ offer.discount || calcDiscount(offer) }}% OFF
            </div>
          </div>

          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">{{ offer.name }}</h3>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ offer.description }}</p>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="text-3xl font-bold text-latino-red">${{ Number(offer.price).toFixed(2) }}</span>
                <span v-if="offer.originalPrice" class="text-xl text-gray-400 line-through">
                  ${{ Number(offer.originalPrice).toFixed(2) }}
                </span>
              </div>
              <span class="text-latino-green font-semibold">
                Ahorras ${{ savings(offer) }}
              </span>
            </div>

            <button class="w-full mt-5 bg-gradient-to-r from-latino-red to-red-600 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300">
              Ver oferta
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10 text-red-100">
        No hay ofertas activas por ahora.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const UPLOADS_BASE = API_URL.replace(/\/api\/?$/, '')
const router = useRouter()
const offers = ref([])
const loading = ref(false)

function getImageUrl(url) {
  if (!url) return 'https://via.placeholder.com/600x400?text=Sin+Imagen'
  if (url.startsWith('/uploads')) return `${UPLOADS_BASE}${url}`
  return url
}

function calcDiscount(product) {
  if (!product.originalPrice || !product.price || Number(product.originalPrice) <= Number(product.price)) return 0
  return Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
}

function savings(product) {
  if (!product.originalPrice || !product.price) return '0.00'
  return (Number(product.originalPrice) - Number(product.price)).toFixed(2)
}

async function loadOffers() {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/products?onSale=true&limit=6&sort=-createdAt`)
    const data = await response.json()
    if (data.success) {
      offers.value = data.data || []
    }
  } catch (error) {
    console.error('Error loading offers:', error)
  } finally {
    loading.value = false
  }
}

function goToProduct(product) {
  router.push(`/producto/${product._id}`)
}

onMounted(loadOffers)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
