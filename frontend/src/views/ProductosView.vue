<template>
  <div class="min-h-screen bg-slate-50">
    <Header :is-menu-open="isMenuOpen" @toggle-menu="isMenuOpen = !isMenuOpen" />

    <section class="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_#1d4ed8,_#0f172a_55%)] text-white">
      <div class="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-cyan-300/20 blur-3xl"></div>
      <div class="absolute -bottom-28 -right-16 w-96 h-96 rounded-full bg-amber-300/20 blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 py-10 md:py-14 lg:py-16 grid lg:grid-cols-12 gap-6 lg:gap-8 items-center" data-reveal>
        <div class="lg:col-span-7" data-reveal>
          <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-5">
            <span class="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            Selección destacada para tu hogar
          </p>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight">
            Tu vitrina digital,
            <span class="text-amber-300">con lo mejor para tu familia</span>
          </h1>
          <p class="mt-4 text-blue-100 text-base md:text-lg max-w-2xl">
            Descubre variedad, calidad y precios competitivos en cada categoría.
            Compra fácil, rápida y con toda la confianza de Super Latino Store.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <RouterLink to="/catalogo" class="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition">
              Ver catálogo completo
            </RouterLink>
            <RouterLink to="/servicios" class="px-6 py-3 rounded-xl bg-amber-400 text-slate-900 font-bold hover:bg-amber-300 transition">
              Ir a servicios
            </RouterLink>
          </div>

          <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div class="rounded-xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
              <p class="text-blue-100 text-sm">Productos</p>
              <p class="text-2xl lg:text-3xl font-extrabold">{{ stats.totalProducts }}</p>
            </div>
            <div class="rounded-xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
              <p class="text-blue-100 text-sm">Departamentos</p>
              <p class="text-2xl lg:text-3xl font-extrabold">{{ stats.totalDepartments }}</p>
            </div>
            <div class="rounded-xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
              <p class="text-blue-100 text-sm">Categorías</p>
              <p class="text-2xl lg:text-3xl font-extrabold">{{ stats.totalCategories }}</p>
            </div>
            <div class="rounded-xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
              <p class="text-blue-100 text-sm">Con descuento</p>
              <p class="text-2xl lg:text-3xl font-extrabold">{{ stats.onSale }}</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5" data-reveal>
          <article class="rounded-3xl overflow-hidden bg-white text-slate-900 shadow-2xl border border-slate-200">
            <div class="relative h-52 sm:h-56 lg:h-60 bg-slate-100">
              <img
                v-if="heroProduct"
                :src="getImageUrl(heroProduct.images?.[0]?.url)"
                :alt="heroProduct.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-6xl">📦</div>

              <span v-if="heroProduct?.discount > 0" class="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold">
                -{{ heroProduct.discount }}%
              </span>
            </div>

            <div class="p-5">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">Producto protagonista</p>
              <h2 class="text-xl lg:text-2xl font-black mt-2 line-clamp-2">{{ heroProduct?.name || 'Tu catálogo aparecerá aquí' }}</h2>
              <p class="mt-2 text-slate-600 text-sm line-clamp-2">{{ heroProduct?.description || 'Muy pronto encontrarás aquí nuestras mejores recomendaciones.' }}</p>

              <div v-if="heroProduct" class="mt-4 flex items-center justify-between">
                <div>
                  <p class="text-2xl lg:text-3xl font-extrabold text-blue-700">${{ formatPrice(heroProduct.price) }}</p>
                  <p v-if="heroProduct.originalPrice" class="text-sm text-slate-400 line-through">${{ formatPrice(heroProduct.originalPrice) }}</p>
                </div>
                <button @click="goToProduct(heroProduct)" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                  Ver detalle
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-6 md:py-8" data-reveal>
      <div class="flex flex-wrap gap-3">
        <button
          @click="selectedDepartment = ''"
          :class="selectedDepartment === '' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'"
          class="px-3 md:px-4 py-2 rounded-full font-semibold text-sm md:text-base transition"
        >
          Todos
        </button>
        <button
          v-for="dept in departments"
          :key="dept._id"
          @click="selectedDepartment = dept._id"
          :class="selectedDepartment === dept._id ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'"
          class="px-3 md:px-4 py-2 rounded-full font-semibold text-sm md:text-base transition"
        >
          {{ dept.icon || '🏬' }} {{ dept.name }}
        </button>
        <RouterLink
          :to="selectedDepartment ? `/catalogo?department=${selectedDepartment}` : '/catalogo'"
          class="w-full sm:w-auto sm:ml-auto px-4 py-2 rounded-full bg-amber-400 text-slate-900 font-bold text-center hover:bg-amber-300 transition"
        >
          Abrir en catálogo
        </RouterLink>
      </div>
    </section>

    <main class="max-w-7xl mx-auto px-4 pb-16 space-y-10 md:space-y-12">
      <section data-reveal>
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <h3 class="text-2xl md:text-3xl font-black text-slate-900">Nuevos en tienda</h3>
            <p class="text-slate-500">Nuevas llegadas para ti</p>
          </div>
          <RouterLink to="/catalogo" class="text-blue-700 font-semibold hover:underline">Ver todos</RouterLink>
        </div>

        <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <div v-for="i in 8" :key="i" class="h-80 rounded-2xl bg-slate-200/60 animate-pulse"></div>
        </div>

        <div v-else-if="filteredNewProducts.length" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <article
            v-for="(product, index) in filteredNewProducts"
            :key="product._id"
            class="group rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition overflow-hidden reveal-card"
            :style="{ animationDelay: `${index * 60}ms` }"
          >
            <button class="w-full h-44 md:h-48 bg-slate-100" @click="goToProduct(product)">
              <img
                v-if="product.images?.[0]?.url"
                :src="getImageUrl(product.images[0].url)"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span v-else class="text-6xl">📦</span>
            </button>

            <div class="p-4">
              <p class="text-xs font-semibold text-slate-500 mb-1">{{ product.department?.name || 'Sin departamento' }}</p>
              <h4 class="font-extrabold text-slate-900 line-clamp-2 min-h-[3rem]">{{ product.name }}</h4>
              <p class="text-sm text-slate-600 line-clamp-2 mt-1 min-h-[2.5rem]">{{ product.description }}</p>

              <div class="mt-3 flex items-center justify-between">
                <div>
                  <p class="text-2xl font-black text-blue-700">${{ formatPrice(product.price) }}</p>
                  <p v-if="product.originalPrice" class="text-xs text-slate-400 line-through">${{ formatPrice(product.originalPrice) }}</p>
                </div>
                <span :class="product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'" class="text-xs px-2 py-1 rounded-full font-bold">
                  {{ product.stock > 0 ? `${product.stock} uds.` : 'Sin stock' }}
                </span>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-2">
                <button @click="goToProduct(product)" class="py-2 rounded-lg border border-slate-300 font-semibold text-sm hover:bg-slate-50 transition">Detalle</button>
                <button @click="addToCart(product)" class="py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition">
                  Añadir
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          Estamos preparando esta sección para ti. Vuelve en unos momentos.
        </div>
      </section>

      <section data-reveal>
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <h3 class="text-2xl md:text-3xl font-black text-slate-900">Ofertas imperdibles de la semana</h3>
            <p class="text-slate-500">Productos seleccionados con precios especiales</p>
          </div>
          <RouterLink to="/catalogo?onSale=true" class="text-rose-700 font-semibold hover:underline">Ver ofertas</RouterLink>
        </div>

        <div v-if="onSaleProducts.length" class="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          <article v-for="(product, index) in onSaleProducts" :key="product._id" class="rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-4 shadow-sm reveal-card" :style="{ animationDelay: `${index * 80}ms` }">
            <div class="flex items-start gap-4">
              <img
                v-if="product.images?.[0]?.url"
                :src="getImageUrl(product.images[0].url)"
                :alt="product.name"
                class="w-24 h-24 rounded-xl object-cover"
              />
              <div v-else class="w-24 h-24 rounded-xl bg-white grid place-content-center text-4xl">📦</div>

              <div class="flex-1 min-w-0">
                <h4 class="font-extrabold text-slate-900 line-clamp-2">{{ product.name }}</h4>
                <p class="text-sm text-slate-600 mt-1">{{ product.department?.name || 'General' }}</p>
                <div class="mt-2 flex items-center gap-2">
                  <span class="text-xl font-black text-rose-700">${{ formatPrice(product.price) }}</span>
                  <span class="text-sm text-slate-400 line-through" v-if="product.originalPrice">${{ formatPrice(product.originalPrice) }}</span>
                  <span class="text-xs bg-rose-600 text-white px-2 py-1 rounded-full font-bold">-{{ product.discount || calcDiscount(product) }}%</span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex gap-2">
              <button @click="goToProduct(product)" class="flex-1 py-2 rounded-lg bg-white border border-slate-200 font-semibold hover:bg-slate-50 transition">Ver</button>
              <button @click="addToCart(product)" class="flex-1 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition">Comprar</button>
            </div>
          </article>
        </div>

        <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          Aún no hay ofertas activas en tus productos.
        </div>
      </section>
    </main>

    <Cart />
    <Footer />
    <StoreVisitPopup />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Cart from '../components/Cart.vue'
