<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header :is-menu-open="isMenuOpen" @toggle-menu="isMenuOpen = !isMenuOpen" />

    <!-- Breadcrumbs -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <nav class="flex items-center space-x-2 text-sm">
          <router-link to="/" class="text-gray-600 hover:text-latino-blue">
            Inicio
          </router-link>
          <span class="text-gray-400">/</span>
          <router-link to="/catalogo" class="text-gray-600 hover:text-latino-blue">
            Productos
          </router-link>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900 font-semibold">{{ product?.name }}</span>
        </nav>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-12">
      <div class="animate-pulse">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-gray-300 h-96 rounded-2xl"></div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-300 rounded w-3/4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            <div class="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <!-- Images -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="relative bg-white rounded-2xl shadow-xl overflow-hidden aspect-square">
            <img
              :src="currentImage"
              :alt="product.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />

            <!-- Badges -->
            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span v-if="product.featured" class="badge bg-latino-yellow text-gray-900 font-bold px-4 py-2 rounded-full">
                ⭐ Destacado
              </span>
              <span v-if="hasDiscount" class="badge bg-latino-red text-white font-bold px-4 py-2 rounded-full text-lg">
                -{{ product.discount }}% OFF
              </span>
            </div>

            <!-- Favorite -->
            <button
              @click="toggleFavorite"
              class="absolute top-4 right-4 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition"
            >
              <span class="text-3xl">{{ isFavorited ? '❤️' : '🤍' }}</span>
            </button>
          </div>

          <!-- Thumbnails -->
          <div v-if="product.images && product.images.length > 1" class="grid grid-cols-4 gap-4">
            <div
              v-for="(image, index) in product.images"
              :key="index"
              @click="currentImageIndex = index"
              class="relative bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition aspect-square"
              :class="{ 'ring-4 ring-latino-blue': currentImageIndex === index }"
            >
              <img
                :src="getImageUrl(image.url)"
                :alt="image.alt"
                class="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Category -->
          <div class="flex items-center gap-2 text-sm">
            <span class="text-gray-500">Categoría:</span>
            <span class="font-semibold text-latino-blue">{{ product.category?.name || 'Sin categoría' }}</span>
          </div>

          <!-- Title -->
          <h1 class="text-4xl font-bold text-gray-900">
            {{ product.name }}
          </h1>

          <!-- Rating -->
          <div v-if="product.rating" class="flex items-center gap-3">
            <div class="flex">
              <span v-for="star in 5" :key="star" class="text-2xl">
                {{ star <= Math.round(product.rating.average) ? '⭐' : '☆' }}
              </span>
            </div>
            <span class="text-lg text-gray-600">
              {{ product.rating.average.toFixed(1) }} ({{ product.rating.count }} reseñas)
            </span>
          </div>

          <!-- Price -->
          <div class="bg-gray-100 rounded-2xl p-6">
            <div v-if="hasDiscount" class="space-y-2">
              <div class="flex items-center gap-4">
                <span class="text-4xl font-bold text-latino-red">
                  ${{ product.price.toFixed(2) }}
                </span>
                <span class="text-2xl text-gray-400 line-through">
                  ${{ product.originalPrice.toFixed(2) }}
                </span>
              </div>
              <p class="text-green-600 font-semibold">
                ¡Ahorras ${{ (product.originalPrice - product.price).toFixed(2) }}!
              </p>
            </div>
            <div v-else>
              <span class="text-4xl font-bold text-gray-900">
                ${{ product.price.toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Stock -->
          <div class="flex items-center gap-3">
            <span v-if="product.stock > 10" class="text-green-600 font-semibold flex items-center gap-2">
              ✅ En stock ({{ product.stock }} disponibles)
            </span>
            <span v-else-if="product.stock > 0" class="text-orange-600 font-semibold flex items-center gap-2">
              ⚠️ Solo quedan {{ product.stock }} unidades
            </span>
            <span v-else class="text-red-600 font-semibold flex items-center gap-2">
              ❌ Agotado
            </span>
            <span
              v-if="isVirtualOrderProduct"
              class="text-xs font-semibold uppercase tracking-wide bg-latino-green/10 text-latino-green px-3 py-1 rounded"
            >
              Solo tienda virtual
            </span>
          </div>

          <!-- Description -->
          <div class="border-t pt-6">
            <h3 class="text-xl font-bold mb-3">Descripción</h3>
            <p class="text-gray-700 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- SKU -->
          <div class="text-sm text-gray-500">
            <span class="font-semibold">SKU:</span> {{ product.sku }}
          </div>

          <!-- Quantity -->
          <div class="flex items-center gap-4">
            <span class="font-semibold">Cantidad:</span>
            <div class="flex items-center gap-3">
              <button
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-bold text-xl"
              >
                −
              </button>
              <span class="text-2xl font-bold w-12 text-center">{{ quantity }}</span>
              <button
                @click="increaseQuantity"
                :disabled="quantity >= product.stock"
                class="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-bold text-xl"
              >
                +
              </button>
            </div>
          </div>

          <!-- Add to Cart -->
          <button
            @click="addToCart"
            :disabled="!isVirtualOrderProduct && product.stock === 0"
            class="w-full py-5 rounded-2xl font-bold text-xl transition flex items-center justify-center gap-3 shadow-xl"
            :class="!isVirtualOrderProduct && product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isVirtualOrderProduct
                ? 'bg-gradient-to-r from-latino-green to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                : 'bg-gradient-to-r from-latino-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'"
          >
            <span class="text-3xl">{{ isVirtualOrderProduct ? '📲' : '🛒' }}</span>
            <span>{{ isVirtualOrderProduct ? 'Comprar ahora' : (product.stock === 0 ? 'Agotado' : 'Agregar al Carrito') }}</span>
          </button>

          <!-- Features -->
          <div v-if="product.tags && product.tags.length" class="border-t pt-6">
            <h3 class="text-xl font-bold mb-3">Características</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in product.tags"
                :key="tag"
                class="px-4 py-2 bg-blue-100 text-latino-blue rounded-full text-sm font-semibold"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length" class="mt-16">
        <h2 class="text-3xl font-bold mb-8">Productos Relacionados</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct._id"
            :product="relatedProduct"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="max-w-7xl mx-auto px-4 py-12 text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
      <router-link to="/catalogo" class="text-latino-blue hover:underline text-lg">
        Volver al catálogo
      </router-link>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'
import { openWhatsAppOrder } from '../utils/whatsappOrder'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

const API_URL = 'http://localhost:5000/api'

// Mobile Menu
const isMenuOpen = ref(false)

const product = ref(null)
const relatedProducts = ref([])
const loading = ref(true)
const quantity = ref(1)
const currentImageIndex = ref(0)
const imageError = ref(false)

// Computed
const hasDiscount = computed(() => {
  return product.value?.originalPrice && product.value.originalPrice > product.value.price
})

const currentImage = computed(() => {
  if (imageError.value || !product.value?.images?.length) {
    return 'https://via.placeholder.com/600x600?text=Sin+Imagen'
  }
  return getImageUrl(product.value.images[currentImageIndex.value]?.url)
})

const isFavorited = computed(() => {
  return product.value ? favoritesStore.isFavorite(product.value._id) : false
})

const isVirtualOrderProduct = computed(() => {
  return product.value && product.value.salesChannel === 'virtual'
})

// Methods
function getImageUrl(url) {
  if (!url) return 'https://via.placeholder.com/600x600?text=Sin+Imagen'
  if (url.startsWith('/uploads')) return `http://localhost:5000${url}`
  return url
}

function handleImageError() {
  imageError.value = true
}

function increaseQuantity() {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function toggleFavorite() {
  const added = favoritesStore.toggleFavorite(product.value)
  // TODO: Mostrar notificación
}

function addToCart() {
  if (isVirtualOrderProduct.value) {
    let size = ''
    if (Array.isArray(product.value.availableSizes) && product.value.availableSizes.length > 0) {
      const sizeLabels = product.value.availableSizes.map(s => (typeof s === 'string' ? s : s.label)).filter(Boolean)
      size = window.prompt(`Selecciona talla (${sizeLabels.join(', ')}):`, sizeLabels[0]) || ''
    }
    openWhatsAppOrder(product.value, { quantity: quantity.value, size })
    return
  }

  if (product.value.stock === 0) return

  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem(product.value)
  }

  cartStore.openCart()
  // TODO: Mostrar notificación
}

function handleAddToCart(prod) {
  cartStore.addItem(prod)
  cartStore.openCart()
}

async function fetchProduct() {
  loading.value = true
  try {
    const response = await fetch(`${API_URL}/products/${route.params.id}`)
    const data = await response.json()

    if (data.success) {
      product.value = data.data
      fetchRelatedProducts()
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    loading.value = false
  }
}

async function fetchRelatedProducts() {
  try {
    // Usar endpoint de productos relacionados
    const response = await fetch(`${API_URL}/products/${route.params.id}/related`)
    const data = await response.json()

    if (data.success) {
      relatedProducts.value = data.data.slice(0, 4) // Máximo 4
    } else {
      // Fallback: productos de la misma categoría
      if (product.value && product.value.category) {
        const categoryId = product.value.category._id || product.value.category
        const catResponse = await fetch(`${API_URL}/products?category=${categoryId}&limit=4`)
        const catData = await catResponse.json()

        if (catData.success) {
          // Excluir el producto actual
          relatedProducts.value = catData.data.filter(p => p._id !== route.params.id)
        }
      }
    }
  } catch (error) {
    console.error('Error fetching related products:', error)
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.badge {
  @apply shadow-lg;
}
</style>

