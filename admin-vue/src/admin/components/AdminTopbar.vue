<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
    <h1 class="text-xl font-semibold text-slate-800">{{ title }}</h1>
    <div class="flex items-center gap-4">
      <span class="text-sm text-slate-600">{{ user?.username || 'Admin' }}</span>
      <button class="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm" @click="$emit('logout')">
        Cerrar sesion
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Admin' },
  user: { type: Object, default: null }
})

defineEmits(['logout'])
</script>
