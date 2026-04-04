<template>
  <aside class="w-72 bg-slate-900 text-white min-h-screen p-4 flex flex-col">
    <h2 class="text-2xl font-bold mb-2">Super Latino Admin</h2>
    <p class="text-xs text-slate-300 mb-8">Panel profesional Vue</p>
    <nav class="space-y-2">
      <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="block px-4 py-3 rounded-lg hover:bg-slate-800" active-class="bg-blue-600 hover:bg-blue-600">
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="mt-auto pt-6 border-t border-slate-700 text-xs text-slate-300 space-y-2">
      <a href="/" class="block hover:text-white">Ir a tienda</a>
      <a href="/catalogo" class="block hover:text-white">Catalogo publico</a>
    </div>
  </aside>
</template>

<script setup>
const items = [
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/products', label: '📦 Productos' },
  { to: '/categories', label: '📂 Categorias' },
  { to: '/departments', label: '🏬 Departamentos' },
  { to: '/services', label: '⚡ Servicios' },
  { to: '/orders', label: '🧾 Pedidos' },
  { to: '/settings', label: '⚙️ Configuracion' }
]
</script>
