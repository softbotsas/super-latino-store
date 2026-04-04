import { ref, h, render } from 'vue'
import Toast from '../components/Toast.vue'

const toasts = ref([])

export function useToast() {
  function show(message, type = 'success', duration = 3000) {
    const id = Date.now()

    // Crear contenedor
    const container = document.createElement('div')
    container.style.cssText = 'position: fixed; top: 1rem; right: 1rem; z-index: 9999;'
    document.body.appendChild(container)

    // Crear componente
    const vnode = h(Toast, {
      message,
      type,
      duration,
      onClose: () => {
        render(null, container)
        document.body.removeChild(container)
      }
    })

    render(vnode, container)
  }

  function success(message, duration) {
    show(message, 'success', duration)
  }

  function error(message, duration) {
    show(message, 'error', duration)
  }

  function info(message, duration) {
    show(message, 'info', duration)
  }

  function warning(message, duration) {
    show(message, 'warning', duration)
  }

  return {
    show,
    success,
    error,
    info,
    warning
  }
}


