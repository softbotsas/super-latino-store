// API Configuration
const API_URL = localStorage.getItem('apiUrl') || 'http://localhost:5000/api';

// Auth state
let currentUser = null;
let authToken = null;

// State
let currentPage = 'dashboard';
let products = [];
let categories = [];
let departments = [];
let services = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.protocol === 'file:') {
    window.location.href = 'http://localhost:3000';
    return;
  }
  checkAuth();
});

// Authentication functions
function checkAuth() {
  authToken = localStorage.getItem('authToken');
  if (authToken) {
    // Verify token
    fetch(`${API_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        currentUser = data.data.user;
        showAdminPanel();
      } else {
        logout();
      }
    })
    .catch(() => {
      logout();
    });
  } else {
    showLoginPage();
  }
}

function showLoginPage() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'flex';

  // Update user info
  if (currentUser) {
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userRole').textContent = currentUser.role;
    document.getElementById('userAvatar').textContent = currentUser.username.charAt(0).toUpperCase();
  }

  // Initialize navigation and load data
  initNavigation();
  loadDashboardData();
  loadDepartments();
  loadCategories();

  // Setup logout
  document.getElementById('btnLogout').addEventListener('click', logout);
}

function login(email, password) {
  const loginMessage = document.getElementById('loginMessage');
  loginMessage.textContent = 'Iniciando sesión...';
  loginMessage.className = 'login-message';

  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      authToken = data.data.token;
      currentUser = data.data.user;
      localStorage.setItem('authToken', authToken);
      showAdminPanel();
    } else {
      loginMessage.textContent = data.message || 'Error en el login';
      loginMessage.className = 'login-message error';
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    loginMessage.textContent = 'Error de conexión';
    loginMessage.className = 'login-message error';
  });
}

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  showLoginPage();
}

// Helper function for authenticated requests
function authenticatedFetch(url, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    ...options.headers
  };

  // Browser must set multipart boundary automatically for FormData.
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(url, {
    ...options,
    headers
  });
}

// Login form handler
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  }
});

// Navigation
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const page = item.getAttribute('data-page');
      if (page) {
        navigateTo(page);
      }
      return false;
    });
  });

  // Mobile menu
  const btnMenu = document.getElementById('btnMenu');
  const sidebar = document.querySelector('.sidebar');
  if (btnMenu) {
    btnMenu.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
}

function navigateTo(page) {
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

  // Update pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });
  document.getElementById(page)?.classList.add('active');

  // Update title
  const titles = {
    dashboard: 'Dashboard',
    products: 'Productos',
    categories: 'Categorías',
    departments: 'Departamentos',
    services: 'Servicios',
    settings: 'Configuración'
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;

  // Load data for the page
  switch(page) {
    case 'products':
      loadProducts();
      break;
    case 'categories':
      loadCategories();
      break;
    case 'departments':
      loadDepartments();
      break;
    case 'services':
      loadServices();
      break;
  }

  currentPage = page;
}

// Dashboard mejorado con estadísticas del endpoint
async function loadDashboardData() {
  try {
    // Usar el endpoint de estadísticas mejorado
    const statsRes = await authenticatedFetch(`${API_URL}/stats/dashboard`);
    const statsData = await statsRes.json();

    if (statsData.success) {
      const { totals, inventory, productsByDepartment, topPricedProducts, topRatedProducts } = statsData.data;

      // Actualizar totales
      document.getElementById('totalProducts').textContent = totals.products || 0;
      document.getElementById('totalServices').textContent = totals.services || 0;
      document.getElementById('totalCategories').textContent = totals.categories || 0;
      document.getElementById('totalDepartments').textContent = totals.departments || 0;

      // Agregar estadísticas adicionales si existen elementos en el DOM
      const lowStockEl = document.getElementById('lowStockProducts');
      if (lowStockEl) lowStockEl.textContent = totals.lowStockProducts || 0;

      const outOfStockEl = document.getElementById('outOfStockProducts');
      if (outOfStockEl) outOfStockEl.textContent = totals.outOfStockProducts || 0;

      const inventoryValueEl = document.getElementById('inventoryValue');
      if (inventoryValueEl) inventoryValueEl.textContent = `$${(inventory.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Fallback a método simple
    try {
      const [productsRes, servicesRes, categoriesRes, departmentsRes] = await Promise.all([
        authenticatedFetch(`${API_URL}/products`),
        authenticatedFetch(`${API_URL}/services`),
        authenticatedFetch(`${API_URL}/categories`),
        authenticatedFetch(`${API_URL}/departments`)
      ]);

      const productsData = await productsRes.json();
      const servicesData = await servicesRes.json();
      const categoriesData = await categoriesRes.json();
      const departmentsData = await departmentsRes.json();

      document.getElementById('totalProducts').textContent = productsData.pagination?.total || productsData.data?.length || 0;
      document.getElementById('totalServices').textContent = servicesData.data?.length || 0;
      document.getElementById('totalCategories').textContent = categoriesData.data?.length || 0;
      document.getElementById('totalDepartments').textContent = departmentsData.data?.length || 0;
    } catch (fallbackError) {
      console.error('Error en fallback:', fallbackError);
      showNotification('Error al cargar datos del dashboard', 'error');
    }
  }
}

// Products
async function loadProducts(page = 1) {
  const tbody = document.getElementById('productsTableBody');
  tbody.innerHTML = '<tr><td colspan="9" class="loading">Cargando productos...</td></tr>';

  try {
    const department = document.getElementById('filterDepartment')?.value || '';
    const category = document.getElementById('filterCategory')?.value || '';
    const search = document.getElementById('searchProducts')?.value || '';
    const stockFilter = document.getElementById('filterStock')?.value || '';

    let url = `${API_URL}/products?page=${page}&limit=20`;
    if (department) url += `&department=${department}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    
    // Filtro de stock mejorado
    if (stockFilter === 'low') url += '&maxStock=9';
    if (stockFilter === 'out') url += '&maxStock=0';

    const response = await authenticatedFetch(url);
    const data = await response.json();
    
    products = data.data || [];

    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="loading">No se encontraron productos</td></tr>';
      return;
    }

    tbody.innerHTML = products.map(product => `
      <tr>
        <td class="bulk-check-cell" style="display: none;">
          <input type="checkbox" class="product-checkbox" value="${product._id}">
        </td>
        <td>
          ${product.images && product.images[0] ? 
            `<img src="${product.images[0].url.startsWith('/uploads') ? 'http://localhost:5000' + product.images[0].url : product.images[0].url}" alt="${product.name}" class="product-img">` :
            '<div class="product-img" style="background: #E5E7EB; display: flex; align-items: center; justify-content: center;">📦</div>'
          }
        </td>
        <td><strong>${product.name}</strong></td>
        <td>${product.sku}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${product.stock}</td>
        <td>${product.category?.name || 'N/A'}</td>
        <td>
          <span class="badge-status ${product.isActive ? 'badge-active' : 'badge-inactive'}">
            ${product.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary" onclick="editProduct('${product._id}')">✏️</button>
          <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">🗑️</button>
        </td>
      </tr>
    `).join('');

    // Renderizar paginación si existe
    if (data.pagination) {
      renderPagination(data.pagination);
    }
  } catch (error) {
    console.error('Error loading products:', error);
    tbody.innerHTML = '<tr><td colspan="9" class="loading">Error al cargar productos</td></tr>';
  }
}

// Renderizar paginación
function renderPagination(pagination) {
  const container = document.getElementById('productsPagination');
  if (!container || pagination.pages <= 1) {
    if (container) container.innerHTML = '';
    return;
  }

  let html = '<div class="pagination-container">';
  
  // Botón anterior
  if (pagination.page > 1) {
    html += `<button class="btn btn-secondary" onclick="loadProducts(${pagination.page - 1})">← Anterior</button>`;
  }

  // Números de página
  const maxVisible = 5;
  let start = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
  let end = Math.min(pagination.pages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    const activeClass = i === pagination.page ? 'btn-primary' : 'btn-secondary';
    html += `<button class="btn ${activeClass}" onclick="loadProducts(${i})">${i}</button>`;
  }

  // Botón siguiente
  if (pagination.page < pagination.pages) {
    html += `<button class="btn btn-secondary" onclick="loadProducts(${pagination.page + 1})">Siguiente →</button>`;
  }

  html += '</div>';
  container.innerHTML = html;
}

function openProductModal(productId = null) {
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');
  
  // Guardar ID si estamos editando
  editingProductId = productId;
  
  // Load departments and categories for the selects
  loadDepartmentsSelect();
  
  if (productId) {
    // Edit mode
    const product = products.find(p => p._id === productId);
    if (product) {
      document.getElementById('productModalTitle').textContent = 'Editar Producto';
      form.elements.name.value = product.name;
      form.elements.sku.value = product.sku;
      form.elements.price.value = product.price;
      form.elements.stock.value = product.stock;
      form.elements.description.value = product.description;
      form.elements.discount.value = product.discount || 0;
      form.elements.productType.value = product.productType || 'general';
      form.elements.salesChannel.value = product.salesChannel || 'store';
      form.elements.featured.checked = product.featured || false;
      form.elements.department.value = product.department?._id || product.department;

      clearSizeRows();
      if (Array.isArray(product.availableSizes) && product.availableSizes.length > 0) {
        product.availableSizes.forEach(size => {
          if (typeof size === 'string') {
            addSizeRow(size, 0);
          } else {
            addSizeRow(size.label || '', size.quantity || 0);
          }
        });
      }
      toggleSizeManager();
      
      // Mostrar imagen actual si existe
      if (product.images && product.images[0]) {
        const imageUrl = product.images[0].url;
        const fullUrl = imageUrl.startsWith('/uploads') ? `http://localhost:5000${imageUrl}` : imageUrl;
        document.getElementById('productImageUrl').value = fullUrl;
        document.getElementById('previewImg').src = fullUrl;
        document.getElementById('imagePreview').style.display = 'block';
        // Hacer que el campo de imagen no sea requerido en edición
        document.getElementById('productImage').required = false;
      }
      
      // Load categories for this department
      loadCategoriesForDepartment(product.department?._id || product.department).then(() => {
        form.elements.category.value = product.category?._id || product.category;
      });
    }
  } else {
    // Create mode
    document.getElementById('productModalTitle').textContent = 'Nuevo Producto';
    form.reset();
    removeImagePreview();
    clearSizeRows();
    form.elements.productType.value = 'general';
    toggleSizeManager();
    editingProductId = null;
    // Hacer imagen requerida en creación
    document.getElementById('productImage').required = false; // Permitimos URL también
  }
  
  // Agregar listener para preview de imagen
  const imageInput = document.getElementById('productImage');
  if (imageInput) {
    imageInput.removeEventListener('change', handleImagePreview);
    imageInput.addEventListener('change', handleImagePreview);
  }
  
  modal.classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  const form = document.getElementById('productForm');
  form.reset();
  removeImagePreview();
}

async function saveProduct() {
  const form = document.getElementById('productForm');
  const formData = new FormData(form);
  const sizeVariants = getSizeVariantsFromForm();
  const stockFromSizes = sizeVariants.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const imageFile = formData.get('image');
  const imageUrl = document.getElementById('productImageUrl').value;
  
  let imageUploadUrl = null;

  try {
    // Si hay archivo, subirlo primero
    if (imageFile && imageFile.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);
      
      const uploadResponse = await authenticatedFetch(`${API_URL}/upload`, {
        method: 'POST',
        body: uploadFormData
      });

      const uploadData = await uploadResponse.json();
      
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Error al subir la imagen');
      }

      // Construir URL completa para el backend
      imageUploadUrl = `http://localhost:5000${uploadData.data.url}`;
    } else if (imageUrl) {
      // Si hay URL de imagen, usarla directamente
      imageUploadUrl = imageUrl;
    } else {
      throw new Error('Debes subir una imagen o ingresar una URL de imagen');
    }

    // Crear el producto con la imagen
  const productData = {
    name: formData.get('name'),
    sku: formData.get('sku'),
    price: parseFloat(formData.get('price')),
    stock: sizeVariants.length > 0 ? stockFromSizes : (parseInt(formData.get('stock')) || 0),
    description: formData.get('description'),
    discount: parseInt(formData.get('discount')) || 0,
    featured: formData.get('featured') === 'on',
    productType: formData.get('productType') || 'general',
    salesChannel: formData.get('salesChannel') || 'store',
    availableSizes: sizeVariants,
    department: formData.get('department'),
    category: formData.get('category'),
      images: [{
        url: imageUploadUrl,
        alt: formData.get('name') || 'Imagen del producto',
        isPrimary: true
      }],
    isActive: true
  };

    // Determinar si es crear o editar
    const isEditing = editingProductId !== null;
    const url = isEditing ? `${API_URL}/products/${editingProductId}` : `${API_URL}/products`;
    const method = isEditing ? 'PUT' : 'POST';

    const response = await authenticatedFetch(url, {
      method: method,
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (response.ok) {
      showNotification(isEditing ? 'Producto actualizado exitosamente' : 'Producto guardado exitosamente', 'success');
      closeProductModal();
      loadProducts();
      loadDashboardData();
      // Resetear el formulario y preview
      form.reset();
      removeImagePreview();
      editingProductId = null;
    } else {
      throw new Error(data.error || 'Error al guardar producto');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification(error.message || 'Error al guardar el producto', 'error');
  }
}

function toggleSizeManager() {
  const form = document.getElementById('productForm');
  if (!form) return;

  const type = form.elements.productType?.value;
  const sizeManager = document.getElementById('sizeManager');
  if (!sizeManager) return;

  const shouldShow = type === 'ropa' || type === 'zapatos';
  sizeManager.style.display = shouldShow ? 'block' : 'none';

  if (shouldShow && document.querySelectorAll('.size-row').length === 0) {
    addSizeRow();
  }
}

function addSizeRow(label = '', quantity = 0) {
  const container = document.getElementById('sizeRows');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'size-row';
  row.style.display = 'grid';
  row.style.gridTemplateColumns = '1fr 120px auto';
  row.style.gap = '8px';

  row.innerHTML = `
    <input type="text" class="size-label" placeholder="Talla (Ej: 20, 40ft, M, XL)" value="${label}">
    <input type="number" class="size-qty" min="0" placeholder="Cantidad" value="${quantity}">
    <button type="button" class="btn btn-danger" onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(row);
}

function clearSizeRows() {
  const container = document.getElementById('sizeRows');
  if (container) container.innerHTML = '';
}

function getSizeVariantsFromForm() {
  const form = document.getElementById('productForm');
  const type = form?.elements.productType?.value;
  if (type !== 'ropa' && type !== 'zapatos') return [];

  const rows = document.querySelectorAll('.size-row');
  const variants = [];
  rows.forEach(row => {
    const label = row.querySelector('.size-label')?.value?.trim();
    const quantity = Number(row.querySelector('.size-qty')?.value || 0);
    if (label) {
      variants.push({ label, quantity });
    }
  });

  return variants;
}

async function deleteProduct(productId) {
  // Encontrar el producto para mostrar su nombre
  const product = products.find(p => p._id === productId);
  const productName = product ? product.name : 'este producto';
  
  // Confirmación mejorada
  const confirmMessage = `⚠️ ¿Estás seguro de eliminar "${productName}"?\n\nEsta acción no se puede deshacer.`;
  if (!confirm(confirmMessage)) return;

  try {
    const response = await authenticatedFetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok) {
      showNotification(`✅ "${productName}" eliminado exitosamente`, 'success');
      loadProducts();
      loadDashboardData();
    } else {
      throw new Error(data.error || 'Error al eliminar producto');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification(`❌ ${error.message || 'Error al eliminar el producto'}`, 'error');
  }
}

// Eliminación de categorías
async function deleteCategory(categoryId) {
  const category = categories.find(c => c._id === categoryId);
  const categoryName = category ? category.name : 'esta categoría';
  
  if (!confirm(`⚠️ ¿Eliminar "${categoryName}"?\n\nLos productos de esta categoría no se eliminarán.`)) return;

  try {
    const response = await authenticatedFetch(`${API_URL}/categories/${categoryId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showNotification(`✅ "${categoryName}" eliminada`, 'success');
      loadCategories();
      loadDashboardData();
    } else {
      throw new Error('Error al eliminar categoría');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('❌ Error al eliminar la categoría', 'error');
  }
}

// Eliminación de departamentos
async function deleteDepartment(departmentId) {
  const department = departments.find(d => d._id === departmentId);
  const deptName = department ? department.name : 'este departamento';
  
  if (!confirm(`⚠️ ¿Eliminar "${deptName}"?\n\nLas categorías y productos no se eliminarán.`)) return;

  try {
    const response = await authenticatedFetch(`${API_URL}/departments/${departmentId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showNotification(`✅ "${deptName}" eliminado`, 'success');
      loadDepartments();
      loadDashboardData();
    } else {
      throw new Error('Error al eliminar departamento');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('❌ Error al eliminar el departamento', 'error');
  }
}

// Categories
async function loadCategories() {
  const tbody = document.getElementById('categoriesTableBody');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Cargando categorías...</td></tr>';
  }

  try {
    const response = await authenticatedFetch(`${API_URL}/categories`);
    const data = await response.json();
    
    categories = data.data || [];

    if (tbody && categories.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="loading">No se encontraron categorías</td></tr>';
      return;
    }

    if (tbody) {
      tbody.innerHTML = categories.map(category => `
        <tr>
          <td><strong>${category.name}</strong></td>
          <td>${category.slug}</td>
          <td>${category.department?.name || 'N/A'}</td>
          <td>${category.order || 0}</td>
          <td>
            <span class="badge-status ${category.isActive ? 'badge-active' : 'badge-inactive'}">
              ${category.isActive ? 'Activa' : 'Inactiva'}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary" onclick="editCategory('${category._id}')">✏️</button>
            <button class="btn btn-danger" onclick="deleteCategory('${category._id}')">🗑️</button>
          </td>
        </tr>
      `).join('');
    }

    // Update filter selects
    const filterCategory = document.getElementById('filterCategory');
    if (filterCategory) {
      filterCategory.innerHTML = '<option value="">Todas las categorías</option>' +
        categories.map(cat => `<option value="${cat._id}">${cat.name}</option>`).join('');
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="6" class="loading">Error al cargar categorías</td></tr>';
    }
  }
}

async function loadCategoriesForDepartment(departmentId) {
  try {
    const response = await authenticatedFetch(`${API_URL}/categories?department=${departmentId}`);
    const data = await response.json();
    
    const categorySelect = document.getElementById('productCategory');
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="">Selecciona una categoría</option>' +
        (data.data || []).map(cat => `<option value="${cat._id}">${cat.name}</option>`).join('');
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

// Departments
async function loadDepartments() {
  const grid = document.getElementById('departmentsGrid');
  if (!grid) {
    // Si el grid no existe, no estamos en la página de departamentos
    return;
  }
  
  grid.innerHTML = '<div class="loading">Cargando departamentos...</div>';

  try {
    // Cargar TODOS los departamentos (activos e inactivos) para el admin
    // Pasamos isActive='' para que el backend devuelva todos
    const response = await authenticatedFetch(`${API_URL}/departments?isActive=`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al cargar departamentos');
    }
    
    departments = data.data || [];
    
    console.log('Departamentos cargados:', departments.length); // Debug

    if (departments.length === 0 && grid) {
      grid.innerHTML = '<div class="loading">No se encontraron departamentos</div>';
      return;
    }

    if (grid) {
      grid.innerHTML = departments.map(dept => {
        // Construir URL de imagen
        let imageUrl = '';
        if (dept.image && dept.image.url) {
          imageUrl = dept.image.url.startsWith('/uploads') 
            ? `http://localhost:5000${dept.image.url}` 
            : dept.image.url;
        }
        
        return `
        <div class="department-card">
          ${imageUrl ? `
            <div style="width: 100%; height: 200px; overflow: hidden; border-radius: 8px 8px 0 0; background: linear-gradient(135deg, ${dept.color || '#3B82F6'}20, ${dept.color || '#3B82F6'}10);">
              <img src="${imageUrl}" alt="${dept.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          ` : `
            <div style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, ${dept.color || '#3B82F6'}20, ${dept.color || '#3B82F6'}10); border-radius: 8px 8px 0 0;">
              <div style="width: 80px; height: 80px; border-radius: 50%; background-color: ${dept.color || '#3B82F6'}; opacity: 0.3;"></div>
            </div>
          `}
          <div style="padding: 1rem;">
            <h3 style="margin: 0 0 0.5rem 0;">
              ${dept.name}
            </h3>
            <p style="margin: 0 0 1rem 0; color: #666; font-size: 0.9rem;">${dept.description || 'Sin descripción'}</p>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
              <span class="badge-status ${dept.isActive ? 'badge-active' : 'badge-inactive'}">
                ${dept.isActive ? 'Activo' : 'Inactivo'}
              </span>
              ${dept.color ? `<span style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; background-color: ${dept.color}; border: 2px solid #ddd;" title="${dept.color}"></span>` : ''}
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary" onclick="editDepartment('${dept._id}')">✏️ Editar</button>
              <button class="btn btn-danger" onclick="deleteDepartment('${dept._id}')">🗑️ Eliminar</button>
            </div>
          </div>
        </div>
      `;
      }).join('');
    }

    // Update filter select
    const filterDepartment = document.getElementById('filterDepartment');
    if (filterDepartment) {
      filterDepartment.innerHTML = '<option value="">Todos los departamentos</option>' +
        departments.map(dept => `<option value="${dept._id}">${dept.name}</option>`).join('');
    }
  } catch (error) {
    console.error('Error loading departments:', error);
    if (grid) {
      grid.innerHTML = '<div class="loading">Error al cargar departamentos</div>';
    }
  }
}

async function loadDepartmentsSelect() {
  try {
    if (departments.length === 0) {
      const response = await authenticatedFetch(`${API_URL}/departments`);
      const data = await response.json();
      departments = data.data || [];
    }

    const deptSelect = document.getElementById('productDepartment');
    if (deptSelect) {
      // Remove old listener if it exists
      const newDeptSelect = deptSelect.cloneNode(true);
      deptSelect.parentNode.replaceChild(newDeptSelect, deptSelect);
      
      // Populate options
      newDeptSelect.innerHTML = '<option value="">Selecciona un departamento</option>' +
        departments.map(dept => `<option value="${dept._id}">${dept.name}</option>`).join('');
      
      // Add change listener to load categories (only one listener)
      newDeptSelect.addEventListener('change', (e) => {
        loadCategoriesForDepartment(e.target.value);
      });
      
      // Reset category select when department changes
      newDeptSelect.addEventListener('change', () => {
        const categorySelect = document.getElementById('productCategory');
        if (categorySelect) {
          categorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
        }
      });
    }
  } catch (error) {
    console.error('Error loading departments:', error);
  }
}

// Services
async function loadServices() {
  const grid = document.getElementById('servicesGrid');
  if (grid) {
    grid.innerHTML = '<div class="loading">Cargando servicios...</div>';
  }

  try {
    const response = await authenticatedFetch(`${API_URL}/services`);
    const data = await response.json();
    
    services = data.data || [];

    if (services.length === 0 && grid) {
      grid.innerHTML = '<div class="loading">No se encontraron servicios</div>';
      return;
    }

    if (grid) {
      grid.innerHTML = services.map(service => `
        <div class="service-card">
          <h3>
            <span>${service.icon || '⚡'}</span>
            ${service.name}
          </h3>
          <p>${service.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
            <div>
              <strong style="font-size: 1.5rem; color: var(--primary-color);">
                ${service.pricingType === 'free' ? 'Gratis' : '$' + service.price}
              </strong>
              ${service.featured ? '<span class="badge-status badge-active">Destacado</span>' : ''}
            </div>
            <span class="badge-status ${service.isActive ? 'badge-active' : 'badge-inactive'}">
              ${service.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary">✏️ Editar</button>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading services:', error);
    if (grid) {
      grid.innerHTML = '<div class="loading">Error al cargar servicios</div>';
    }
  }
}

// Settings
function saveSettings() {
  const apiUrl = document.getElementById('apiUrl').value;
  localStorage.setItem('apiUrl', apiUrl);
  showNotification('Configuración guardada', 'success');
}

async function seedDatabase() {
  if (!confirm('¿Estás seguro de poblar la base de datos? Esto eliminará todos los datos existentes.')) return;

  try {
    showNotification('Poblando base de datos...', 'info');
    
    // Note: You would need to create this endpoint in your backend
    // For now, we'll show a message
    alert('Por favor ejecuta "npm run seed" desde la carpeta backend en la terminal');
    
  } catch (error) {
    console.error('Error:', error);
    showNotification('Error al poblar la base de datos', 'error');
  }
}

// Utility Functions
function showNotification(message, type = 'success') {
  // Simple notification - could be enhanced with a library
  const colors = {
    success: '#10B981',
    error: '#EF4444',
    info: '#3B82F6',
    warning: '#F59E0B'
  };

  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Image preview functions
function handleImagePreview(event) {
  const file = event.target.files[0];
  if (file) {
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('La imagen es demasiado grande. Máximo 5MB', 'error');
      event.target.value = '';
      return;
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('Formato no válido. Solo JPG, PNG, GIF o WEBP', 'error');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('imagePreview');
      const previewImg = document.getElementById('previewImg');
      
      previewImg.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function removeImagePreview() {
  const preview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  const imageInput = document.getElementById('productImage');
  const imageUrlInput = document.getElementById('productImageUrl');
  
  if (preview) preview.style.display = 'none';
  if (previewImg) previewImg.src = '';
  if (imageInput) imageInput.value = '';
  if (imageUrlInput) imageUrlInput.value = '';
}

// Category image preview functions
function previewCategoryImage(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('categoryImagePreview');
      const previewImg = document.getElementById('categoryPreviewImg');
      if (preview && previewImg) {
        previewImg.src = e.target.result;
        preview.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }
}

function removeCategoryImagePreview() {
  const preview = document.getElementById('categoryImagePreview');
  const previewImg = document.getElementById('categoryPreviewImg');
  const fileInput = document.querySelector('input[name="imageFile"]');
  const urlInput = document.querySelector('input[name="imageUrl"]');

  if (preview) preview.style.display = 'none';
  if (previewImg) previewImg.src = '';
  if (fileInput) fileInput.value = '';
  if (urlInput) urlInput.value = '';
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Category Modal Functions
function openCategoryModal(categoryId = null) {
  const modal = document.getElementById('categoryModal');
  const form = document.getElementById('categoryForm');
  
  // Guardar ID si estamos editando
  editingCategoryId = categoryId;
  
  // Cargar departamentos para el select
  loadDepartmentsForCategorySelect();
  
  if (categoryId) {
    // Edit mode
    const category = categories.find(c => c._id === categoryId);
    if (category) {
      document.getElementById('categoryModalTitle').textContent = 'Editar Categoría';
      form.elements.name.value = category.name;
      form.elements.department.value = category.department?._id || category.department;
      form.elements.description.value = category.description || '';
      form.elements.imageUrl.value = category.image?.url || '';

      // Mostrar preview si hay imagen
      if (category.image?.url) {
        const preview = document.getElementById('categoryImagePreview');
        const previewImg = document.getElementById('categoryPreviewImg');
        if (preview && previewImg) {
          previewImg.src = category.image.url;
          preview.style.display = 'block';
        }
      }
    }
  } else {
    // Create mode
    document.getElementById('categoryModalTitle').textContent = 'Nueva Categoría';
    form.reset();
    removeCategoryImagePreview();
    editingCategoryId = null;
  }
  
  modal.classList.add('active');
}

function closeCategoryModal() {
  document.getElementById('categoryModal').classList.remove('active');
  document.getElementById('categoryForm').reset();
}

async function saveCategory() {
  const form = document.getElementById('categoryForm');
  const formData = new FormData(form);

  const categoryData = {
    name: formData.get('name'),
    department: formData.get('department'),
    description: formData.get('description') || '',
    isActive: true
  };

  // Manejar imagen
  const imageFile = formData.get('imageFile');
  const imageUrl = formData.get('imageUrl');

  if (imageFile && imageFile.size > 0) {
    // Subir imagen primero
    try {
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);
      imageFormData.append('entityType', 'categories');

      const uploadResponse = await authenticatedFetch(`${API_URL}/upload`, {
        method: 'POST',
        body: imageFormData
      });

      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen');
      }

      const uploadData = await uploadResponse.json();
      categoryData.image = {
        url: uploadData.data.url,
        alt: categoryData.name
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('Error al subir la imagen', 'error');
      return;
    }
  } else if (imageUrl) {
    // Usar URL directa
    categoryData.image = {
      url: imageUrl,
      alt: categoryData.name
    };
  }

  try {
    const isEditing = editingCategoryId !== null;
    const url = isEditing ? `${API_URL}/categories/${editingCategoryId}` : `${API_URL}/categories`;
    const method = isEditing ? 'PUT' : 'POST';

    const response = await authenticatedFetch(url, {
      method: method,
      body: JSON.stringify(categoryData)
    });

    const data = await response.json();

    if (response.ok) {
      showNotification(isEditing ? 'Categoría actualizada exitosamente' : 'Categoría guardada exitosamente', 'success');
      closeCategoryModal();
      loadCategories();
      loadDashboardData();
      editingCategoryId = null;
    } else {
      throw new Error(data.error || 'Error al guardar categoría');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification(error.message || 'Error al guardar la categoría', 'error');
  }
}

async function loadDepartmentsForCategorySelect() {
  try {
    if (departments.length === 0) {
      const response = await authenticatedFetch(`${API_URL}/departments`);
      const data = await response.json();
      departments = data.data || [];
    }
    
    const deptSelect = document.getElementById('categoryDepartment');
    if (deptSelect) {
      deptSelect.innerHTML = '<option value="">Selecciona un departamento</option>' +
        departments.map(dept => `<option value="${dept._id}">${dept.name}</option>`).join('');
    }
  } catch (error) {
    console.error('Error loading departments:', error);
  }
}

// Department Modal Functions
function openDepartmentModal(departmentId = null) {
  const modal = document.getElementById('departmentModal');
  const form = document.getElementById('departmentForm');
  
  // Guardar ID si estamos editando
  editingDepartmentId = departmentId;
  
  // Setup color preview (solo una vez)
  const colorInput = document.getElementById('departmentColor');
  const colorPreview = document.getElementById('colorPreview');
  const colorValue = document.getElementById('colorValue');
  
  // Remover listeners anteriores si existen
  if (colorInput) {
    const newColorInput = colorInput.cloneNode(true);
    colorInput.parentNode.replaceChild(newColorInput, colorInput);
    
    newColorInput.addEventListener('input', function() {
      const color = this.value;
      const preview = document.getElementById('colorPreview');
      const value = document.getElementById('colorValue');
      if (preview) {
        preview.style.backgroundColor = color;
      }
      if (value) {
        value.textContent = color;
      }
    });
  }
  
  // Setup image preview
  const imageInput = document.getElementById('departmentImage');
  if (imageInput) {
    const newImageInput = imageInput.cloneNode(true);
    imageInput.parentNode.replaceChild(newImageInput, imageInput);
    newImageInput.addEventListener('change', handleDepartmentImagePreview);
  }
  
  if (departmentId) {
    // Edit mode
    const department = departments.find(d => d._id === departmentId);
    if (department) {
      document.getElementById('departmentModalTitle').textContent = 'Editar Departamento';
      form.elements.name.value = department.name;
      form.elements.icon.value = department.icon || '';
      const color = department.color || '#3B82F6';
      const colorInputField = document.getElementById('departmentColor');
      const preview = document.getElementById('colorPreview');
      const value = document.getElementById('colorValue');
      if (colorInputField) colorInputField.value = color;
      if (preview) preview.style.backgroundColor = color;
      if (value) value.textContent = color;
      form.elements.description.value = department.description || '';
      
      // Mostrar imagen actual si existe
      if (department.image && department.image.url) {
        const imageUrl = department.image.url.startsWith('/uploads') 
          ? `http://localhost:5000${department.image.url}` 
          : department.image.url;
        document.getElementById('previewDepartmentImg').src = imageUrl;
        document.getElementById('departmentImagePreview').style.display = 'block';
        form.elements.image.required = false; // No requerido en edición
      }
    }
  } else {
    // Create mode
    document.getElementById('departmentModalTitle').textContent = 'Nuevo Departamento';
    form.reset();
    const defaultColor = '#3B82F6';
    const colorInputField = document.getElementById('departmentColor');
    const preview = document.getElementById('colorPreview');
    const value = document.getElementById('colorValue');
    if (colorInputField) colorInputField.value = defaultColor;
    if (preview) preview.style.backgroundColor = defaultColor;
    if (value) value.textContent = defaultColor;
    removeDepartmentImagePreview();
    if (form.elements.image) form.elements.image.required = true;
    editingDepartmentId = null;
  }
  
  modal.classList.add('active');
}

function handleDepartmentImagePreview(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('previewDepartmentImg').src = e.target.result;
      document.getElementById('departmentImagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function removeDepartmentImagePreview() {
  document.getElementById('departmentImagePreview').style.display = 'none';
  document.getElementById('previewDepartmentImg').src = '';
  document.getElementById('departmentImage').value = '';
}

function closeDepartmentModal() {
  document.getElementById('departmentModal').classList.remove('active');
  document.getElementById('departmentForm').reset();
}

async function saveDepartment() {
  const form = document.getElementById('departmentForm');
  const formData = new FormData(form);
  const imageFile = formData.get('image');
  
  const isEditing = editingDepartmentId !== null;
  let imageUploadUrl = null;

  try {
    // Si hay archivo, subirlo primero
    if (imageFile && imageFile.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);
      
      const uploadResponse = await authenticatedFetch(`${API_URL}/upload`, {
        method: 'POST',
        body: uploadFormData
      });

      const uploadData = await uploadResponse.json();
      
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Error al subir la imagen');
      }

      imageUploadUrl = uploadData.data.url;
    } else if (isEditing) {
      // Si estamos editando y no hay nueva imagen, mantener la actual
      const existingDept = departments.find(d => d._id === editingDepartmentId);
      if (existingDept && existingDept.image && existingDept.image.url) {
        imageUploadUrl = existingDept.image.url;
      }
    } else {
      // Si es creación y no hay imagen, error
      throw new Error('Debes subir una imagen para el departamento');
    }

    // Crear el departamento con la imagen
    const departmentData = {
      name: formData.get('name'),
      icon: formData.get('icon') || '🏬',
      color: formData.get('color') || '#3B82F6',
      description: formData.get('description') || '',
      isActive: true,
      image: {
        url: imageUploadUrl,
        alt: formData.get('name')
      }
    };
    
    // Si estamos editando, mantener el estado actual si existe
    if (isEditing) {
      const existingDept = departments.find(d => d._id === editingDepartmentId);
      if (existingDept) {
        departmentData.isActive = existingDept.isActive !== false;
      }
    }
    
    const url = isEditing ? `${API_URL}/departments/${editingDepartmentId}` : `${API_URL}/departments`;
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(departmentData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showNotification(isEditing ? '✅ Departamento actualizado exitosamente' : '✅ Departamento guardado exitosamente', 'success');
      closeDepartmentModal();
      
      // Pequeño delay para asegurar que el backend haya guardado
      setTimeout(() => {
        // Si no estás en la página de departamentos, navegar ahí
        if (currentPage !== 'departments') {
          navigateTo('departments');
        } else {
          // Si ya estás ahí, recargar la lista
          loadDepartments();
        }
        
        loadDashboardData();
      }, 300);
      
      editingDepartmentId = null;
    } else {
      throw new Error(data.error || 'Error al guardar departamento');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification(`❌ ${error.message || 'Error al guardar el departamento'}`, 'error');
  }
}

function openServiceModal() {
  showNotification('Funcionalidad en desarrollo', 'info');
}

function editProduct(productId) {
  openProductModal(productId);
}

function editCategory(categoryId) {
  openCategoryModal(categoryId);
}

function editDepartment(departmentId) {
  openDepartmentModal(departmentId);
}

// Actualizar saveProduct para soportar edición
let editingProductId = null;
let editingCategoryId = null;
let editingDepartmentId = null;

// Bulk operations
let bulkModeActive = false;

function toggleBulkMode() {
  bulkModeActive = !bulkModeActive;
  
  const checkHeader = document.getElementById('bulkCheckHeader');
  const checkCells = document.querySelectorAll('.bulk-check-cell');
  const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
  const bulkModeBtn = document.getElementById('bulkModeBtn');
  
  if (bulkModeActive) {
    checkHeader.style.display = 'table-cell';
    checkCells.forEach(cell => cell.style.display = 'table-cell');
    bulkDeleteBtn.style.display = 'inline-block';
    bulkModeBtn.textContent = '❌ Cancelar Selección';
    bulkModeBtn.classList.add('btn-secondary');
    bulkModeBtn.classList.remove('btn-primary');
  } else {
    checkHeader.style.display = 'none';
    checkCells.forEach(cell => cell.style.display = 'none');
    bulkDeleteBtn.style.display = 'none';
    bulkModeBtn.textContent = '☑️ Selección Múltiple';
    bulkModeBtn.classList.add('btn-primary');
    bulkModeBtn.classList.remove('btn-secondary');
    // Desmarcar todos
    document.getElementById('selectAllProducts').checked = false;
    document.querySelectorAll('.product-checkbox').forEach(cb => cb.checked = false);
  }
}

function selectAllProducts(checkbox) {
  const checkboxes = document.querySelectorAll('.product-checkbox');
  checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

async function bulkDelete() {
  const selectedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
  const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.value);
  
  if (selectedIds.length === 0) {
    showNotification('⚠️ Selecciona al menos un producto', 'warning');
    return;
  }
  
  if (!confirm(`⚠️ ¿Eliminar ${selectedIds.length} producto(s)?\n\nEsta acción no se puede deshacer.`)) {
    return;
  }
  
  let deletedCount = 0;
  let errors = 0;
  
  for (const id of selectedIds) {
    try {
      const response = await authenticatedFetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        deletedCount++;
      } else {
        errors++;
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      errors++;
    }
  }
  
  showNotification(`✅ ${deletedCount} producto(s) eliminado(s). ${errors > 0 ? `❌ ${errors} error(es).` : ''}`, deletedCount > 0 ? 'success' : 'error');
  loadProducts();
  loadDashboardData();
  
  // Salir del modo bulk
  toggleBulkMode();
}




