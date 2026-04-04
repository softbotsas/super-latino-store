import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCompareStore = defineStore('compare', () => {
  // State
  const compareList = ref([])
  const maxItems = 3

  // Computed
  const compareCount = computed(() => compareList.value.length)

  const isFull = computed(() => compareList.value.length >= maxItems)

  const compareIds = computed(() => compareList.value.map(p => p._id))

  // Actions
  function addToCompare(product) {
    // Check if already in list
    const exists = compareList.value.find(p => p._id === product._id)
    if (exists) {
      return { success: false, message: 'Producto ya está en comparación' }
    }

    // Check if list is full
    if (isFull.value) {
      return { success: false, message: `Máximo ${maxItems} productos para comparar` }
    }

    compareList.value.push(product)
    saveToLocalStorage()
    return { success: true, message: 'Producto agregado a comparación' }
  }

  function removeFromCompare(productId) {
    compareList.value = compareList.value.filter(p => p._id !== productId)
    saveToLocalStorage()
  }

  function isInCompare(productId) {
    return compareList.value.some(p => p._id === productId)
  }

  function clearCompare() {
    compareList.value = []
    saveToLocalStorage()
  }

  function toggleCompare(product) {
    const index = compareList.value.findIndex(p => p._id === product._id)
    if (index > -1) {
      compareList.value.splice(index, 1)
      saveToLocalStorage()
      return { added: false, message: 'Producto removido de comparación' }
    } else {
      if (isFull.value) {
        return { added: false, message: `Máximo ${maxItems} productos para comparar` }
      }
      compareList.value.push(product)
      saveToLocalStorage()
      return { added: true, message: 'Producto agregado a comparación' }
    }
  }

  // LocalStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem('compareList', JSON.stringify(compareList.value))
    } catch (error) {
      console.error('Error saving compare list:', error)
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('compareList')
      if (saved) {
        compareList.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading compare list:', error)
    }
  }

  // Initialize
  loadFromLocalStorage()

  return {
    // State
    compareList,
    maxItems,
    // Computed
    compareCount,
    isFull,
    compareIds,
    // Actions
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
    toggleCompare
  }
})


