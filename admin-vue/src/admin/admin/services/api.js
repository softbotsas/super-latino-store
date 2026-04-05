const API_BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')).replace(/\/$/, '')

function getToken() {
  return localStorage.getItem('adminToken') || ''
}

async function request(path, options = {}, requiresAuth = true) {
  const headers = {
    ...(options.headers || {})
  }

  if (requiresAuth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const isFormData = options.body instanceof FormData
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 401 && requiresAuth) {
      localStorage.removeItem('adminToken')
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }

    const message = data.error || data.message || 'Error en la solicitud'
    throw new Error(message)
  }

  return data
}

export const api = {
  auth: {
    login(email, password) {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }, false)
    },
    verify() {
      return request('/auth/verify')
    },
    logout() {
      return request('/auth/logout', { method: 'POST' })
    }
  },

  stats: {
    dashboard() {
      return request('/stats/dashboard')
    }
  },

  products: {
    list(params = '') {
      return request(`/products${params ? `?${params}` : ''}`)
    },
    create(payload) {
      return request('/products', { method: 'POST', body: JSON.stringify(payload) })
    },
    update(id, payload) {
      return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    },
    remove(id) {
      return request(`/products/${id}`, { method: 'DELETE' })
    }
  },

  categories: {
    list(params = '') {
      return request(`/categories${params ? `?${params}` : ''}`)
    },
    create(payload) {
      return request('/categories', { method: 'POST', body: JSON.stringify(payload) })
    },
    update(id, payload) {
      return request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    },
    remove(id) {
      return request(`/categories/${id}`, { method: 'DELETE' })
    }
  },

  departments: {
    list(params = '') {
      return request(`/departments${params ? `?${params}` : ''}`)
    },
    create(payload) {
      return request('/departments', { method: 'POST', body: JSON.stringify(payload) })
    },
    update(id, payload) {
      return request(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    },
    remove(id) {
      return request(`/departments/${id}`, { method: 'DELETE' })
    }
  },

  services: {
    list(params = '') {
      return request(`/services${params ? `?${params}` : ''}`)
    },
    create(payload) {
      return request('/services', { method: 'POST', body: JSON.stringify(payload) })
    },
    update(id, payload) {
      return request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    },
    remove(id) {
      return request(`/services/${id}`, { method: 'DELETE' })
    }
  },

  upload: {
    image(formData) {
      return request('/upload', { method: 'POST', body: formData })
    }
  }
}
