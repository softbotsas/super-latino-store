<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl p-4 shadow" v-for="card in cards" :key="card.label">
        <p class="text-sm text-slate-500">{{ card.label }}</p>
        <p class="text-3xl font-bold text-slate-900">{{ card.value }}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-4">
      <h3 class="font-semibold text-lg mb-2">Resumen</h3>
      <p class="text-slate-600">Dashboard conectado con datos reales del backend.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '../services/api'

const totals = ref({ products: 0, categories: 0, departments: 0, services: 0 })

const cards = computed(() => [
  { label: 'Productos', value: totals.value.products },
  { label: 'Categorias', value: totals.value.categories },
  { label: 'Departamentos', value: totals.value.departments },
  { label: 'Servicios', value: totals.value.services }
])

async function load() {
  try {
    const response = await api.stats.dashboard()
    totals.value = response.data?.totals || totals.value
  } catch (error) {
    console.error(error)
  }
}

onMounted(load)
</script>
