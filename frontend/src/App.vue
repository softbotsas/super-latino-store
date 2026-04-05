<script setup>
import Cart from './components/Cart.vue'
import WhatsAppButton from './components/WhatsAppButton.vue'
import BackToTop from './components/BackToTop.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />

    <!-- Cart Sidebar -->
    <Cart />

    <!-- Floating WhatsApp Button -->
    <WhatsAppButton />

    <!-- Back to Top -->
    <BackToTop />
  </div>
</template>

<style scoped></style>
