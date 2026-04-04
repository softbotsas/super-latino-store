<template>
  <header class="bg-white shadow-xl sticky top-0 z-50">
    <!-- Top Bar - Sliding Panel -->
    <div class="bg-gradient-to-r from-latino-blue to-blue-600 text-white py-2 overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center text-sm">
          <!-- Sliding Panel -->
          <div class="flex-1 flex items-center justify-center">
            <div class="relative w-full max-w-4xl h-8 overflow-hidden">
              <div class="absolute inset-0 flex items-center space-x-8 animate-scroll">
                <div class="flex items-center space-x-2 whitespace-nowrap">
                  <span class="text-latino-yellow font-bold">🔥</span>
                  <span class="font-medium">¡Ofertas increíbles en electrónicos! Hasta 50% OFF</span>
                </div>
                <div class="flex items-center space-x-2 whitespace-nowrap">
                  <span class="text-latino-yellow font-bold">🚚</span>
                  <span class="font-medium">Envío GRATIS en compras mayores a $35</span>
                </div>
                <div class="flex items-center space-x-2 whitespace-nowrap">
                  <span class="text-latino-yellow font-bold">💳</span>
                  <span class="font-medium">Pago fácil con todas las tarjetas</span>
                </div>
                <div class="flex items-center space-x-2 whitespace-nowrap">
                  <span class="text-latino-yellow font-bold">📱</span>
                  <span class="font-medium">Recargas de celular al instante</span>
                </div>
                <div class="flex items-center space-x-2 whitespace-nowrap">
                  <span class="text-latino-yellow font-bold">🏠</span>
                  <span class="font-medium">Todo para tu hogar con los mejores precios</span>
                </div>
                <div class="flex items-center space-x-2 whitespace-nowrap">
                  <span class="text-latino-yellow font-bold">🎉</span>
                  <span class="font-medium">Servicios especiales para la comunidad latina</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="flex space-x-6">
            <a href="https://maps.google.com/?q=10171+Two+Notch+Rd+Suite+A,+Columbia,+SC+29229" target="_blank" rel="noopener noreferrer" class="hover:text-latino-yellow flex items-center space-x-2 transition-all duration-300 hover:scale-105">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="font-medium">📍 10171 Two Notch Rd Suite A, Columbia, SC 29229</span>
            </a>
            <a href="tel:+18038886188" class="hover:text-latino-yellow flex items-center space-x-2 transition-all duration-300 hover:scale-105">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span class="font-medium">📞 (803) 888-6188</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header - Innovative Design -->
    <div class="bg-white py-6">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <!-- Mobile Menu Button -->
          <button @click="$emit('toggleMenu')" class="lg:hidden p-3 rounded-full hover:bg-gray-100 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <!-- Logo Section - Enhanced -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-4 group cursor-pointer">
              <div class="relative">
                <img
                  src="/logo-superlatino.png"
                  alt="Super Latino Store Logo"
                  class="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-latino-yellow rounded-full animate-pulse"></div>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-3xl font-bold bg-gradient-to-r from-latino-blue to-blue-600 bg-clip-text text-transparent leading-tight">
                  <span class="text-latino-red">Super</span> Latino Store
                </h1>
                <p class="text-sm text-gray-600 font-medium">Ahorra dinero. Vive mejor. ✨</p>
              </div>
            </div>
          </div>

          <!-- Mega Search Bar -->
          <div class="hidden md:flex flex-1 max-w-3xl mx-8">
            <form class="relative w-full group" @submit.prevent="doSearch">
              <div class="absolute inset-0 bg-gradient-to-r from-latino-blue to-blue-600 rounded-full blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div class="relative bg-white rounded-full shadow-lg border-2 border-gray-200 hover:border-latino-blue transition-all duration-300 group-hover:shadow-xl">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="¿Qué estás buscando hoy? 🔍"
                  class="w-full px-6 py-4 pr-16 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-lg"
                />
                <button type="submit" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-latino-blue to-blue-600 text-white rounded-full p-3 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-110 shadow-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <!-- Action Buttons - Modern & Clean -->
          <div class="flex items-center space-x-3">
            <!-- Busqueda movil -->
            <button @click="showMobileSearch = !showMobileSearch" class="md:hidden p-3 rounded-full hover:bg-gray-100 transition">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            <!-- Shopping Cart - Beautiful Rounded Design -->
            <button @click="cartStore.toggleCart" class="relative group">
              <div class="bg-gradient-to-r from-latino-blue to-blue-600 rounded-2xl px-5 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 min-w-[140px]">
                <svg class="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                </svg>
                <div class="text-white flex-1">
                  <div class="text-sm font-semibold leading-tight">Carrito</div>
                  <div class="text-xs opacity-90">${{ cartStore.total.toFixed(2) }}</div>
                </div>
                <div v-if="cartStore.itemCount > 0" class="bg-latino-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse flex-shrink-0">
                  {{ cartStore.itemCount }}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Sidebar -->
    <Teleport to="body">
      <Transition name="slide-left">
        <div
          v-if="isMenuOpen"
          class="fixed inset-0 z-50 lg:hidden"
        >
          <!-- Overlay -->
          <div
            @click="$emit('toggleMenu')"
            class="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          ></div>
          
          <!-- Sidebar -->
          <div class="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
          <!-- Header -->
          <div class="bg-gradient-to-r from-latino-blue to-blue-600 text-white p-6 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-bold">Menú</h2>
              <p class="text-blue-100 text-sm">Super Latino Store</p>
            </div>
            <button
              @click="$emit('toggleMenu')"
              class="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition"
            >
              <span class="text-2xl">×</span>
            </button>
          </div>

          <!-- Menu Items -->
          <nav class="p-4 space-y-2">
            <router-link
              to="/productos"
              @click="$emit('toggleMenu')"
              class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <span class="text-2xl">🛍️</span>
              <span class="font-semibold text-gray-700">Productos</span>
            </router-link>
            
            <router-link
              to="/catalogo"
              @click="$emit('toggleMenu')"
              class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <span class="text-2xl">📋</span>
              <span class="font-semibold text-gray-700">Catálogo</span>
            </router-link>

            <router-link
              to="/servicios"
              @click="$emit('toggleMenu')"
              class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <span class="text-2xl">⚡</span>
              <span class="font-semibold text-gray-700">Servicios</span>
            </router-link>

            <div class="border-t border-gray-200 my-4"></div>

            <a
              href="#"
              @click="$emit('toggleMenu')"
              class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <span class="text-2xl">🏪</span>
              <span class="font-semibold text-gray-700">Departamentos</span>
            </a>

            <a
              href="#"
              @click="$emit('toggleMenu')"
              class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <span class="text-2xl">🔥</span>
              <span class="font-semibold text-gray-700">Ofertas</span>
            </a>

            <a
              href="#"
              @click="$emit('toggleMenu')"
              class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <span class="text-2xl">💊</span>
              <span class="font-semibold text-gray-700">Farmacia</span>
            </a>

            <a
              href="#"
              @click="$emit('toggleMenu')"
              class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <span class="text-2xl">📱</span>
              <span class="font-semibold text-gray-700">Electrónicos</span>
            </a>

            <a
              href="#"
              @click="$emit('toggleMenu')"
              class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <span class="text-2xl">👕</span>
              <span class="font-semibold text-gray-700">Ropa</span>
            </a>

            <a
              href="#"
              @click="$emit('toggleMenu')"
              class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <span class="text-2xl">🏠</span>
              <span class="font-semibold text-gray-700">Hogar</span>
            </a>

            <a
              href="#"
              @click="$emit('toggleMenu')"
              class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <span class="text-2xl">🧸</span>
              <span class="font-semibold text-gray-700">Juguetes</span>
            </a>
          </nav>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Navigation - Modern & Dynamic -->
    <nav class="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
      <div class="container mx-auto px-4">
        <div class="hidden lg:flex space-x-1 py-4">
          <a href="/catalogo" class="relative px-4 py-3 rounded-full text-gray-700 hover:text-latino-blue font-medium text-sm transition-all duration-300 hover:bg-white hover:shadow-md group">
            <span class="relative z-10">🏪 Catalogo</span>
            <div class="absolute inset-0 bg-gradient-to-r from-latino-blue to-blue-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </a>
          <a href="/catalogo?onSale=true" class="relative px-4 py-3 rounded-full text-gray-700 hover:text-latino-blue font-medium text-sm transition-all duration-300 hover:bg-white hover:shadow-md group">
            <span class="relative z-10">🔥 Ofertas del Dia</span>
            <div class="absolute inset-0 bg-gradient-to-r from-latino-red to-red-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </a>
          <a
            v-for="department in navDepartments"
            :key="department._id"
            :href="`/catalogo?department=${department._id}`"
            class="relative px-4 py-3 rounded-full text-gray-700 hover:text-latino-blue font-medium text-sm transition-all duration-300 hover:bg-white hover:shadow-md group"
          >
            <span class="relative z-10">{{ department.icon || '🏬' }} {{ department.name }}</span>
            <div class="absolute inset-0 bg-gradient-to-r from-latino-blue to-blue-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </a>
          <a
            v-for="category in navCategories"
            :key="category._id"
            :href="`/catalogo?category=${category._id}`"
            class="relative px-4 py-3 rounded-full text-gray-700 hover:text-latino-blue font-medium text-sm transition-all duration-300 hover:bg-white hover:shadow-md group"
          >
            <span class="relative z-10">📂 {{ category.name }}</span>
            <div class="absolute inset-0 bg-gradient-to-r from-latino-yellow to-yellow-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useRouter, useRoute } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const searchQuery = ref('')
