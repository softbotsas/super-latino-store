<template>
  <div class="product-list-item bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex">
    <!-- Product Image -->
    <div class="w-48 h-48 flex-shrink-0 bg-gray-100 relative overflow-hidden">
      <img
        :src="productImage"
        :alt="product.name"
        class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        @error="handleImageError"
      />

      <!-- Badges -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <span v-if="hasDiscount" class="badge bg-latino-red text-white font-bold px-2 py-1 rounded-full text-xs">
          -{{ product.discount }}%
        </span>
        <span v-if="product.featured" class="badge bg-latino-yellow text-gray-900 font-bold px-2 py-1 rounded-full text-xs">
          ⭐
        </span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="flex-1 p-6 flex flex-col justify-between">
      <div>
        <!-- Category -->
        <p class="text-xs text-gray-500 uppercase font-semibold mb-1">
          {{ categoryName }}
        </p>

        <!-- Product Name -->
        <h3
          @click="goToProduct"
          class="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-latino-blue transition"
        >
          {{ product.name }}
        </h3>

        <!-- Description -->
        <p class="text-gray-600 mb-3 line-clamp-2">
          {{ product.description }}
        </p>

        <!-- Rating -->
        <div v-if="product.rating" class="flex items-center gap-2 mb-3">
          <div class="flex">
            <span v-for="star in 5" :key="star" class="text-yellow-400 text-sm">
              {{ star <= Math.round(product.rating.average) ? '⭐' : '☆' }}
            </span>
          </div>
          <span class="text-sm text-gray-600">
            {{ product.rating.average.toFixed(1) }} ({{ product.rating.count }} reseñas)
          </span>
        </div>

        <!-- Tags -->
        <div v-if="product.tags && product.tags.length" class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="tag in product.tags.slice(0, 3)"
            :key="tag"
            class="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="flex items-end justify-between">
        <!-- Price and Stock -->
        <div>
          <!-- Price -->
          <div class="mb-2">
            <div v-if="hasDiscount" class="flex items-center gap-2">
              <span class="text-3xl font-bold text-latino-red">
                ${{ product.price.toFixed(2) }}
              </span>
              <span class="text-lg text-gray-400 line-through">
                ${{ product.originalPrice.toFixed(2) }}
              </span>
            </div>
            <div v-else>
              <span class="text-3xl font-bold text-gray-900">
                ${{ product.price.toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Stock -->
          <div class="flex items-center gap-2 text-sm">
            <span v-if="product.stock > 10" class="text-green-600 font-semibold">
              ✅ Disponible
            </span>
            <span v-else-if="product.stock > 0" class="text-orange-600 font-semibold">
              ⚠️ Solo {{ product.stock }} unidades
            </span>
            <span v-else class="text-red-600 font-semibold">
              ❌ Agotado
            </span>
            <span
              v-if="isVirtualOrderProduct"
              class="text-xs font-semibold uppercase tracking-wide bg-latino-green/10 text-latino-green px-2 py-1 rounded"
            >
              Solo tienda virtual
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="toggleFavorite"
            class="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition"
            :title="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          >
            <span class="text-xl">{{ isFavorite ? '❤️' : '🤍' }}</span>
          </button>

          <button
            @click="handleAddToCart"
            :disabled="!isVirtualOrderProduct && product.stock === 0"
            class="px-6 py-3 font-bold rounded-lg transition flex items-center gap-2"
            :class="!isVirtualOrderProduct && product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isVirtualOrderProduct
                ? 'bg-latino-green hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-latino-blue hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'"
          >
            <span class="text-xl">{{ isVirtualOrderProduct ? '📲' : '🛒' }}</span>
            <span>{{ isVirtualOrderProduct ? 'Comprar ahora' : (product.stock === 0 ? 'Agotado' : 'Agregar') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { openWhatsAppOrder } from '../utils/whatsappOrder'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const router = useRouter()
const isFavorite = ref(false)
const imageError = ref(false)

// Computed
const hasDiscount = computed(() => {
  return props.product.originalPrice && props.product.originalPrice > props.product.price
})

const productImage = computed(() => {
  if (imageError.value) {
    return 'https://via.placeholder.com/400x400?text=Sin+Imagen'
  }
  const imageUrl = props.product.images?.[0]?.url
  if (!imageUrl) return 'https://via.placeholder.com/400x400?text=Sin+Imagen'
  const UPLOADS_BASE = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')).replace(/\/api\/?$/, '')
  if (imageUrl.startsWith('/uploads')) return `${UPLOADS_BASE}${imageUrl}`
  return imageUrl
})

const categoryName = computed(() => {
  return props.product.category?.name || props.product.categoryName || 'Categoría'
})

const isVirtualOrderProduct = computed(() => {
  return props.product.salesChannel === 'virtual'
})

// Methods
function handleImageError() {
  imageError.value = true
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value
}

function goToProduct() {
  router.push(`/producto/${props.product._id}`)
}

function handleAddToCart() {
  if (isVirtualOrderProduct.value) {
    let size = ''
    if (Array.isArray(props.product.availableSizes) && props.product.availableSizes.length > 0) {
      const sizeLabels = props.product.availableSizes.map(s => (typeof s === 'string' ? s : s.label)).filter(Boolean)
      size = window.prompt(`Selecciona talla (${sizeLabels.join(', ')}):`, sizeLabels[0]) || ''
    }
    openWhatsAppOrder(props.product, { quantity: 1, size })
    return
  }

  if (props.product.stock === 0) return
  emit('add-to-cart', props.product)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>




