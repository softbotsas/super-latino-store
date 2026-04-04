<template>
  <!-- Overlay -->
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <!-- Popup Container -->
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden animate-popup">
      <!-- Close Button -->
      <button @click="closePopup" class="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Header with Gradient -->
      <div class="bg-gradient-to-r from-latino-blue to-blue-600 text-white p-8 text-center relative">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white to-transparent transform rotate-12 scale-150"></div>
        </div>

        <div class="relative z-10">
          <!-- Logo -->
          <div class="flex items-center justify-center space-x-3 mb-4">
            <img
              src="/logo-superlatino.png"
              alt="Super Latino Store Logo"
              class="h-12 w-auto object-contain"
            />
            <h2 class="text-2xl font-bold">
              <span class="text-latino-yellow">Super</span> Latino Store
            </h2>
          </div>

          <!-- Welcome Message -->
          <h3 class="text-3xl font-bold mb-2">¡Bienvenido!</h3>
          <p class="text-blue-100 text-lg">Tu tienda de confianza te da la bienvenida</p>
        </div>
      </div>

      <!-- Content -->
      <div class="p-8">
        <!-- Special Offer -->
        <div class="bg-gradient-to-r from-latino-red to-red-500 text-white rounded-2xl p-6 mb-6 text-center">
          <div class="text-4xl mb-3">🎉</div>
          <h4 class="text-2xl font-bold mb-2">¡Oferta Especial!</h4>
          <p class="text-red-100 mb-4">Por ser nuevo cliente, obtén un descuento especial</p>
          <div class="text-4xl font-bold text-latino-yellow mb-2">20% OFF</div>
          <p class="text-sm text-red-100">En tu primera compra</p>
        </div>

        <!-- Features -->
        <div class="space-y-4 mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-latino-green rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-gray-900">Envío GRATIS</div>
              <div class="text-sm text-gray-600">En compras mayores a $35</div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-latino-blue rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-gray-900">Pago Seguro</div>
              <div class="text-sm text-gray-600">Todas las tarjetas aceptadas</div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-latino-yellow rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-latino-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-gray-900">Servicios Especiales</div>
              <div class="text-sm text-gray-600">Para la comunidad latina</div>
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="space-y-3">
          <button @click="claimOffer" class="w-full bg-gradient-to-r from-latino-blue to-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg">
            🎁 Reclamar Oferta
          </button>
          <button @click="closePopup" class="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-2xl font-semibold hover:border-latino-blue hover:text-latino-blue transition-all duration-300">
            Continuar sin oferta
          </button>
        </div>

        <!-- Footer -->
        <div class="text-center mt-6">
          <p class="text-sm text-gray-500">
            Al continuar, aceptas nuestros
            <a href="#" class="text-latino-blue hover:underline">términos y condiciones</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

const closePopup = () => {
  isVisible.value = false
  // Guardar en localStorage que ya vio el popup
  localStorage.setItem('welcomePopupSeen', 'true')
}

const claimOffer = () => {
  // Aquí podrías redirigir a una página de registro o aplicar el descuento
  alert('¡Oferta reclamada! Serás redirigido al registro.')
  closePopup()
}

// Mostrar popup solo si no se ha visto antes
onMounted(() => {
  const hasSeenPopup = localStorage.getItem('welcomePopupSeen')
  if (!hasSeenPopup) {
    // Mostrar popup después de 1 segundo
    setTimeout(() => {
      isVisible.value = true
    }, 1000)
  }
})
</script>

<style scoped>
@keyframes popup {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-popup {
  animation: popup 0.3s ease-out;
}
</style>



