import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  // State
  const favorites = ref([])

  // Computed
  const favoriteIds = computed(() => favorites.value.map(p => p._id))

  const favoriteCount = computed(() => favorites.value.length)

  // Actions
  function addFavorite(product) {
    const exists = favorites.value.find(p => p._id === product._id)
    if (!exists) {
      favorites.value.push(product)
      saveToLocalStorage()
      return true
    }
    return false
  }

  function removeFavorite(productId) {
    favorites.value = favorites.value.filter(p => p._id !== productId)
    saveToLocalStorage()
  }

  function toggleFavorite(product) {
    const index = favorites.value.findIndex(p => p._id === product._id)
    if (index > -1) {
      favorites.value.splice(index, 1)
      saveToLocalStorage()
      return false
    } else {
      favorites.value.push(product)
      saveToLocalStorage()
      return true
    }
  }

  function isFavorite(productId) {
    return favorites.value.some(p => p._id === productId)
  }

  function clearFavorites() {
    favorites.value = []
    saveToLocalStorage()
  }

  // LocalStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites.value))
    } catch (error) {
      console.error('Error saving favorites:', error)
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('favorites')
      if (saved) {
        favorites.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  // Initialize
  loadFromLocalStorage()

  return {
    // State
    favorites,
    // Computed
    favoriteIds,
    favoriteCount,
    // Actions
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites
  }
})


