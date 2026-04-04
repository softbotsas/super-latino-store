<template>
  <footer class="bg-gray-800 text-white">
    <div class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <img
              src="/logo-superlatino.png"
              alt="Super Latino Store Logo"
              class="h-10 w-auto object-contain"
            />
            <h3 class="text-2xl font-bold">
              <span class="text-latino-red">Super</span> Latino Store
            </h3>
          </div>
          <p class="text-gray-300 mb-4">
            Tu tienda de confianza para toda la familia latina. Calidad, precio y servicio excepcional.
          </p>
          <div class="flex space-x-4">
            <a
              href="https://www.instagram.com/superlatinostore?igsh=MWNpeHZlYXFsZWE0eQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              class="text-gray-300 hover:text-latino-yellow transition-colors"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm-.2 2A3.55 3.55 0 0 0 4 7.55v8.9A3.55 3.55 0 0 0 7.55 20h8.9A3.55 3.55 0 0 0 20 16.45v-8.9A3.55 3.55 0 0 0 16.45 4h-8.9Zm9.15 1.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.1a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/share/1DszQ5cSmD/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              class="text-gray-300 hover:text-latino-yellow transition-colors"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12a12 12 0 1 0-13.88 11.85v-8.39H7.08V12h3.04V9.36c0-3 1.79-4.66 4.52-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.93-1.95 1.88V12h3.33l-.53 3.46h-2.8v8.39A12 12 0 0 0 24 12Z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@super.latino.stor?_r=1&_t=ZP-95Gn0Vu8GjP"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              class="text-gray-300 hover:text-latino-yellow transition-colors"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 2c.38 1.96 1.55 3.32 3.5 4.06V8.9a8.9 8.9 0 0 1-3.5-1.14v6.52A6.28 6.28 0 1 1 9.22 8a6.3 6.3 0 0 1 2.2.4v2.9a3.46 3.46 0 1 0 1.17 2.61V2h2.91Z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Compras</h4>
          <ul class="space-y-2">
            <li><RouterLink to="/catalogo" class="text-gray-300 hover:text-latino-yellow transition-colors">Catálogo</RouterLink></li>
            <li><RouterLink to="/catalogo?descuento=true" class="text-gray-300 hover:text-latino-yellow transition-colors">Ofertas</RouterLink></li>
            <li><RouterLink to="/servicios" class="text-gray-300 hover:text-latino-yellow transition-colors">Servicios</RouterLink></li>
            <li><RouterLink to="/checkout" class="text-gray-300 hover:text-latino-yellow transition-colors">Mi Carrito</RouterLink></li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Atención al Cliente</h4>
          <ul class="space-y-2">
            <li><a href="tel:+18038886188" class="text-gray-300 hover:text-latino-yellow transition-colors">Llamar: (803) 888-6188</a></li>
            <li><a href="https://wa.me/18038886188" target="_blank" rel="noopener" class="text-gray-300 hover:text-latino-yellow transition-colors">WhatsApp</a></li>
            <li><a href="mailto:info@superlatino.store" class="text-gray-300 hover:text-latino-yellow transition-colors">Correo electrónico</a></li>
            <li><RouterLink to="/checkout" class="text-gray-300 hover:text-latino-yellow transition-colors">Ver mi pedido</RouterLink></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Contáctanos</h4>
          <div class="space-y-2">
            <p class="text-gray-300">📞 (803) 888-6188</p>
            <p class="text-gray-300">💬 WhatsApp: (803) 888-6188</p>
            <p class="text-gray-300">📍 10171 Two Notch Rd Suite A, Columbia, SC 29229</p>
            <p class="text-gray-300">🕒 De 9am a 9pm todos los días.</p>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-700 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © 2025 Super Latino Store. Todos los derechos reservados.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-latino-yellow text-sm transition-colors">Privacidad</a>
            <a href="#" class="text-gray-400 hover:text-latino-yellow text-sm transition-colors">Términos</a>
            <a href="#" class="text-gray-400 hover:text-latino-yellow text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
