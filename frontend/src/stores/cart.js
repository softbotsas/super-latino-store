import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const isCartOpen = ref(false)

  // Computed
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  })

  const tax = computed(() => {
    return subtotal.value * 0.08 // 8% tax
  })

  const total = computed(() => {
    return subtotal.value + tax.value
  })

  const savings = computed(() => {
    return items.value.reduce((total, item) => {
      if (item.product.originalPrice) {
        const discount = (item.product.originalPrice - item.product.price) * item.quantity
        return total + discount
      }
      return total
    }, 0)
  })

  // Actions
  function addItem(product, quantity = 1) {
    if (product.salesChannel === 'virtual') {
      return {
        success: false,
        message: 'Este producto se compra por WhatsApp.'
      }
    }

    const existingItem = items.value.find(item => item.product._id === product._id)

    if (existingItem) {
      // Check stock
      if (existingItem.quantity + quantity > product.stock) {
        return {
          success: false,
          message: `Solo quedan ${product.stock} unidades disponibles`
        }
      }
      existingItem.quantity += quantity
    } else {
      if (quantity > product.stock) {
        return {
          success: false,
          message: `Solo hay ${product.stock} unidades disponibles`
        }
      }
      items.value.push({
        product,
        quantity
      })
    }

    saveToLocalStorage()
    return {
      success: true,
      message: `${product.name} agregado al carrito`
    }
  }

  function removeItem(productId) {
    items.value = items.value.filter(item => item.product._id !== productId)
    saveToLocalStorage()
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.product._id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else if (quantity > item.product.stock) {
        return {
          success: false,
          message: `Solo hay ${item.product.stock} unidades disponibles`
        }
      } else {
        item.quantity = quantity
        saveToLocalStorage()
      }
    }
    return { success: true }
  }

  function clearCart() {
    items.value = []
    saveToLocalStorage()
  }

  function toggleCart() {
    isCartOpen.value = !isCartOpen.value
  }

  function openCart() {
    isCartOpen.value = true
  }

  function closeCart() {
    isCartOpen.value = false
  }

  // LocalStorage persistence
  function saveToLocalStorage() {
    try {
      localStorage.setItem('cart', JSON.stringify(items.value))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) {
        items.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }

  // Initialize
  loadFromLocalStorage()

  return {
    // State
    items,
    isCartOpen,
    // Computed
    itemCount,
    subtotal,
    tax,
    total,
    savings,
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart
  }
})




