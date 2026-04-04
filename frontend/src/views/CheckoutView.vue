<template>
  <div class="min-h-screen bg-gray-50">
    <Header :is-menu-open="isMenuOpen" @toggle-menu="isMenuOpen = !isMenuOpen" />

    <!-- Checkout Content -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Breadcrumbs -->
      <nav class="flex items-center space-x-2 text-sm mb-8">
        <router-link to="/" class="text-gray-600 hover:text-latino-blue">Inicio</router-link>
        <span class="text-gray-400">/</span>
        <router-link to="/catalogo" class="text-gray-600 hover:text-latino-blue">Productos</router-link>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900 font-semibold">Checkout</span>
      </nav>

      <h1 class="text-4xl font-bold mb-8">Finalizar Compra</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Forms -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Contact Info -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>📧</span>
              <span>Información de Contacto</span>
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  v-model="checkout.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
                <input
                  v-model="checkout.phone"
                  type="tel"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>🚚</span>
              <span>Dirección de Envío</span>
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
                <input
                  v-model="checkout.fullName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue focus:border-transparent"
                  placeholder="Juan Pérez"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Dirección *</label>
                <input
                  v-model="checkout.address"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue focus:border-transparent"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Ciudad *</label>
                <input
                  v-model="checkout.city"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue focus:border-transparent"
                  placeholder="Miami"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Estado *</label>
                <select
                  v-model="checkout.state"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue focus:border-transparent"
                >
                  <option value="">Selecciona un estado</option>
                  <option value="FL">Florida</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="NY">New York</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Código Postal *</label>
                <input
                  v-model="checkout.zipCode"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue focus:border-transparent"
                  placeholder="33101"
                />
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>💳</span>
              <span>Método de Pago</span>
            </h2>
            <div class="space-y-4">
              <label class="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-latino-blue transition">
                <input v-model="checkout.paymentMethod" type="radio" value="credit-card" class="w-5 h-5" />
                <div class="flex items-center gap-3">
                  <span class="text-2xl">💳</span>
                  <div>
                    <p class="font-semibold">Tarjeta de Crédito/Débito</p>
                    <p class="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                  </div>
                </div>
              </label>

              <label class="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-latino-blue transition">
                <input v-model="checkout.paymentMethod" type="radio" value="paypal" class="w-5 h-5" />
                <div class="flex items-center gap-3">
                  <span class="text-2xl">💰</span>
                  <div>
                    <p class="font-semibold">PayPal</p>
                    <p class="text-sm text-gray-500">Pago seguro con tu cuenta PayPal</p>
                  </div>
                </div>
              </label>

              <label class="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-latino-blue transition">
                <input v-model="checkout.paymentMethod" type="radio" value="cash" class="w-5 h-5" />
                <div class="flex items-center gap-3">
                  <span class="text-2xl">💵</span>
                  <div>
                    <p class="font-semibold">Efectivo</p>
                    <p class="text-sm text-gray-500">Pago en tienda física</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Right Column - Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-8 sticky top-4">
            <h2 class="text-2xl font-bold mb-6">Resumen del Pedido</h2>

            <!-- Items -->
            <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
              <div
                v-for="item in cartStore.items"
                :key="item.product._id"
                class="flex items-center gap-3 text-sm"
              >
                <img
                  :src="getImageUrl(item.product.images?.[0]?.url)"
                  :alt="item.product.name"
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-800 truncate">{{ item.product.name }}</p>
                  <p class="text-gray-500">Cantidad: {{ item.quantity }}</p>
                </div>
                <p class="font-bold text-gray-900">${{ (item.product.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t border-gray-200 pt-4 space-y-3">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${{ cartStore.subtotal.toFixed(2) }}</span>
              </div>

              <div v-if="cartStore.savings > 0" class="flex justify-between text-green-600 font-semibold">
                <span>Ahorros</span>
                <span>-${{ cartStore.savings.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>{{ shipping > 0 ? `$${shipping.toFixed(2)}` : 'GRATIS' }}</span>
              </div>

              <div class="flex justify-between text-gray-600">
                <span>Impuestos (8%)</span>
                <span>${{ cartStore.tax.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t border-gray-300">
                <span>Total</span>
                <span>${{ finalTotal.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Place Order Button -->
            <button
              @click="placeOrder"
              :disabled="!isFormValid || processing"
              class="w-full mt-6 py-4 rounded-xl font-bold text-lg transition shadow-xl"
              :class="isFormValid && !processing
                ? 'bg-gradient-to-r from-latino-green to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
            >
              {{ processing ? '⏳ Procesando...' : '🎉 Realizar Pedido' }}
            </button>

            <!-- Security Info -->
            <div class="mt-4 p-4 bg-blue-50 rounded-lg">
              <p class="text-xs text-gray-600 flex items-center gap-2">
                <span>🔒</span>
                <span>Pago 100% seguro y encriptado</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const cartStore = useCartStore()

// Mobile Menu
const isMenuOpen = ref(false)

const checkout = ref({
  email: '',
  phone: '',
  fullName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  paymentMethod: 'credit-card'
})

const processing = ref(false)

const shipping = computed(() => {
  return cartStore.subtotal >= 35 ? 0 : 9.99
})

const finalTotal = computed(() => {
  return cartStore.total + shipping.value
})

const isFormValid = computed(() => {
  return checkout.value.email &&
    checkout.value.phone &&
    checkout.value.fullName &&
    checkout.value.address &&
    checkout.value.city &&
    checkout.value.state &&
    checkout.value.zipCode &&
    checkout.value.paymentMethod &&
    cartStore.items.length > 0
})

function getImageUrl(url) {
  if (!url) return 'https://via.placeholder.com/100x100?text=Sin+Imagen'
  if (url.startsWith('/uploads')) return `http://localhost:5000${url}`
  return url
}

async function placeOrder() {
  if (!isFormValid.value) return

  processing.value = true

  // Simular proceso de pago
  setTimeout(() => {
    alert('¡Pedido realizado con éxito! 🎉\n\nRecibirás un email de confirmación pronto.')
    cartStore.clearCart()
    router.push('/')
    processing.value = false
  }, 2000)
}
</script>

<style scoped>
</style>


