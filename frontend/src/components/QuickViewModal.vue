<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Overlay -->
      <div
        @click="close"
        class="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
      ></div>

      <!-- Modal Content -->
      <div class="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button
          @click="close"
          class="absolute top-4 right-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
        >
          <span class="text-2xl">×</span>
        </button>

        <!-- Loading -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-latino-blue"></div>
          <p class="mt-4 text-gray-600">Cargando...</p>
        </div>

        <!-- Product Content -->
        <div v-else-if="product" class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Image -->
            <div>
              <div class="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  :src="productImage"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <div v-if="product.discount" class="absolute top-4 left-4 bg-latino-red text-white px-4 py-2 rounded-full font-bold">
                  -{{ product.discount }}% OFF
                </div>
              </div>
            </div>

            <!-- Info -->
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500 uppercase font-semibold mb-1">
                  {{ product.category?.name }}
                </p>
                <h2 class="text-3xl font-bold text-gray-900">{{ product.name }}</h2>
              </div>

              <!-- Rating -->
              <div v-if="product.rating" class="flex items-center gap-2">
                <div class="flex">
                  <span v-for="star in 5" :key="star" class="text-yellow-400 text-xl">
                    {{ star <= Math.round(product.rating.average) ? '⭐' : '☆' }}
                  </span>
                </div>
                <span class="text-gray-600">
                  {{ product.rating.average.toFixed(1) }} ({{ product.rating.count }} reseñas)
                </span>
              </div>

              <!-- Price -->
              <div class="bg-gray-100 rounded-xl p-4">
                <div v-if="hasDiscount" class="flex items-center gap-3">
                  <span class="text-3xl font-bold text-latino-red">
                    ${{ product.price.toFixed(2) }}
                  </span>
                  <span class="text-xl text-gray-400 line-through">
                    ${{ product.originalPrice.toFixed(2) }}
                  </span>
                </div>
                <div v-else>
                  <span class="text-3xl font-bold text-gray-900">
                    ${{ product.price.toFixed(2) }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div>
                <p class="text-gray-700">{{ product.description }}</p>
              </div>

              <!-- Stock -->
              <div class="flex items-center gap-2">
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

              <!-- Actions -->
              <div class="space-y-3 pt-4">
                <button
                  @click="addToCart"
                  :disabled="!isVirtualOrderProduct && product.stock === 0"
                  class="w-full py-4 rounded-xl font-bold text-lg transition shadow-lg"
                  :class="!isVirtualOrderProduct && product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isVirtualOrderProduct
                      ? 'bg-gradient-to-r from-latino-green to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                      : 'bg-gradient-to-r from-latino-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'"
                >
                  <span>{{ isVirtualOrderProduct ? '📲 Comprar ahora' : '🛒 Agregar al Carrito' }}</span>
                </button>

                <button
                  @click="viewFullDetails"
                  class="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition"
                >
                  Ver Detalles Completos →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { openWhatsAppOrder } from '../utils/whatsappOrder'

const props = defineProps({
  isOpen: Boolean,
  productId: String
})

const emit = defineEmits(['close', 'add-to-cart'])

const router = useRouter()
const cartStore = useCartStore()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const UPLOADS_BASE = API_URL.replace(/\/api\/?$/, '')

const product = ref(null)
const loading = ref(false)

const hasDiscount = computed(() => {
  return product.value?.originalPrice && product.value.originalPrice > product.value.price
})

const isVirtualOrderProduct = computed(() => {
  return product.value && product.value.salesChannel === 'virtual'
})

const productImage = computed(() => {
  const url = product.value?.images?.[0]?.url
  if (!url) return 'https://via.placeholder.com/600x600?text=Sin+Imagen'
  if (url.startsWith('/uploads')) return `${UPLOADS_BASE}${url}`
  return url
})

async function fetchProduct() {
  if (!props.productId) return

  loading.value = true
  try {
    const response = await fetch(`${API_URL}/products/${props.productId}`)
    const data = await response.json()

    if (data.success) {
      product.value = data.data
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    loading.value = false
  }
}

function close() {
  emit('close')
}

function addToCart() {
  if (isVirtualOrderProduct.value) {
    let size = ''
    if (Array.isArray(product.value.availableSizes) && product.value.availableSizes.length > 0) {
      const sizeLabels = product.value.availableSizes.map(s => (typeof s === 'string' ? s : s.label)).filter(Boolean)
      size = window.prompt(`Selecciona talla (${sizeLabels.join(', ')}):`, sizeLabels[0]) || ''
    }
    openWhatsAppOrder(product.value, { quantity: 1, size })
    return
  }

  if (product.value && product.value.stock > 0) {
    cartStore.addItem(product.value)
    cartStore.openCart()
    close()
  }
}

function viewFullDetails() {
  router.push(`/producto/${props.productId}`)
  close()
}

// Watch for modal open
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.productId) {
    fetchProduct()
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>


