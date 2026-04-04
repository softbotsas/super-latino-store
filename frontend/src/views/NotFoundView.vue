<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center max-w-lg">
      <div class="text-9xl font-black text-latino-blue mb-4 leading-none">404</div>
      <h1 class="text-3xl font-bold text-gray-900 mb-3">Página no encontrada</h1>
      <p class="text-gray-600 mb-8 text-lg">
        Lo sentimos, la página que buscas no existe o fue movida.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <router-link to="/" class="px-8 py-3 bg-latino-blue text-white font-bold rounded-xl hover:bg-blue-700 transition">
          🏠 Ir al inicio
        </router-link>
        <router-link to="/catalogo" class="px-8 py-3 border-2 border-latino-blue text-latino-blue font-bold rounded-xl hover:bg-blue-50 transition">
          🛒 Ver productos
        </router-link>
      </div>
    </div>
  </div>
</template>
