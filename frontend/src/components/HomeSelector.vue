<template>
  <div class="min-h-screen relative overflow-hidden bg-white">
    <!-- Animated Background with Mesh Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <!-- Animated Blobs -->
      <div class="absolute top-0 -left-20 w-96 h-96 bg-latino-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute top-0 -right-20 w-96 h-96 bg-latino-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-20 left-40 w-96 h-96 bg-latino-green rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      <div class="absolute bottom-20 right-40 w-96 h-96 bg-latino-red rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>
    </div>

    <!-- Decorative Grid Pattern -->
    <div class="absolute inset-0" style="background-image: linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px); background-size: 50px 50px;"></div>

    <!-- Main Container -->
    <div class="relative z-10 min-h-screen flex flex-col">
      <!-- Header with Logo -->
      <div class="pt-8 md:pt-12 px-4">
        <div class="max-w-7xl mx-auto text-center">
          <img
            src="/logo-superlatino.png"
            alt="Super Latino Store"
            class="h-16 md:h-20 w-auto mx-auto mb-6 animate-fadeInDown"
          />
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2 animate-fadeInUp">
            ¿Qué estás buscando hoy?
          </h1>
          <p class="text-gray-600 text-sm md:text-base animate-fadeInUp" style="animation-delay: 0.1s">
            Selecciona una opción para comenzar
          </p>
        </div>
      </div>

      <!-- Split Screen Section -->
      <div class="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div class="max-w-7xl w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

            <!-- PRODUCTOS - Left Card -->
            <div
              @click="selectOption('productos')"
              @mouseenter="hoveredCard = 'productos'"
              @mouseleave="hoveredCard = null"
              class="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer overflow-hidden border-2 border-gray-100 hover:border-latino-blue"
              :class="{ 'lg:scale-105': hoveredCard === 'productos' }"
            >
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <!-- Decorative Elements -->
              <div class="absolute top-0 right-0 w-64 h-64 bg-latino-blue rounded-full opacity-5 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
              <div class="absolute bottom-0 left-0 w-48 h-48 bg-blue-600 rounded-full opacity-5 translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>

              <div class="relative p-8 md:p-12">
                <!-- Icon Badge -->
                <div class="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-latino-blue to-blue-600 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <svg class="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>

                <!-- Content -->
                <div class="mb-8">
                  <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 group-hover:text-latino-blue transition-colors duration-300">
                    Productos
                  </h2>
                  <p class="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                    Descubre nuestra amplia selección de productos para tu hogar y familia
                  </p>

                  <!-- Feature Tags -->
                  <div class="flex flex-wrap gap-2 mb-6">
                    <span class="px-4 py-2 bg-blue-100 text-latino-blue rounded-full text-sm font-medium">
                      🏠 Hogar
                    </span>
                    <span class="px-4 py-2 bg-blue-100 text-latino-blue rounded-full text-sm font-medium">
                      👕 Ropa
                    </span>
                    <span class="px-4 py-2 bg-blue-100 text-latino-blue rounded-full text-sm font-medium">
                      📱 Electrónicos
                    </span>
                    <span class="px-4 py-2 bg-blue-100 text-latino-blue rounded-full text-sm font-medium">
                      🛒 Y más...
                    </span>
                  </div>

                  <!-- Stats -->
                  <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-latino-blue">1000+</div>
                      <div class="text-xs text-gray-600">Productos</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-latino-blue">50%</div>
                      <div class="text-xs text-gray-600">Descuentos</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-latino-blue">24/7</div>
                      <div class="text-xs text-gray-600">Disponible</div>
                    </div>
                  </div>
                </div>

                <!-- Action Button -->
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-latino-blue to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <button class="relative w-full bg-gradient-to-r from-latino-blue to-blue-600 text-white py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl group-hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-3">
                    <span>Explorar Productos</span>
                    <svg class="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- SERVICIOS - Right Card -->
            <div
              @click="selectOption('servicios')"
              @mouseenter="hoveredCard = 'servicios'"
              @mouseleave="hoveredCard = null"
              class="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer overflow-hidden border-2 border-gray-100 hover:border-latino-green"
              :class="{ 'lg:scale-105': hoveredCard === 'servicios' }"
            >
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <!-- Decorative Elements -->
              <div class="absolute top-0 right-0 w-64 h-64 bg-latino-green rounded-full opacity-5 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
              <div class="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full opacity-5 translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>

              <div class="relative p-8 md:p-12">
                <!-- Icon Badge -->
                <div class="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-latino-green to-green-600 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <svg class="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>

                <!-- Content -->
                <div class="mb-8">
                  <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 group-hover:text-latino-green transition-colors duration-300">
                    Servicios
                  </h2>
                  <p class="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                    Servicios esenciales para la comunidad latina en Estados Unidos
                  </p>

                  <!-- Feature Tags -->
                  <div class="flex flex-wrap gap-2 mb-6">
                    <span class="px-4 py-2 bg-green-100 text-latino-green rounded-full text-sm font-medium">
                      💰 Transferencias
                    </span>
                    <span class="px-4 py-2 bg-green-100 text-latino-green rounded-full text-sm font-medium">
                      📱 Recargas
                    </span>
                    <span class="px-4 py-2 bg-green-100 text-latino-green rounded-full text-sm font-medium">
                      💳 Pagos
                    </span>
                    <span class="px-4 py-2 bg-green-100 text-latino-green rounded-full text-sm font-medium">
                      🎯 Y más...
                    </span>
                  </div>

                  <!-- Stats -->
                  <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-latino-green">15+</div>
                      <div class="text-xs text-gray-600">Servicios</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-latino-green">Fast</div>
                      <div class="text-xs text-gray-600">Rápido</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-latino-green">Safe</div>
                      <div class="text-xs text-gray-600">Seguro</div>
                    </div>
                  </div>
                </div>

                <!-- Action Button -->
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-latino-green to-green-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <button class="relative w-full bg-gradient-to-r from-latino-green to-green-600 text-white py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl group-hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-3">
                    <span>Ver Servicios</span>
                    <svg class="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="pb-8 px-4">
        <div class="max-w-7xl mx-auto text-center">
          <div class="inline-flex items-center space-x-2 bg-gray-100 px-6 py-3 rounded-full">
            <svg class="w-5 h-5 text-latino-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span class="text-gray-700 font-semibold">¿Necesitas ayuda?</span>
            <a href="tel:+18038886188" class="text-latino-blue font-bold hover:underline">
              (803) 888-6188
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hoveredCard = ref(null)

const selectOption = (option) => {
  if (option === 'productos') {
    router.push('/productos')
  } else if (option === 'servicios') {
    router.push('/servicios')
  }
}
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-6000 {
  animation-delay: 6s;
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fadeInDown {
  animation: fadeInDown 0.8s ease-out forwards;
}
</style>
