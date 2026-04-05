<template>
  <section class="py-20 bg-gradient-to-br from-gray-50 to-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-5xl font-bold text-gray-900 mb-6">
          Nuestros Departamentos
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Explora todas nuestras categorías y encuentra exactamente lo que necesitas para tu hogar y familia
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div v-for="i in 3" :key="i" class="bg-white rounded-3xl shadow-xl p-8 animate-pulse">
          <div class="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-2xl"></div>
          <div class="h-6 bg-gray-200 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-6"></div>
          <div class="flex justify-center space-x-6">
            <div class="h-8 w-16 bg-gray-200 rounded"></div>
            <div class="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Featured Departments - Walmart Style Collage -->
      <div v-else-if="featuredDepartments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div v-for="featured in featuredDepartments" :key="featured._id"
             @click="goToDepartment(featured)"
             class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer border-2 border-gray-100 hover:border-latino-blue">
          <!-- Image Background -->
          <div class="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <img 
              v-if="getDepartmentImage(featured._id)" 
              :src="getDepartmentImage(featured._id)" 
              :alt="featured.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="w-24 h-24 rounded-full" :style="{ backgroundColor: featured.color + '40' }"></div>
            </div>
            <!-- Overlay Gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            <!-- Department Name on Image -->
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-2xl font-bold text-white drop-shadow-lg">
                {{ featured.icon || '🏬' }} {{ featured.name }}
              </h3>
              <p class="text-white/90 text-sm mt-1">
                {{ featured.products }} productos
              </p>
            </div>
          </div>

          <!-- Content Below Image -->
          <div class="p-4">
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">
              {{ featured.description }}
            </p>
            
            <!-- Stats -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <div class="flex items-center space-x-2">
                <span class="font-bold" :style="{ color: featured.color || '#10B981' }">{{ featured.discount }}% OFF</span>
              </div>
              <div class="flex items-center text-latino-blue group-hover:translate-x-1 transition-transform">
                <span class="text-sm font-semibold mr-1">Ver más</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Departments Grid -->
      <div class="bg-white rounded-3xl shadow-xl p-8">
        <h3 class="text-3xl font-bold text-center text-gray-900 mb-8">
          Todos los Departamentos
        </h3>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          <div v-for="i in 8" :key="i" class="bg-gray-100 rounded-2xl p-6 animate-pulse">
            <div class="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        <!-- Departments Grid - Walmart Style -->
        <div v-else-if="allDepartments.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div v-for="department in allDepartments" :key="department._id"
               @click="goToDepartment(department)"
            class="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer border border-gray-200"
            :style="{ borderColor: department.color || '#E5E7EB' }">
            <!-- Image Container -->
            <div class="relative h-32 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
              <img 
                v-if="getDepartmentImage(department._id)" 
                :src="getDepartmentImage(department._id)" 
                :alt="department.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <div class="w-16 h-16 rounded-full flex items-center justify-center text-3xl" :style="{ backgroundColor: (department.color || '#3B82F6') + '40' }">{{ department.icon || '🏬' }}</div>
              </div>
              <!-- Overlay on hover -->
              <div class="absolute inset-0 bg-latino-blue/0 group-hover:bg-latino-blue/10 transition-colors duration-300"></div>
            </div>
            
            <!-- Department Name -->
            <div class="p-3 text-center">
              <h4 class="font-semibold text-sm text-gray-900 group-hover:text-latino-blue transition-colors line-clamp-2">
                {{ department.icon || '🏬' }} {{ department.name }}
              </h4>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h4 class="text-xl font-semibold text-gray-700 mb-2">No hay departamentos disponibles</h4>
          <p class="text-gray-500">Crea departamentos desde el panel de administración</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')
const UPLOADS_BASE = API_URL.replace(/\/api\/?$/, '')

const departments = ref([])
const loading = ref(true)

// Obtener departamentos del backend
async function loadDepartments() {
  try {
    loading.value = true
    const response = await fetch(`${API_URL}/departments?isActive=true`)
    const data = await response.json()
    
    if (data.success) {
      departments.value = data.data || []
    }
  } catch (error) {
    console.error('Error loading departments:', error)
  } finally {
    loading.value = false
  }
}

// Departamentos destacados (primeros 3 o los que tengan más productos)
const featuredDepartments = computed(() => {
  const sorted = [...departments.value].sort((a, b) => {
    const aCount = a.stats?.productCount || 0
    const bCount = b.stats?.productCount || 0
    return bCount - aCount
  })
  
  return sorted.slice(0, 3).map(dept => ({
    _id: dept._id,
    name: dept.name,
    icon: dept.icon,
    description: dept.description || `Explora ${dept.name} con los mejores precios`,
    products: dept.stats?.productCount || 0,
    discount: 25, // Puedes calcular esto desde productos con descuento
    slug: dept.slug,
    color: dept.color || '#3B82F6'
  }))
})

// Todos los departamentos
const allDepartments = computed(() => {
  return departments.value.map(dept => ({
    _id: dept._id,
    name: dept.name,
    icon: dept.icon,
    slug: dept.slug,
    color: dept.color || '#3B82F6'
  }))
})

// Navegar a catálogo con filtro de departamento
function goToDepartment(department) {
  router.push({
    path: '/catalogo',
    query: { department: department._id || department.slug }
  })
}

// Obtener imagen del departamento
function getDepartmentImage(departmentId) {
  const dept = departments.value.find(d => d._id === departmentId)
  if (dept && dept.image && dept.image.url) {
    // Si la URL empieza con /uploads, agregar el dominio del backend
    if (dept.image.url.startsWith('/uploads')) {
      return `${UPLOADS_BASE}${dept.image.url}`
    }
    return dept.image.url
  }
  return null
}

onMounted(() => {
  loadDepartments()
})
</script>
