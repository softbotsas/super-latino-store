import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../admin/layouts/AdminLayout.vue'
import AdminLoginView from '../admin/views/AdminLoginView.vue'
import AdminDashboardView from '../admin/views/AdminDashboardView.vue'
import AdminProductsView from '../admin/views/AdminProductsView.vue'
import AdminCategoriesView from '../admin/views/AdminCategoriesView.vue'
import AdminDepartmentsView from '../admin/views/AdminDepartmentsView.vue'
import AdminServicesView from '../admin/views/AdminServicesView.vue'
import AdminSettingsView from '../admin/views/AdminSettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'admin-login',
      component: AdminLoginView,
      meta: { adminGuestOnly: true }
    },
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAdmin: true },
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboardView, meta: { title: 'Dashboard' } },
        { path: 'products', name: 'admin-products', component: AdminProductsView, meta: { title: 'Productos' } },
        { path: 'categories', name: 'admin-categories', component: AdminCategoriesView, meta: { title: 'Categorias' } },
        { path: 'departments', name: 'admin-departments', component: AdminDepartmentsView, meta: { title: 'Departamentos' } },
        { path: 'services', name: 'admin-services', component: AdminServicesView, meta: { title: 'Servicios' } },
        { path: 'settings', name: 'admin-settings', component: AdminSettingsView, meta: { title: 'Configuracion' } }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.beforeEach(async (to) => {
  const token = localStorage.getItem('adminToken')

  if (to.meta.requiresAdmin && !token) {
    return '/login'
  }

  if (to.meta.adminGuestOnly && token) {
    return '/dashboard'
  }

  return true
})

export default router