const showMobileSearch = ref(false)

function doSearch() {
  const q = searchQuery.value.trim()
  if (!q) return
  router.push({ name: 'catalogo', query: { search: q } })
  searchQuery.value = ''
}

const navDepartments = ref([])
const navCategories = ref([])

defineProps({
  isMenuOpen: Boolean
})

defineEmits(['toggleMenu'])

async function loadNavigationData() {
  try {
    const [deptRes, catRes] = await Promise.all([
      fetch(`${API_URL}/departments?isActive=true`),
      fetch(`${API_URL}/categories?isActive=true`)
    ])

    const deptData = await deptRes.json()
    const catData = await catRes.json()

    if (deptData.success) {
      navDepartments.value = (deptData.data || []).slice(0, 4)
    }

    if (catData.success) {
      navCategories.value = (catData.data || []).slice(0, 4)
    }
  } catch (error) {
    console.error('Error loading navigation data:', error)
  }
}

onMounted(loadNavigationData)
</script>

<style scoped>
/* Slide left animation for mobile menu */
.slide-left-enter-active {
  transition: opacity 0.3s ease;
}

.slide-left-enter-active .absolute.left-0 {
  transition: transform 0.3s ease;
}

.slide-left-leave-active {
  transition: opacity 0.3s ease;
}

.slide-left-leave-active .absolute.left-0 {
  transition: transform 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
}

.slide-left-enter-from .absolute.left-0 {
  transform: translateX(-100%);
}

.slide-left-enter-to {
  opacity: 1;
}

.slide-left-enter-to .absolute.left-0 {
  transform: translateX(0);
}

.slide-left-leave-from {
  opacity: 1;
}

.slide-left-leave-from .absolute.left-0 {
  transform: translateX(0);
}

.slide-left-leave-to {
  opacity: 0;
}

.slide-left-leave-to .absolute.left-0 {
  transform: translateX(-100%);
}
</style>
