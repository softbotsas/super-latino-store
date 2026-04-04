<template>
  <div class="min-h-screen bg-slate-100 flex">
    <AdminSidebar />
    <div class="flex-1 min-w-0">
      <AdminTopbar :title="pageTitle" :user="auth.user" @logout="handleLogout" />
      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminAuthStore } from '../stores/auth'
import AdminSidebar from '../components/AdminSidebar.vue'
import AdminTopbar from '../components/AdminTopbar.vue'

const route = useRoute()
const router = useRouter()
const auth = useAdminAuthStore()

const pageTitle = computed(() => route.meta?.title || 'Admin')

async function handleLogout() {
  await auth.logout()
  router.push('/admin/login')
}

onMounted(async () => {
  const ok = await auth.verify()
  if (!ok) {
    router.push('/admin/login')
  }
})
</script>
