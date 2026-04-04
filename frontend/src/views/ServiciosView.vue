<template>
  <div class="min-h-screen bg-slate-50">
    <Header :is-menu-open="isMenuOpen" @toggle-menu="isMenuOpen = !isMenuOpen" />

    <section class="relative overflow-hidden bg-[linear-gradient(120deg,#064e3b_0%,#0f766e_45%,#0f172a_100%)] text-white">
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="relative max-w-7xl mx-auto px-4 py-14 md:py-20" data-reveal>
        <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/25 text-sm font-semibold">
          <span class="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          Servicios pensados para tu día a día
        </p>

        <div class="mt-5 grid lg:grid-cols-12 gap-8 items-end">
          <div class="lg:col-span-8" data-reveal>
            <h1 class="text-4xl md:text-6xl font-black leading-tight tracking-tight">
              Soluciones útiles para tu comunidad,
              <span class="text-emerald-300">rápidas, claras y confiables</span>
            </h1>
            <p class="mt-5 text-teal-100 text-lg max-w-3xl">
              Transferencias, pagos, recargas y servicios esenciales en un solo lugar.
              Elige el que necesitas y contáctanos de inmediato.
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <RouterLink to="/productos" class="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition">
                Volver a productos
              </RouterLink>
              <RouterLink to="/catalogo" class="px-6 py-3 rounded-xl bg-emerald-400 text-slate-900 font-bold hover:bg-emerald-300 transition">
                Explorar catálogo
              </RouterLink>
            </div>
          </div>

          <div class="lg:col-span-4 grid grid-cols-2 gap-3" data-reveal>
            <div class="rounded-xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
              <p class="text-xs uppercase tracking-[0.18em] text-teal-100">Servicios</p>
              <p class="text-3xl font-black mt-1">{{ serviceStats.total }}</p>
            </div>
            <div class="rounded-xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
              <p class="text-xs uppercase tracking-[0.18em] text-teal-100">Destacados</p>
              <p class="text-3xl font-black mt-1">{{ serviceStats.featured }}</p>
            </div>
            <div class="rounded-xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
              <p class="text-xs uppercase tracking-[0.18em] text-teal-100">Categorías</p>
              <p class="text-3xl font-black mt-1">{{ serviceStats.categories }}</p>
            </div>
            <div class="rounded-xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
              <p class="text-xs uppercase tracking-[0.18em] text-teal-100">Atención directa</p>
              <p class="text-3xl font-black mt-1">2</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <section class="flex flex-wrap gap-3 items-center" data-reveal>
        <button
          @click="activeCategory = ''"
          :class="activeCategory === '' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700'"
          class="px-4 py-2 rounded-full font-semibold transition"
        >
          Todas las categorías
        </button>

        <button
          v-for="category in serviceCategories"
          :key="category._id"
          @click="activeCategory = category.slug"
          :class="activeCategory === category.slug ? 'bg-teal-700 text-white' : 'bg-white border border-slate-200 text-slate-700'"
          class="px-4 py-2 rounded-full font-semibold transition"
        >
          {{ category.icon || '⚡' }} {{ category.name }}
        </button>
      </section>

      <section data-reveal>
        <div class="flex items-end justify-between mb-5">
          <div>
            <h2 class="text-3xl font-black text-slate-900">Servicios destacados</h2>
            <p class="text-slate-500">Los más solicitados por nuestros clientes</p>
          </div>
        </div>

        <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="i in 3" :key="i" class="h-64 rounded-2xl bg-slate-200/70 animate-pulse"></div>
        </div>

        <div v-else-if="filteredFeaturedServices.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <article
            v-for="(service, index) in filteredFeaturedServices"
            :key="service._id"
            class="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white p-5 shadow-sm hover:shadow-lg transition reveal-card"
            :style="{ animationDelay: `${index * 80}ms` }"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="w-12 h-12 rounded-xl bg-emerald-100 text-2xl grid place-content-center">
                {{ categoryIcon(service.category) }}
              </div>
              <span class="px-2 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">Destacado</span>
            </div>

            <div class="mt-4 h-44 rounded-2xl overflow-hidden bg-white border border-emerald-100">
              <img
                v-if="service.image?.url"
                :src="resolveImageUrl(service.image.url)"
                :alt="service.image.alt || service.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-5xl text-emerald-700">
                {{ categoryIcon(service.category) }}
              </div>
            </div>

            <h3 class="mt-4 text-xl font-black text-slate-900 line-clamp-2">{{ service.name }}</h3>
            <p class="text-sm text-slate-600 mt-2 line-clamp-3 min-h-[4rem]">{{ service.description }}</p>

            <div class="mt-4 flex items-center justify-between text-sm">
              <span class="text-slate-500">{{ categoryLabel(service.category) }}</span>
              <span class="font-semibold text-emerald-700">Atención personalizada</span>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                :href="serviceWhatsappLink(service)"
                target="_blank"
                rel="noopener"
                class="inline-flex w-full justify-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
              >
                Más información por WhatsApp
              </a>
              <a
                :href="STORE_MAPS_URL"
                target="_blank"
                rel="noopener"
                class="inline-flex w-full justify-center px-4 py-2 rounded-lg border border-emerald-200 bg-white text-emerald-700 font-bold hover:bg-emerald-50 transition"
              >
                Cómo llegar
              </a>
            </div>
          </article>
        </div>

        <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No hay servicios destacados disponibles por ahora.
        </div>
      </section>

      <section data-reveal>
        <div class="flex items-end justify-between mb-5">
          <div>
            <h2 class="text-3xl font-black text-slate-900">Todos nuestros servicios</h2>
            <p class="text-slate-500">Elige el servicio que necesitas y te ayudamos al instante</p>
          </div>
        </div>

        <div v-if="filteredServices.length" class="grid md:grid-cols-2 gap-5">
          <article
            v-for="(service, index) in filteredServices"
            :key="service._id"
            class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-lg transition reveal-card"
            :style="{ animationDelay: `${index * 40}ms` }"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-3 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-slate-100 grid place-content-center text-2xl shrink-0">{{ categoryIcon(service.category) }}</div>
                <div class="min-w-0">
                  <h3 class="font-extrabold text-slate-900 text-xl line-clamp-2">{{ service.name }}</h3>
                  <p class="text-sm text-slate-500 mt-1">{{ categoryLabel(service.category) }}</p>
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm text-slate-500">Atención</p>
                <p class="text-lg font-black text-teal-700">Directa</p>
              </div>
            </div>

            <div class="mt-4 h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                v-if="service.image?.url"
                :src="resolveImageUrl(service.image.url)"
                :alt="service.image.alt || service.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-5xl text-slate-600">
                {{ categoryIcon(service.category) }}
              </div>
            </div>

            <p class="mt-3 text-slate-600">{{ service.description }}</p>

            <ul v-if="service.requirements?.length" class="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
              <li v-for="(req, i) in service.requirements.slice(0, 4)" :key="`${service._id}-req-${i}`" class="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
                {{ req }}
              </li>
            </ul>

            <div class="mt-4 flex flex-wrap gap-2">
              <a :href="serviceWhatsappLink(service)" target="_blank" rel="noopener" class="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition">
                Más información por WhatsApp
              </a>
              <a :href="STORE_MAPS_URL" target="_blank" rel="noopener" class="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 transition">
                Cómo llegar
              </a>
            </div>
          </article>
        </div>

        <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No hay servicios disponibles para la categoría seleccionada.
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useToast } from '../composables/useToast'

