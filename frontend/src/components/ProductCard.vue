<template>
  <div class="product-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
    <!-- Product Image -->
    <div class="relative overflow-hidden bg-gray-100 aspect-square">
      <img
        :src="productImage"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        @error="handleImageError"
      />

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex flex-col gap-2">
        <span v-if="product.featured" class="badge bg-latino-yellow text-gray-900 font-bold px-3 py-1 rounded-full text-sm">
          ⭐ Destacado
        </span>
        <span v-if="hasDiscount" class="badge bg-latino-red text-white font-bold px-3 py-1 rounded-full text-sm">
          -{{ product.discount }}% OFF
        </span>
        <span v-if="product.stock < 10 && product.stock > 0" class="badge bg-orange-500 text-white font-bold px-3 py-1 rounded-full text-sm">
          ⚠️ Últimas unidades
        </span>
        <span v-if="product.stock === 0" class="badge bg-gray-500 text-white font-bold px-3 py-1 rounded-full text-sm">
          Agotado
        </span>
      </div>

      <!-- Favorite Button -->
      <button
        @click.stop="toggleFavorite"
        class="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition"
      >
        <span class="text-xl">{{ isFavorite ? '❤️' : '🤍' }}</span>
      </button>

      <!-- Quick Actions -->
      <div class="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          @click.stop="quickView"
          class="px-4 py-2 bg-white text-latino-blue font-semibold rounded-lg shadow-lg hover:bg-latino-blue hover:text-white transition"
          title="Vista rápida"
        >
          👁️
        </button>
        <button
          @click.stop="toggleCompare"
          class="px-4 py-2 bg-white font-semibold rounded-lg shadow-lg transition"
          :class="isInCompare ? 'bg-latino-yellow text-gray-900' : 'text-gray-700 hover:bg-gray-100'"
          title="Comparar"
        >
          📊
        </button>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Category -->
      <p class="text-xs text-gray-500 uppercase font-semibold mb-1">
        {{ categoryName }}
      </p>

      <!-- Product Name -->
      <h3
        @click="goToProduct"
        class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-latino-blue transition"
      >
        {{ product.name }}
      </h3>

      <!-- Rating -->
      <div v-if="product.rating" class="flex items-center gap-2 mb-3">
        <div class="flex">
          <span v-for="star in 5" :key="star" class="text-yellow-400">
            {{ star <= Math.round(product.rating.average) ? '⭐' : '☆' }}
          </span>
        </div>
        <span class="text-sm text-gray-600">
          {{ product.rating.average.toFixed(1) }} ({{ product.rating.count }})
        </span>
      </div>

      <!-- Price -->
      <div class="mb-4">
        <div v-if="hasDiscount" class="flex items-center gap-2">
          <span class="text-2xl font-bold text-latino-red">
            ${{ product.price.toFixed(2) }}
          </span>
          <span class="text-lg text-gray-400 line-through">
            ${{ product.originalPrice.toFixed(2) }}
          </span>
        </div>
        <div v-else>
          <span class="text-2xl font-bold text-gray-900">
            ${{ product.price.toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- Stock Indicator -->
      <div class="mb-4">
        <div class="flex items-center gap-2 text-sm">
          <span v-if="product.stock > 10" class="text-green-600 font-semibold">
            ✅ En stock
          </span>
          <span v-else-if="product.stock > 0" class="text-orange-600 font-semibold">
            ⚠️ Solo quedan {{ product.stock }}
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

      <!-- Add to Cart Button -->
      <button
        @click="handleAddToCart"
        :disabled="!isVirtualOrderProduct && product.stock === 0"
        class="w-full py-3 font-bold rounded-lg transition flex items-center justify-center gap-2"
        :class="!isVirtualOrderProduct && product.stock === 0
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : isVirtualOrderProduct
            ? 'bg-latino-green hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-latino-blue hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'"
      >
        <span class="text-xl">{{ isVirtualOrderProduct ? '📲' : '🛒' }}</span>
        <span>{{ isVirtualOrderProduct ? 'Comprar ahora' : (product.stock === 0 ? 'Agotado' : 'Agregar al Carrito') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites'
import { useCompareStore } from '../stores/compare'
import { openWhatsAppOrder } from '../utils/whatsappOrder'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const router = useRouter()
const favoritesStore = useFavoritesStore()
const compareStore = useCompareStore()
const imageError = ref(false)

// Computed para favoritos
const isFavorite = computed(() => {
  return favoritesStore.isFavorite(props.product._id)
})

const isInCompare = computed(() => {
  return compareStore.isInCompare(props.product._id)
})

const isVirtualOrderProduct = computed(() => {
  return props.product.salesChannel === 'virtual'
})

// Computed
const hasDiscount = computed(() => {
  return props.product.originalPrice && props.product.originalPrice > props.product.price
})

const productImage = computed(() => {
  if (imageError.value) {
    return 'https://via.placeholder.com/400x400?text=Sin+Imagen'
  }
  const imageUrl = props.product.images?.[0]?.url
  if (!imageUrl) {
    return 'https://via.placeholder.com/400x400?text=Sin+Imagen'
  }
  // Si la URL es relativa (empieza con /uploads), convertirla a URL absoluta
  const UPLOADS_BASE = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')).replace(/\/api\/?$/, '')
  if (imageUrl.startsWith('/uploads')) {
    return `${UPLOADS_BASE}${imageUrl}`
  }
  // Si ya es una URL completa, usarla tal cual
  return imageUrl
})

const categoryName = computed(() => {
  // TODO: Obtener nombre real de categoría
  return props.product.categoryName || 'Categoría'
})

// Methods
function handleImageError() {
  imageError.value = true
}

function toggleFavorite() {
  favoritesStore.toggleFavorite(props.product)
}

function quickView() {
  emit('quick-view', props.product)
}

function toggleCompare() {
  const result = compareStore.toggleCompare(props.product)
  // TODO: Mostrar notificación toast con el resultado
  console.log(result.message)
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
.product-card {
  @apply transform hover:-translate-y-1;
}

.badge {
  @apply inline-block shadow-lg;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>




