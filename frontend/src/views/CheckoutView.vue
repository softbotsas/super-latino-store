<template>
  <div class="min-h-screen bg-gray-50">
    <Header :is-menu-open="isMenuOpen" @toggle-menu="isMenuOpen = !isMenuOpen" />

    <div class="max-w-7xl mx-auto px-4 py-12">
      <nav class="flex items-center space-x-2 text-sm mb-8">
        <router-link to="/" class="text-gray-600 hover:text-latino-blue">Inicio</router-link>
        <span class="text-gray-400">/</span>
        <router-link to="/catalogo" class="text-gray-600 hover:text-latino-blue">Productos</router-link>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900 font-semibold">Checkout</span>
      </nav>

      <h1 class="text-4xl font-bold mb-8">Finalizar Compra</h1>

      <div v-if="receipt" class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-emerald-200">
        <div class="text-center border-b border-gray-200 pb-6 mb-6">
          <p class="text-sm uppercase tracking-[0.18em] text-emerald-700 font-bold">Recibo de Pedido</p>
          <h2 class="text-3xl font-black text-gray-900 mt-2">Pedido #{{ receipt.orderNumber }}</h2>
          <p class="text-gray-600 mt-2">Guarda este numero y muestralo al recoger en tienda.</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 text-sm mb-6">
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-gray-500 mb-1">Cliente</p>
            <p class="font-bold text-gray-900">{{ receipt.customer.fullName }}</p>
            <p class="text-gray-700">{{ receipt.customer.email }}</p>
            <p class="text-gray-700">{{ receipt.customer.phone }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-gray-500 mb-1">Metodo de pago</p>
            <p class="font-bold text-gray-900">Recoger en tienda</p>
            <p class="text-gray-700">Fecha: {{ formatDate(receipt.createdAt) }}</p>
            <p class="text-gray-700">Estado: {{ receipt.status }}</p>
          </div>
        </div>

        <div class="border border-gray-200 rounded-xl overflow-hidden">
          <div class="bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">Productos del pedido</div>
          <div class="divide-y divide-gray-200">
            <div v-for="item in receipt.items" :key="`${item.product}-${item.name}`" class="px-4 py-3 flex justify-between gap-3 text-sm">
              <div>
                <p class="font-semibold text-gray-900">{{ item.name }}</p>
                <p class="text-gray-500">Cantidad: {{ item.quantity }}</p>
              </div>
              <p class="font-bold text-gray-900">${{ Number(item.subtotal).toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="mt-6 space-y-2 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${{ Number(receipt.subtotal).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Impuestos (8%)</span>
            <span>${{ Number(receipt.tax).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-xl font-black text-gray-900 border-t border-gray-200 pt-3">
            <span>Total</span>
            <span>${{ Number(receipt.total).toFixed(2) }}</span>
          </div>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <button @click="printReceipt" class="flex-1 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50 transition">
            Imprimir recibo
          </button>
          <button @click="router.push('/productos')" class="flex-1 py-3 rounded-xl bg-latino-blue text-white font-semibold hover:bg-blue-700 transition">
            Volver a productos
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>🧾</span>
              <span>Datos del Cliente</span>
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre completo *</label>
                <input
                  v-model="checkout.fullName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue focus:border-transparent"
                  placeholder="Juan Perez"
                />
              </div>
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
                <label class="block text-sm font-semibold text-gray-700 mb-2">Telefono *</label>
                <input
                  v-model="checkout.phone"
                  type="tel"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue focus:border-transparent"
                  placeholder="(803) 888-6188"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nota del pedido (opcional)</label>
                <textarea
                  v-model="checkout.notes"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-latino-blue focus:border-transparent"
                  placeholder="Ejemplo: Lo recojo manana despues de las 5pm"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-8 border border-emerald-200">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🏪</span>
              <span>Metodo de Pago</span>
            </h2>
            <div class="rounded-xl bg-emerald-50 border border-emerald-200 p-5">
              <p class="font-bold text-emerald-800">Recoger en tienda</p>
              <p class="text-sm text-emerald-700 mt-1">Por ahora este es el unico metodo disponible. Al confirmar tu pedido, recibiras un numero unico de 6 digitos para presentarlo al retirar.</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-8 sticky top-4">
            <h2 class="text-2xl font-bold mb-6">Resumen del Pedido</h2>

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
                <span>Impuestos (8%)</span>
                <span>${{ cartStore.tax.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t border-gray-300">
                <span>Total</span>
                <span>${{ cartStore.total.toFixed(2) }}</span>
              </div>
            </div>

            <button
              @click="placeOrder"
              :disabled="!isFormValid || processing"
              class="w-full mt-6 py-4 rounded-xl font-bold text-lg transition shadow-xl"
              :class="isFormValid && !processing
                ? 'bg-gradient-to-r from-latino-green to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
            >
              {{ processing ? 'Procesando pedido...' : 'Confirmar pedido' }}
            </button>

            <p v-if="errorMessage" class="mt-4 text-sm text-rose-600 font-semibold">{{ errorMessage }}</p>
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const router = useRouter()
const cartStore = useCartStore()

const isMenuOpen = ref(false)
const processing = ref(false)
const errorMessage = ref('')
const receipt = ref(null)

const checkout = ref({
  email: '',
  phone: '',
  fullName: '',
  notes: ''
})

const isFormValid = computed(() => {
  return checkout.value.email &&
    checkout.value.phone &&
    checkout.value.fullName &&
    cartStore.items.length > 0
})

function getImageUrl(url) {
  if (!url) return 'https://via.placeholder.com/100x100?text=Sin+Imagen'
  if (url.startsWith('/uploads')) return `http://localhost:5000${url}`
  return url
}

function formatDate(value) {
  return new Date(value).toLocaleString('es-DO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

function printReceipt() {
  window.print()
}

async function placeOrder() {
  if (!isFormValid.value) return

  processing.value = true
  errorMessage.value = ''

  try {
    const payload = {
      customer: {
        fullName: checkout.value.fullName,
        email: checkout.value.email,
        phone: checkout.value.phone
      },
      paymentMethod: 'pickup-store',
      notes: checkout.value.notes,
      items: cartStore.items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity
      }))
    }

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'No se pudo registrar el pedido')
    }

    receipt.value = data.data
    cartStore.clearCart()
  } catch (error) {
    console.error('Error creando pedido:', error)
    errorMessage.value = error.message || 'Error al confirmar pedido'
  } finally {
    processing.value = false
  }
}
</script>

<style scoped>
@media print {
  header,
  footer,
  button {
    display: none !important;
  }
}
</style>


