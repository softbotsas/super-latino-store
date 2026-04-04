<template>
  <!-- Cart Overlay -->
  <Transition name="fade">
    <div
      v-if="cartStore.isCartOpen"
      @click="cartStore.closeCart"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>
  </Transition>

  <!-- Cart Panel -->
  <Transition name="slide">
    <div
      v-if="cartStore.isCartOpen"
      class="fixed top-0 right-0 h-full w-full sm:w-96 lg:w-[500px] bg-white shadow-2xl z-50 flex flex-col"
    >
      <!-- Cart Header -->
      <div class="bg-latino-blue text-white p-6 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold">🛒 Mi Carrito</h2>
          <p class="text-blue-100 text-sm">{{ cartStore.itemCount }} productos</p>
        </div>
        <button
          @click="cartStore.closeCart"
          class="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition"
        >
          <span class="text-2xl">×</span>
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Empty Cart -->
        <div v-if="cartStore.items.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🛒</div>
          <h3 class="text-xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h3>
          <p class="text-gray-500 mb-6">¡Agrega productos para comenzar tu compra!</p>
          <button
            @click="cartStore.closeCart"
            class="px-6 py-3 bg-latino-blue hover:bg-blue-700 text-white font-bold rounded-lg transition"
          >
            Ir de Compras
          </button>
        </div>

        <!-- Cart Items List -->
        <div v-else class="space-y-4">
          <TransitionGroup name="list">
            <div
              v-for="item in cartStore.items"
              :key="item.product._id"
              class="bg-gray-50 rounded-lg p-4 flex gap-4 relative"
            >
              <!-- Remove Button -->
              <button
                @click="removeItem(item.product._id)"
                class="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition"
                title="Eliminar"
              >
                ×
              </button>

              <!-- Product Image -->
              <div class="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                <img
                  :src="item.product.images?.[0]?.url || 'https://via.placeholder.com/100'"
                  :alt="item.product.name"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 pr-8">
                  {{ item.product.name }}
                </h4>

                <!-- Price -->
                <div class="mb-2">
                  <span class="text-lg font-bold text-latino-blue">
                    ${{ item.product.price.toFixed(2) }}
                  </span>
                  <span v-if="item.product.originalPrice" class="text-sm text-gray-400 line-through ml-2">
                    ${{ item.product.originalPrice.toFixed(2) }}
                  </span>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center gap-2">
                  <button
                    @click="decreaseQuantity(item)"
                    class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center font-bold transition"
                    :disabled="item.quantity <= 1"
                  >
                    −
                  </button>

                  <input
                    v-model.number="item.quantity"
                    @change="updateQuantity(item)"
                    type="number"
                    min="1"
                    :max="item.product.stock"
                    class="w-14 text-center py-1 border border-gray-300 rounded-lg"
                  />

                  <button
                    @click="increaseQuantity(item)"
                    class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center font-bold transition"
                    :disabled="item.quantity >= item.product.stock"
                  >
                    +
                  </button>

                  <span class="text-xs text-gray-500 ml-2">
                    ({{ item.product.stock }} disponibles)
                  </span>
                </div>

                <!-- Subtotal -->
                <div class="mt-2 text-right">
                  <span class="text-sm text-gray-600">Subtotal: </span>
                  <span class="text-lg font-bold text-gray-800">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Cart Footer -->
      <div v-if="cartStore.items.length > 0" class="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
        <!-- Summary -->
        <div class="space-y-2">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>${{ cartStore.subtotal.toFixed(2) }}</span>
          </div>

          <div v-if="cartStore.savings > 0" class="flex justify-between text-green-600 font-semibold">
            <span>Ahorros:</span>
            <span>-${{ cartStore.savings.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between text-gray-600">
            <span>Impuestos (8%):</span>
            <span>${{ cartStore.tax.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between text-2xl font-bold text-gray-900 pt-2 border-t border-gray-300">
            <span>Total:</span>
            <span>${{ cartStore.total.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2">
          <button
            @click="proceedToCheckout"
            class="w-full py-4 bg-latino-green hover:bg-green-700 text-white font-bold rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <span class="text-xl">💳</span>
            <span>Proceder al Pago</span>
          </button>

          <button
            @click="cartStore.closeCart"
            class="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

function removeItem(productId) {
  if (confirm('¿Eliminar este producto del carrito?')) {
    cartStore.removeItem(productId)
  }
}

function updateQuantity(item) {
  const result = cartStore.updateQuantity(item.product._id, item.quantity)
  if (!result.success) {
    alert(result.message)
  }
}

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.product._id, item.quantity - 1)
  }
}

function increaseQuantity(item) {
  const result = cartStore.updateQuantity(item.product._id, item.quantity + 1)
  if (!result.success) {
    alert(result.message)
  }
}

function proceedToCheckout() {
  cartStore.closeCart()
  router.push('/checkout')
}
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* List transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.3s;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hide number input arrows in Chrome/Safari */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Hide number input arrows in Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>




