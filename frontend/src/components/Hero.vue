<template>
  <section class="relative bg-gradient-to-r from-latino-blue to-blue-600 text-white overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white to-transparent transform rotate-12 scale-150"></div>
    </div>

    <div class="container mx-auto px-4 py-20 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="text-center lg:text-left">
          <h1 class="text-6xl font-bold mb-6 leading-tight">
            Bienvenido a <span class="text-latino-yellow">Super Latino Store</span>
          </h1>
          <p class="text-2xl mb-8 text-blue-100 leading-relaxed">
            Ahorra dinero. Vive mejor. Encuentra todo lo que necesitas en un solo lugar.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <button @click="router.push('/catalogo')" class="bg-latino-yellow text-latino-blue px-8 py-4 rounded-2xl font-bold text-xl hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-2xl">
              🛒 Comprar Ahora
            </button>
            <button @click="router.push('/catalogo?descuento=true')" class="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-white hover:text-latino-blue transition-all duration-300 hover:scale-105 shadow-2xl">
              🔥 Ver Ofertas
            </button>
          </div>

          <!-- Features -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center lg:text-left">
            <div class="flex items-center justify-center lg:justify-start space-x-3">
              <div class="w-12 h-12 bg-latino-yellow rounded-full flex items-center justify-center">
                <span class="text-2xl">🚚</span>
              </div>
              <div>
                <div class="font-bold">Envío Gratis</div>
                <div class="text-sm text-blue-200">Compras +$35</div>
              </div>
            </div>
            <div class="flex items-center justify-center lg:justify-start space-x-3">
              <div class="w-12 h-12 bg-latino-green rounded-full flex items-center justify-center">
                <span class="text-2xl">💳</span>
              </div>
              <div>
                <div class="font-bold">Pago Fácil</div>
                <div class="text-sm text-blue-200">Todas las tarjetas</div>
              </div>
            </div>
            <div class="flex items-center justify-center lg:justify-start space-x-3">
              <div class="w-12 h-12 bg-latino-red rounded-full flex items-center justify-center">
                <span class="text-2xl">⚡</span>
              </div>
              <div>
                <div class="font-bold">Servicios</div>
                <div class="text-sm text-blue-200">Para la familia</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - Carousel -->
        <div class="relative">
          <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h3 class="text-2xl font-bold text-center mb-6 text-latino-yellow">
              🔥 Ofertas del Día
            </h3>

            <!-- Carousel -->
            <div class="relative overflow-hidden rounded-2xl">
              <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                <div v-for="(offer, index) in dailyOffers" :key="index"
                     class="w-full flex-shrink-0 bg-gradient-to-br from-white to-gray-100 p-6 rounded-2xl">
                  <div class="text-center">
                    <div class="text-6xl mb-4">{{ offer.icon }}</div>
                    <h4 class="text-xl font-bold text-gray-900 mb-2">{{ offer.title }}</h4>
                    <p class="text-gray-600 mb-4">{{ offer.description }}</p>
                    <div class="flex items-center justify-center space-x-4 mb-4">
                      <span class="text-3xl font-bold text-latino-red">${{ offer.price }}</span>
                      <span class="text-xl text-gray-400 line-through">${{ offer.originalPrice }}</span>
                      <span class="bg-latino-red text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{{ offer.discount }}%
                      </span>
                    </div>
                    <button @click="router.push('/catalogo')" class="bg-latino-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                      Aprovechar Oferta
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Carousel Indicators -->
            <div class="flex justify-center space-x-2 mt-6">
              <button v-for="(offer, index) in dailyOffers" :key="index"
                      @click="currentSlide = index"
                      :class="[
                        'w-3 h-3 rounded-full transition-all duration-300',
                        currentSlide === index ? 'bg-latino-yellow' : 'bg-white bg-opacity-50'
                      ]">
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentSlide = ref(0)

const dailyOffers = ref([
  {
    title: 'Electrónicos 50% OFF',
    description: 'Laptops, tablets y smartphones con descuentos increíbles',
    price: 299,
    originalPrice: 599,
    discount: 50,
    icon: '💻'
  },
  {
    title: 'Ropa de Temporada',
    description: 'Toda la ropa de invierno con precios especiales',
    price: 19,
    originalPrice: 49,
    discount: 61,
    icon: '👕'
  },
  {
    title: 'Hogar y Jardín',
    description: 'Muebles y decoración para tu hogar',
    price: 99,
    originalPrice: 199,
    discount: 50,
    icon: '🏠'
  }
])

// Auto-rotate carousel
onMounted(() => {
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % dailyOffers.value.length
  }, 5000)
})
</script>
