<template>
  <div class="animate-pulse">
    <!-- Product Card Skeleton -->
    <div v-if="type === 'product-card'" class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="aspect-square bg-gray-300"></div>
      <div class="p-4 space-y-3">
        <div class="h-3 bg-gray-300 rounded w-1/2"></div>
        <div class="h-4 bg-gray-300 rounded w-3/4"></div>
        <div class="h-4 bg-gray-300 rounded w-full"></div>
        <div class="flex items-center gap-2">
          <div class="h-3 bg-gray-300 rounded w-16"></div>
          <div class="h-3 bg-gray-300 rounded w-16"></div>
        </div>
        <div class="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>

    <!-- Product Detail Skeleton -->
    <div v-else-if="type === 'product-detail'" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div class="space-y-4">
        <div class="bg-gray-300 aspect-square rounded-2xl"></div>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="bg-gray-300 aspect-square rounded-lg"></div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="h-4 bg-gray-300 rounded w-1/4"></div>
        <div class="h-10 bg-gray-300 rounded w-3/4"></div>
        <div class="h-6 bg-gray-300 rounded w-1/2"></div>
        <div class="h-32 bg-gray-300 rounded"></div>
        <div class="h-16 bg-gray-300 rounded"></div>
      </div>
    </div>

    <!-- List Item Skeleton -->
    <div v-else-if="type === 'list-item'" class="bg-white rounded-lg shadow p-4 flex gap-4">
      <div class="w-20 h-20 bg-gray-300 rounded-lg"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-300 rounded w-3/4"></div>
        <div class="h-3 bg-gray-300 rounded w-1/2"></div>
        <div class="h-3 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>

    <!-- Generic Skeleton -->
    <div v-else class="bg-gray-300 rounded" :style="{ height, width }"></div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['product-card', 'product-detail', 'list-item', 'default'].includes(value)
  },
  height: {
    type: String,
    default: '100px'
  },
  width: {
    type: String,
    default: '100%'
  }
})
</script>