const toast = useToast()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || '18038886188'
const STORE_MAPS_URL = 'https://maps.google.com/?q=10171+Two+Notch+Rd+Suite+A,+Columbia,+SC+29229'
const API_BASE = API_URL.replace('/api', '')

const loading = ref(true)
const isMenuOpen = ref(false)
const services = ref([])
const categories = ref([])
const activeCategory = ref('')
let revealObserver = null

const serviceCategories = computed(() => categories.value.filter((category) => {
  if (!category?.slug) return false
  return services.value.some((service) => service.category === category.slug)
}))

const filteredServices = computed(() => {
  if (!activeCategory.value) return services.value
  return services.value.filter((service) => service.category === activeCategory.value)
})

const filteredFeaturedServices = computed(() => filteredServices.value.filter((service) => service.featured).slice(0, 6))

const serviceStats = computed(() => ({
  total: services.value.length,
  featured: services.value.filter((service) => service.featured).length,
  categories: serviceCategories.value.length
}))

function categoryLabel(slug) {
  return categories.value.find((category) => category.slug === slug)?.name || slug || 'General'
}

function categoryIcon(slug) {
  return categories.value.find((category) => category.slug === slug)?.icon || '⚡'
}

function resolveImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

function serviceWhatsappLink(service) {
  const text = encodeURIComponent(`Hola, quiero informacion sobre el servicio: ${service.name}`)
  return `https://wa.me/${WA_NUMBER}?text=${text}`
}

async function loadServices() {
  loading.value = true
  try {
    const [servicesResponse, categoriesResponse] = await Promise.all([
      fetch(`${API_URL}/services?isActive=true`),
      fetch(`${API_URL}/service-categories?isActive=true`)
    ])

    const [servicesData, categoriesData] = await Promise.all([
      servicesResponse.json(),
      categoriesResponse.json()
    ])

    services.value = servicesData.success ? (servicesData.data || []) : []
    categories.value = categoriesData.success ? (categoriesData.data || []) : []
  } catch (error) {
    console.error('Error loading services:', error)
    toast.error('No se pudieron cargar los servicios')
  } finally {
    loading.value = false
  }
}

function initRevealAnimations() {
  const items = document.querySelectorAll('[data-reveal]')
  if (!items.length) return

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          revealObserver?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )

  items.forEach((item) => revealObserver?.observe(item))
}

onMounted(async () => {
  await loadServices()
  await nextTick()
  initRevealAnimations()
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>

<style scoped>
[data-reveal] {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}

[data-reveal].revealed {
  opacity: 1;
  transform: translateY(0);
}

.reveal-card {
  opacity: 0;
  animation: fadeUp 0.7s ease forwards;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal],
  .reveal-card {
    opacity: 1;
    transform: none;
    transition: none;
    animation: none;
  }
}
</style>
