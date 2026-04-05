<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Panel de Control</h1>
        <p class="text-slate-500 text-sm mt-1">Resumen general de tu tienda</p>
      </div>
      <button @click="load" :disabled="loading" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
        <svg :class="loading ? 'animate-spin' : ''" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Actualizar
      </button>
    </div>

    <!-- KPI Cards Row 1 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-5 shadow border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 font-medium">Productos</p>
            <p class="text-3xl font-bold text-slate-900 mt-1">{{ totals.products }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">📦</div>
        </div>
        <button @click="$router.push('/products')" class="mt-3 text-xs text-blue-600 hover:underline">Ver todos →</button>
      </div>

      <div class="bg-white rounded-xl p-5 shadow border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 font-medium">Servicios</p>
            <p class="text-3xl font-bold text-slate-900 mt-1">{{ totals.services }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">⚡</div>
        </div>
        <button @click="$router.push('/services')" class="mt-3 text-xs text-green-600 hover:underline">Ver todos →</button>
      </div>

      <div class="bg-white rounded-xl p-5 shadow border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 font-medium">Categorías</p>
            <p class="text-3xl font-bold text-slate-900 mt-1">{{ totals.categories }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">🏷️</div>
        </div>
        <button @click="$router.push('/categories')" class="mt-3 text-xs text-purple-600 hover:underline">Ver todas →</button>
      </div>

      <div class="bg-white rounded-xl p-5 shadow border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 font-medium">Departamentos</p>
            <p class="text-3xl font-bold text-slate-900 mt-1">{{ totals.departments }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">🏬</div>
        </div>
        <button @click="$router.push('/departments')" class="mt-3 text-xs text-orange-600 hover:underline">Ver todos →</button>
      </div>
    </div>

    <!-- KPI Cards Row 2 - Inventory -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-5 shadow border-l-4 border-yellow-400">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 font-medium">Bajo Stock</p>
            <p class="text-3xl font-bold text-yellow-600 mt-1">{{ totals.lowStockProducts }}</p>
            <p class="text-xs text-slate-400">stock &lt; 10 unidades</p>
          </div>
          <div class="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center text-2xl">⚠️</div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 shadow border-l-4 border-red-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 font-medium">Sin Stock</p>
            <p class="text-3xl font-bold text-red-600 mt-1">{{ totals.outOfStockProducts }}</p>
            <p class="text-xs text-slate-400">necesitan reposición</p>
          </div>
          <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-2xl">🚫</div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 shadow border-l-4 border-yellow-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 font-medium">Destacados</p>
            <p class="text-3xl font-bold text-slate-900 mt-1">{{ totals.featuredProducts }}</p>
            <p class="text-xs text-slate-400">en vitrina</p>
          </div>
          <div class="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center text-2xl">⭐</div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 shadow border-l-4 border-emerald-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 font-medium">Valor Inventario</p>
            <p class="text-2xl font-bold text-emerald-600 mt-1">${{ formatNumber(inventory.totalValue) }}</p>
            <p class="text-xs text-slate-400">precio × stock</p>
          </div>
          <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-2xl">💰</div>
        </div>
      </div>
    </div>

    <!-- Middle Row: Department Distribution + Top Products -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Products by Department -->
      <div class="bg-white rounded-xl shadow p-5">
        <h3 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span>🏬</span> Productos por Departamento
        </h3>
        <div v-if="productsByDepartment.length === 0" class="text-center text-slate-400 py-4">
          Sin datos disponibles
        </div>
        <div v-else class="space-y-3">
          <div v-for="dept in productsByDepartment" :key="dept._id" class="flex items-center gap-3">
            <span class="text-xl w-8 text-center">{{ dept.icon || '📦' }}</span>
            <div class="flex-1">
              <div class="flex justify-between text-sm mb-1">
                <span class="font-medium text-slate-700">{{ dept.name }}</span>
                <span class="text-slate-500">{{ dept.count }}</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${Math.min((dept.count / (totals.products || 1)) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Priced Products -->
      <div class="bg-white rounded-xl shadow p-5">
        <h3 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span>💎</span> Productos Más Valiosos
        </h3>
        <div v-if="topPricedProducts.length === 0" class="text-center text-slate-400 py-4">
          Sin datos disponibles
        </div>
        <div v-else class="space-y-3">
          <div v-for="(product, i) in topPricedProducts" :key="product._id" class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
            <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">{{ i + 1 }}</span>
            <img
              v-if="product.images?.[0]?.url"
              :src="resolveImageUrl(product.images[0].url)"
              :alt="product.name"
              class="w-10 h-10 rounded-lg object-cover"
            />
            <div v-else class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">📦</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-800 truncate">{{ product.name }}</p>
            </div>
            <span class="text-sm font-bold text-emerald-600">${{ product.price?.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Low Stock Alert Table -->
    <div v-if="totals.lowStockProducts > 0" class="bg-white rounded-xl shadow p-5">
      <h3 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span>⚠️</span> Alerta de Stock Bajo
        <span class="ml-auto bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
          {{ totals.lowStockProducts }} productos
        </span>
      </h3>
      <div v-if="lowStockProducts.length === 0 && loadingLowStock" class="text-center text-slate-400 py-4 text-sm">
        Cargando...
      </div>
      <div v-else-if="lowStockProducts.length > 0" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-100">
              <th class="text-left py-2 text-slate-500 font-medium">Producto</th>
              <th class="text-center py-2 text-slate-500 font-medium">Stock</th>
              <th class="text-right py-2 text-slate-500 font-medium">Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in lowStockProducts" :key="p._id" class="border-b border-slate-50 hover:bg-slate-50">
              <td class="py-2 font-medium text-slate-800">{{ p.name }}</td>
              <td class="py-2 text-center">
                <span :class="p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'" class="px-2 py-1 rounded-full text-xs font-semibold">
                  {{ p.stock === 0 ? 'Sin stock' : p.stock + ' uds.' }}
                </span>
              </td>
              <td class="py-2 text-right text-slate-700">${{ p.price?.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button @click="$router.push('/products')" class="mt-4 text-sm text-blue-600 hover:underline">
        Gestionar productos →
      </button>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow p-5">
      <h3 class="font-semibold text-slate-900 mb-4 flex items-center gap-2"><span>⚡</span> Acciones Rápidas</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button @click="$router.push('/products')" class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition text-slate-600 hover:text-blue-700">
          <span class="text-2xl">➕</span>
          <span class="text-sm font-medium">Nuevo Producto</span>
        </button>
        <button @click="$router.push('/categories')" class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition text-slate-600 hover:text-purple-700">
          <span class="text-2xl">🏷️</span>
          <span class="text-sm font-medium">Nueva Categoría</span>
        </button>
        <button @click="$router.push('/departments')" class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition text-slate-600 hover:text-orange-700">
          <span class="text-2xl">🏬</span>
          <span class="text-sm font-medium">Nuevo Dep.</span>
        </button>
        <button @click="$router.push('/services')" class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-green-400 hover:bg-green-50 transition text-slate-600 hover:text-green-700">
          <span class="text-2xl">⚡</span>
          <span class="text-sm font-medium">Nuevo Servicio</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'

const loading = ref(false)
const loadingLowStock = ref(false)
const totals = ref({ products: 0, categories: 0, departments: 0, services: 0, featuredProducts: 0, lowStockProducts: 0, outOfStockProducts: 0 })
const inventory = ref({ totalValue: 0 })
const productsByDepartment = ref([])
const topPricedProducts = ref([])
const lowStockProducts = ref([])

const API_BASE = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')).replace('/api', '')

function resolveImageUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n?.toFixed(2) || '0.00'
}

async function load() {
  loading.value = true
  try {
    const response = await api.stats.dashboard()
    const data = response.data || {}
    totals.value = { ...totals.value, ...data.totals }
    inventory.value = data.inventory || { totalValue: 0 }
    productsByDepartment.value = data.productsByDepartment || []
    topPricedProducts.value = data.topPricedProducts || []

    if (totals.value.lowStockProducts > 0) {
      loadLowStock()
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function loadLowStock() {
  loadingLowStock.value = true
  try {
    const res = await api.products.list('maxStock=9&limit=20&sort=stock')
    lowStockProducts.value = res.data || []
  } catch {
    /* silent */
  } finally {
    loadingLowStock.value = false
  }
}

onMounted(load)
</script>
