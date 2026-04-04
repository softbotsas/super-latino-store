import { createRouter, createWebHistory } from 'vue-router'
import ProductosView from '../views/ProductosView.vue'
import ServiciosView from '../views/ServiciosView.vue'
import CatalogoView from '../views/CatalogoView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import CompareView from '../views/CompareView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const BASE_TITLE = 'Super Latino Store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/productos'
    },
    {
      path: '/productos',
      name: 'productos',
      component: ProductosView,
      meta: { title: `Productos — ${BASE_TITLE}` }
    },
    {
      path: '/catalogo',
      name: 'catalogo',
      component: CatalogoView,
      meta: { title: `Catálogo — ${BASE_TITLE}` }
    },
    {
      path: '/producto/:id',
      name: 'product-detail',
      component: ProductDetailView,
      meta: { title: `Producto — ${BASE_TITLE}` }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
      meta: { title: `Finalizar Compra — ${BASE_TITLE}` }
    },
    {
      path: '/comparar',
      name: 'compare',
      component: CompareView,
      meta: { title: `Comparar Productos — ${BASE_TITLE}` }
    },
    {
      path: '/servicios',
      name: 'servicios',
      component: ServiciosView,
      meta: { title: `Servicios — ${BASE_TITLE}` }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { title: `Página no encontrada — ${BASE_TITLE}` }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta?.title || BASE_TITLE
})

export default router
