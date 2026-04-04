<template>
  <section class="space-y-6">
    <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Pedidos</h1>
        <p class="text-sm text-slate-500">Encargos recibidos desde checkout (recoger en tienda)</p>
      </div>
      <button @click="loadOrders" class="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition">
        Actualizar
      </button>
    </header>

    <div class="bg-white rounded-xl border border-slate-200 p-4 grid md:grid-cols-3 gap-3">
      <input
        v-model="search"
        @input="loadOrders"
        placeholder="Buscar por numero, nombre, email o telefono"
        class="md:col-span-2 border rounded-lg px-3 py-2"
      />
      <select v-model="statusFilter" @change="loadOrders" class="border rounded-lg px-3 py-2">
        <option value="">Todos los estados</option>
        <option value="nuevo">Nuevo</option>
        <option value="en-proceso">En proceso</option>
        <option value="listo">Listo</option>
        <option value="entregado">Entregado</option>
        <option value="cancelado">Cancelado</option>
      </select>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-100 text-slate-700">
            <tr>
              <th class="text-left px-4 py-3">Recibo</th>
              <th class="text-left px-4 py-3">Cliente</th>
              <th class="text-left px-4 py-3">Productos</th>
              <th class="text-left px-4 py-3">Total</th>
              <th class="text-left px-4 py-3">Estado</th>
              <th class="text-left px-4 py-3">Fecha</th>
              <th class="text-left px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-8 text-center text-slate-500">Cargando pedidos...</td>
            </tr>
            <tr v-else-if="orders.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-slate-500">No hay pedidos registrados.</td>
            </tr>
            <tr v-for="order in orders" :key="order._id" class="border-t align-top">
              <td class="px-4 py-3 font-bold text-slate-900">#{{ order.orderNumber }}</td>
              <td class="px-4 py-3">
                <p class="font-semibold text-slate-900">{{ order.customer.fullName }}</p>
                <p class="text-slate-600">{{ order.customer.email }}</p>
                <p class="text-slate-600">{{ order.customer.phone }}</p>
              </td>
              <td class="px-4 py-3">
                <ul class="space-y-1">
                  <li v-for="item in order.items" :key="`${order._id}-${item.product}`" class="text-slate-700">
                    {{ item.quantity }} x {{ item.name }}
                  </li>
                </ul>
              </td>
              <td class="px-4 py-3 font-semibold text-slate-900">${{ Number(order.total).toFixed(2) }}</td>
              <td class="px-4 py-3">
                <select
                  :value="order.status"
                  @change="updateStatus(order, $event.target.value)"
                  class="border rounded-lg px-2 py-1"
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="en-proceso">En proceso</option>
                  <option value="listo">Listo</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </td>
              <td class="px-4 py-3 text-slate-600">{{ formatDate(order.createdAt) }}</td>
              <td class="px-4 py-3">
                <button
                  @click="openDetails(order)"
                  class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Ver
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AdminModal v-model="isDetailsOpen" title="Detalle del pedido">
      <div v-if="selectedOrder" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-3 text-sm">
          <div class="rounded-lg bg-slate-50 p-3">
            <p class="text-slate-500">Numero de recibo</p>
            <p class="font-bold text-slate-900">#{{ selectedOrder.orderNumber }}</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-3">
            <p class="text-slate-500">Fecha</p>
            <p class="font-semibold text-slate-900">{{ formatDate(selectedOrder.createdAt) }}</p>
          </div>
        </div>

        <div class="rounded-lg border border-slate-200 p-4">
          <h4 class="font-bold text-slate-900 mb-2">Datos del cliente</h4>
          <p class="text-slate-700"><strong>Nombre:</strong> {{ selectedOrder.customer.fullName }}</p>
          <p class="text-slate-700"><strong>Email:</strong> {{ selectedOrder.customer.email }}</p>
          <p class="text-slate-700"><strong>Telefono:</strong> {{ selectedOrder.customer.phone }}</p>
        </div>

        <div class="rounded-lg border border-slate-200 p-4">
          <h4 class="font-bold text-slate-900 mb-2">Productos</h4>
          <div class="space-y-2">
            <div
              v-for="item in selectedOrder.items"
              :key="`${selectedOrder._id}-detail-${item.product}`"
              class="flex items-center justify-between gap-2 text-sm border-b border-slate-100 pb-2"
            >
              <div>
                <p class="font-semibold text-slate-900">{{ item.name }}</p>
                <p class="text-slate-500">Cantidad: {{ item.quantity }} | Precio: ${{ Number(item.price).toFixed(2) }}</p>
              </div>
              <p class="font-bold text-slate-900">${{ Number(item.subtotal).toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-lg bg-slate-50 p-4 text-sm space-y-1">
          <p class="flex justify-between text-slate-700"><span>Metodo:</span><strong>Recoger en tienda</strong></p>
          <p class="flex justify-between text-slate-700"><span>Subtotal:</span><strong>${{ Number(selectedOrder.subtotal).toFixed(2) }}</strong></p>
          <p class="flex justify-between text-slate-700"><span>Impuestos:</span><strong>${{ Number(selectedOrder.tax).toFixed(2) }}</strong></p>
          <p class="flex justify-between text-slate-900 text-base"><span>Total:</span><strong>${{ Number(selectedOrder.total).toFixed(2) }}</strong></p>
          <p class="flex justify-between text-slate-700"><span>Estado:</span><strong>{{ selectedOrder.status }}</strong></p>
        </div>

        <div v-if="selectedOrder.notes" class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Nota del cliente:</strong> {{ selectedOrder.notes }}
        </div>
      </div>
    </AdminModal>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../services/api'
import AdminModal from '../components/AdminModal.vue'

const loading = ref(false)
const orders = ref([])
const search = ref('')
const statusFilter = ref('')
const isDetailsOpen = ref(false)
const selectedOrder = ref(null)

function formatDate(value) {
  return new Date(value).toLocaleString('es-DO', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

async function loadOrders() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (search.value.trim()) params.set('q', search.value.trim())
    if (statusFilter.value) params.set('status', statusFilter.value)

    const response = await api.orders.list(params.toString())
    orders.value = response.data || []
  } catch (error) {
    console.error('Error cargando pedidos:', error)
    alert(error.message || 'No se pudieron cargar los pedidos')
  } finally {
    loading.value = false
  }
}

async function updateStatus(order, nextStatus) {
  if (!nextStatus || nextStatus === order.status) return

  try {
    await api.orders.updateStatus(order._id, nextStatus)
    order.status = nextStatus
  } catch (error) {
    console.error('Error actualizando estado:', error)
    alert(error.message || 'No se pudo actualizar el estado')
    await loadOrders()
  }
}

function openDetails(order) {
  selectedOrder.value = order
  isDetailsOpen.value = true
}

onMounted(() => {
  loadOrders()
})
</script>
