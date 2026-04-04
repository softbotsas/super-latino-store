import { ref } from 'vue'

const API_URL = 'http://localhost:5000/api'

export function useRecommendations() {
  const recommendations = ref([])
  const loading = ref(false)

  // Obtener recomendaciones basadas en un producto
  async function getRecommendationsByProduct(productId) {
    loading.value = true
    try {
      const response = await fetch(`${API_URL}/products/${productId}/related`)
      const data = await response.json()

      if (data.success) {
        recommendations.value = data.data
        return data.data
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      loading.value = false
    }
    return []
  }

  // Obtener recomendaciones basadas en categoría
  async function getRecommendationsByCategory(categoryId, limit = 8) {
    loading.value = true
    try {
      const response = await fetch(`${API_URL}/products?category=${categoryId}&featured=true&limit=${limit}`)
      const data = await response.json()

      if (data.success) {
        recommendations.value = data.data
        return data.data
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      loading.value = false
    }
    return []
  }

  // Obtener recomendaciones basadas en carrito (productos vistos recientemente)
  async function getRecommendationsByCart(productIds, limit = 6) {
    if (!productIds || productIds.length === 0) return []

    loading.value = true
    try {
      // Obtener categorías de productos en carrito
      const categoriesSet = new Set()

      for (const productId of productIds) {
        const response = await fetch(`${API_URL}/products/${productId}`)
        const data = await response.json()
        if (data.success && data.data.category) {
          categoriesSet.add(data.data.category._id || data.data.category)
        }
      }

      // Buscar productos de esas categorías
      const categories = Array.from(categoriesSet)
      if (categories.length > 0) {
        const response = await fetch(`${API_URL}/products?category=${categories[0]}&limit=${limit}`)
        const data = await response.json()

        if (data.success) {
          // Excluir productos que ya están en el carrito
          const filtered = data.data.filter(p => !productIds.includes(p._id))
          recommendations.value = filtered
          return filtered
        }
      }
    } catch (error) {
      console.error('Error fetching cart recommendations:', error)
    } finally {
      loading.value = false
    }
    return []
  }

  // Productos populares (más vendidos / mejor valorados)
  async function getPopularProducts(limit = 8) {
    loading.value = true
    try {
      const response = await fetch(`${API_URL}/products?sortBy=-rating.average&limit=${limit}`)
      const data = await response.json()

      if (data.success) {
        recommendations.value = data.data
        return data.data
      }
    } catch (error) {
      console.error('Error fetching popular products:', error)
    } finally {
      loading.value = false
    }
    return []
  }

  return {
    recommendations,
    loading,
    getRecommendationsByProduct,
    getRecommendationsByCategory,
    getRecommendationsByCart,
    getPopularProducts
  }
}


