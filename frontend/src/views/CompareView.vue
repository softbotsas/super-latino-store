<template>
  <div class="min-h-screen bg-gray-50">
    <Header :is-menu-open="isMenuOpen" @toggle-menu="isMenuOpen = !isMenuOpen" />

    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-4xl font-bold mb-2">Comparar Productos</h1>
          <p class="text-gray-600">Compara hasta {{ compareStore.maxItems }} productos lado a lado</p>
        </div>
        <button
          v-if="compareStore.compareCount > 0"
          @click="compareStore.clearCompare"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
        >
          🗑️ Limpiar Todo
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="compareStore.compareCount === 0" class="text-center py-20">
        <div class="text-6xl mb-4">📊</div>
        <h2 class="text-2xl font-bold mb-2">No hay productos para comparar</h2>
        <p class="text-gray-600 mb-6">Agrega productos desde el catálogo</p>
        <router-link
          to="/catalogo"
          class="inline-block px-8 py-3 bg-latino-blue hover:bg-blue-700 text-white font-bold rounded-lg transition"
        >
          Ir al Catálogo
        </router-link>
      </div>

      <!-- Compare Table -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-4 text-left font-bold text-gray-700 sticky left-0 bg-gray-100">Característica</th>
              <th
                v-for="product in compareStore.compareList"
                :key="product._id"
                class="p-4 text-center min-w-[250px]"
              >
                <div class="relative">
                  <button
                    @click="compareStore.removeFromCompare(product._id)"
                    class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Images -->
            <tr class="border-b">
              <td class="p-4 font-semibold sticky left-0 bg-white">Imagen</td>
              <td v-for="product in compareStore.compareList" :key="product._id" class="p-4 text-center">
                <img
                  :src="getImageUrl(product.images?.[0]?.url)"
                  :alt="product.name"
                  class="w-full h-48 object-cover rounded-lg mx-auto"
                />
              </td>
            </tr>

            <!-- Name -->
            <tr class="border-b bg-gray-50">
              <td class="p-4 font-semibold sticky left-0 bg-gray-50">Nombre</td>
              <td v-for="product in compareStore.compareList" :key="product._id" class="p-4 text-center">
                <p class="font-bold text-gray-900">{{ product.name }}</p>
              </td>
            </tr>

            <!-- Price -->
            <tr class="border-b">
              <td class="p-4 font-semibold sticky left-0 bg-white">Precio</td>
              <td v-for="product in compareStore.compareList" :key="product._id" class="p-4 text-center">
                <div v-if="product.originalPrice && product.originalPrice > product.price">
                  <p class="text-2xl font-bold text-latino-red">${{ product.price.toFixed(2) }}</p>
                  <p class="text-sm text-gray-400 line-through">${{ product.originalPrice.toFixed(2) }}</p>
                </div>
                <p v-else class="text-2xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</p>
              </td>
            </tr>

            <!-- Discount -->
            <tr class="border-b bg-gray-50">
              <td class="p-4 font-semibold sticky left-0 bg-gray-50">Descuento</td>
              <td v-for="product in compareStore.compareList" :key="product._id" class="p-4 text-center">
                <span v-if="product.discount" class="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full font-bold">
                  -{{ product.discount }}%
                </span>
                <span v-else class="text-gray-400">Sin descuento</span>
              </td>
            </tr>

            <!-- Stock -->
            <tr class="border-b">
              <td class="p-4 font-semibold sticky left-0 bg-white">Disponibilidad</td>
              <td v-for="product in compareStore.compareList" :key="product._id" class="p-4 text-center">
                <span v-if="product.stock > 10" class="text-green-600 font-semibold">
                  ✅ {{ product.stock }} disponibles
                </span>
                <span v-else-if="product.stock > 0" class="text-orange-600 font-semibold">
                  ⚠️ {{ product.stock }} disponibles
                </span>
                <span v-else class="text-red-600 font-semibold">
                  ❌ Agotado
                </span>
              </td>
            </tr>

            <!-- Rating -->
            <tr class="border-b bg-gray-50">
              <td class="p-4 font-semibold sticky left-0 bg-gray-50">Valoración</td>
              <td v-for="product in compareStore.compareList" :key="product._id" class="p-4 text-center">
                <div v-if="product.rating" class="flex flex-col items-center gap-1">
                  <div class="flex">
                    <span v-for="star in 5" :key="star" class="text-yellow-400">
                      {{ star <= Math.round(product.rating.average) ? '⭐' : '☆' }}
                    </span>
                  </div>
                  <span class="text-sm text-gray-600">{{ product.rating.average.toFixed(1) }} ({{ product.rating.count }})</span>
                </div>
                <span v-else class="text-gray-400">Sin valoraciones</span>
              </td>
            </tr>

            <!-- Add to Cart -->
            <tr>
              <td class="p-4 font-semibold sticky left-0 bg-white">Acción</td>
              <td v-for="product in compareStore.compareList" :key="product._id" class="p-4 text-center">
                <button
                  @click="addProductToCart(product)"
                  :disabled="product.stock === 0"
                  class="px-6 py-3 rounded-lg font-bold transition"
                  :class="product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-latino-blue hover:bg-blue-700 text-white'"
                >
                  🛒 Agregar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCompareStore } from '../stores/compare'
import { useCartStore } from '../stores/cart'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

// Mobile Menu
const isMenuOpen = ref(false)

const compareStore = useCompareStore()
const cartStore = useCartStore()
const UPLOADS_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')

function getImageUrl(url) {
  if (!url) return 'https://via.placeholder.com/400x400?text=Sin+Imagen'
  if (url.startsWith('/uploads')) return `${UPLOADS_BASE}${url}`
  return url
}

function addProductToCart(product) {
  if (product.stock > 0) {
    cartStore.addItem(product)
    cartStore.openCart()
  }
}
</script>


