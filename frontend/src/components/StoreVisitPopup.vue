<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <!-- Modal -->
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="closePopup"
            class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition"
          >
            ✕
          </button>

          <!-- Image Gallery or Placeholder -->
          <div class="relative h-64 bg-gradient-to-br from-latino-green to-green-600 overflow-hidden">
            <div
              v-if="images.length > 0"
              class="flex transition-transform duration-500"
              :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
            >
              <div v-for="(img, idx) in images" :key="idx" class="w-full h-64 flex-shrink-0">
                <img
                  :src="img"
                  :alt="`Tienda ${idx + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="text-center text-white">
                <span class="text-6xl">🏪</span>
                <p class="mt-2 font-semibold">Tienda Física</p>
              </div>
            </div>

            <!-- Image Navigation (si hay múltiples imágenes) -->
            <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <button
                v-for="(_, idx) in images"
                :key="idx"
                @click="currentImageIndex = idx"
                :class="[
                  'w-3 h-3 rounded-full transition',
                  currentImageIndex === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                ]"
                :aria-label="`Imagen ${idx + 1}`"
              />
            </div>
          </div>

          <!-- Content -->
          <div class="p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">
              ¡Visítanos Ahora!
            </h2>
            <p class="text-gray-600 mb-6 leading-relaxed">
              Descubre nuestra tienda física y vive la experiencia Super Latino Store en persona. 
              Nuestro equipo está listo para ayudarte.
            </p>

            <!-- Store Info -->
            <div class="space-y-3 mb-6 text-sm">
              <div class="flex items-center gap-3">
                <span class="text-2xl">📍</span>
                <div>
                  <p class="font-semibold text-gray-900">Ubicación</p>
                  <p class="text-gray-600">10171 Two Notch Rd Suite A, Columbia, SC 29229</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">⏰</span>
                <div>
                  <p class="font-semibold text-gray-900">Horario</p>
                  <p class="text-gray-600">De 9am a 9pm todos los días.</p>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <button
              @click="contactWhatsApp"
              class="w-full py-4 bg-gradient-to-r from-latino-green to-green-600 hover:from-green-700 hover:to-green-700 text-white font-bold rounded-xl transition shadow-lg"
            >
              📲 Contáctanos por WhatsApp
            </button>

            <!-- Close Button (Alternative) -->
            <button
              @click="closePopup"
              class="w-full mt-3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const currentImageIndex = ref(0)
const images = ref([])
const POPUP_KEY = 'storeVisitPopupShown'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 horas

// Props para customizar el comportamiento
defineProps({
  showOnce: {
    type: Boolean,
    default: true
  }
})

onMounted(async () => {
  // Cargar imágenes disponibles
  await loadImages()

  // Mostrar popup siempre que se monta el componente
  openPopup()
})

async function loadImages() {
  // Intentar cargar imágenes de public/tienda
  // Las imágenes deben nombradas como: tienda-1.jpeg, tienda-2.jpeg, etc.
  const imageCount = 10 // Cambia este número según cuántas imágenes tengas
  const loadedImages = []

  for (let i = 1; i <= imageCount; i++) {
    const imagePath = `/tienda/tienda-${i}.jpeg`
    try {
      // Intenta cargar cada imagen
      const response = await fetch(imagePath, { method: 'HEAD' })
      if (response.ok) {
        loadedImages.push(imagePath)
      }
    } catch (err) {
      // Imagen no encontrada, continúa
    }
  }

  images.value = loadedImages
}

function shouldShowPopup() {
  const stored = sessionStorage.getItem(POPUP_KEY)
  if (!stored) return true

  const timestamp = parseInt(stored)
  const now = Date.now()

  // Mostrar solo si pasaron más de 24 horas
  return now - timestamp > SESSION_DURATION
}

function openPopup() {
  isOpen.value = true
  sessionStorage.setItem(POPUP_KEY, Date.now().toString())
}

function closePopup() {
  isOpen.value = false
}

function contactWhatsApp() {
  const message = encodeURIComponent('Hola, me gustaría visitarlos. ¿Cuál es su ubicación y horario?')
  window.open(`https://wa.me/18038886188?text=${message}`, '_blank')
  closePopup()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-in {
  animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideIn {
  from {
    transform: scale(0.95) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>