import StoreVisitPopup from '../components/StoreVisitPopup.vue'
import { useCartStore } from '../stores/cart'
import { useToast } from '../composables/useToast'

const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_BASE = API_URL.replace('/api', '')

const isMenuOpen = ref(false)
const loading = ref(true)

const products = ref([])
const departments = ref([])
const categories = ref([])
const selectedDepartment = ref('')
let revealObserver = null

const heroProduct = computed(() => {
  const featured = products.value.find((p) => p.featured)
  return featured || products.value[0] || null
})

const filteredNewProducts = computed(() => {
  const source = selectedDepartment.value
    ? products.value.filter((p) => p.department?._id === selectedDepartment.value)
    : products.value

  return source.slice(0, 8)
})

const onSaleProducts = computed(() => {
  const source = selectedDepartment.value
    ? products.value.filter((p) => p.department?._id === selectedDepartment.value)
    : products.value

  return source.filter((p) => (p.discount || 0) > 0 || (p.originalPrice && p.originalPrice > p.price)).slice(0, 6)
})

const stats = computed(() => ({
  totalProducts: products.value.length,
  totalDepartments: departments.value.length,
  totalCategories: categories.value.length,
  onSale: products.value.filter((p) => (p.discount || 0) > 0 || (p.originalPrice && p.originalPrice > p.price)).length
}))

function getImageUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

function formatPrice(value) {
  return Number(value || 0).toFixed(2)
}

function calcDiscount(product) {
  if (!product.originalPrice || !product.price || product.originalPrice <= product.price) return 0
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
}

function goToProduct(product) {
  router.push(`/producto/${product._id}`)
}

function addToCart(product) {
  const result = cartStore.addItem(product, 1)
  if (result.success) {
    toast.success(result.message)
  } else {
    toast.warning(result.message)
  }
}

async function loadData() {
  loading.value = true
  try {
    const [productsRes, departmentsRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/products?limit=48&sort=-createdAt`),
      fetch(`${API_URL}/departments?isActive=true`),
      fetch(`${API_URL}/categories?isActive=true`)
    ])

    const [productsJson, departmentsJson, categoriesJson] = await Promise.all([
      productsRes.json(),
      departmentsRes.json(),
      categoriesRes.json()
    ])

    products.value = productsJson.success ? (productsJson.data || []) : []
    departments.value = departmentsJson.success ? (departmentsJson.data || []) : []
    categories.value = categoriesJson.success ? (categoriesJson.data || []) : []
  } catch (error) {
    console.error('Error loading products view data:', error)
    toast.error('No se pudo cargar la información de productos')
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
  await loadData()
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
