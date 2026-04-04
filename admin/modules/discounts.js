// Sistema de Códigos de Descuento
class DiscountManager {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.discounts = [];
  }

  // Crear código de descuento
  async createDiscount(discountData) {
    try {
      const response = await fetch(`${this.apiUrl}/discounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discountData)
      });
      
      if (!response.ok) {
        // Si el endpoint no existe aún, simulamos localmente
        const newDiscount = {
          _id: Date.now().toString(),
          ...discountData,
          createdAt: new Date(),
          isActive: true
        };
        this.discounts.push(newDiscount);
        this.saveToLocalStorage();
        return newDiscount;
      }
      
      return await response.json();
    } catch (error) {
      // Modo offline - guardar localmente
      const newDiscount = {
        _id: Date.now().toString(),
        ...discountData,
        createdAt: new Date(),
        isActive: true
      };
      this.discounts.push(newDiscount);
      this.saveToLocalStorage();
      return newDiscount;
    }
  }

  // Obtener todos los descuentos
  async getDiscounts() {
    try {
      const response = await fetch(`${this.apiUrl}/discounts`);
      if (!response.ok) throw new Error('API not available');
      const data = await response.json();
      this.discounts = data.data || [];
      return this.discounts;
    } catch (error) {
      // Cargar desde localStorage
      this.loadFromLocalStorage();
      return this.discounts;
    }
  }

  // Actualizar descuento
  async updateDiscount(id, updates) {
    try {
      const response = await fetch(`${this.apiUrl}/discounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        // Actualizar localmente
        const index = this.discounts.findIndex(d => d._id === id);
        if (index !== -1) {
          this.discounts[index] = { ...this.discounts[index], ...updates };
          this.saveToLocalStorage();
        }
        return this.discounts[index];
      }
      
      return await response.json();
    } catch (error) {
      const index = this.discounts.findIndex(d => d._id === id);
      if (index !== -1) {
        this.discounts[index] = { ...this.discounts[index], ...updates };
        this.saveToLocalStorage();
      }
      return this.discounts[index];
    }
  }

  // Eliminar descuento
  async deleteDiscount(id) {
    try {
      await fetch(`${this.apiUrl}/discounts/${id}`, { method: 'DELETE' });
    } catch (error) {
      // Eliminar localmente
      this.discounts = this.discounts.filter(d => d._id !== id);
      this.saveToLocalStorage();
    }
  }

  // Validar código de descuento
  validateCode(code) {
    const discount = this.discounts.find(d => 
      d.code === code && 
      d.isActive &&
      (!d.expiryDate || new Date(d.expiryDate) > new Date()) &&
      (!d.usageLimit || d.timesUsed < d.usageLimit)
    );
    return discount || null;
  }

  // Generar código aleatorio
  generateRandomCode(length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // LocalStorage helpers
  saveToLocalStorage() {
    localStorage.setItem('discounts', JSON.stringify(this.discounts));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('discounts');
    this.discounts = saved ? JSON.parse(saved) : [];
  }
}

// Renderizar lista de descuentos
function renderDiscountsList(discounts) {
  const container = document.getElementById('discountsContainer');
  if (!container) return;

  if (discounts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No hay códigos de descuento creados</p>
        <button onclick="showDiscountModal()" class="btn-primary">
          Crear Primer Código
        </button>
      </div>
    `;
    return;
  }

  const html = discounts.map(discount => `
    <div class="discount-card">
      <div class="discount-header">
        <div class="discount-code">${discount.code}</div>
        <span class="badge badge-${discount.isActive ? 'success' : 'danger'}">
          ${discount.isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      
      <div class="discount-body">
        <div class="discount-info">
          <span class="discount-label">Tipo:</span>
          <span>${discount.type === 'percentage' ? 'Porcentaje' : 'Monto Fijo'}</span>
        </div>
        
        <div class="discount-info">
          <span class="discount-label">Descuento:</span>
          <span class="discount-value">
            ${discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
          </span>
        </div>
        
        ${discount.minPurchase ? `
          <div class="discount-info">
            <span class="discount-label">Compra mínima:</span>
            <span>$${discount.minPurchase}</span>
          </div>
        ` : ''}
        
        ${discount.expiryDate ? `
          <div class="discount-info">
            <span class="discount-label">Expira:</span>
            <span>${new Date(discount.expiryDate).toLocaleDateString()}</span>
          </div>
        ` : ''}
        
        ${discount.usageLimit ? `
          <div class="discount-info">
            <span class="discount-label">Usos:</span>
            <span>${discount.timesUsed || 0} / ${discount.usageLimit}</span>
          </div>
        ` : ''}
      </div>
      
      <div class="discount-actions">
        <button onclick="editDiscount('${discount._id}')" class="btn-icon" title="Editar">
          ✏️
        </button>
        <button onclick="toggleDiscountStatus('${discount._id}')" class="btn-icon" title="${discount.isActive ? 'Desactivar' : 'Activar'}">
          ${discount.isActive ? '⏸️' : '▶️'}
        </button>
        <button onclick="deleteDiscount('${discount._id}')" class="btn-icon btn-danger" title="Eliminar">
          🗑️
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

// Mostrar modal para crear/editar descuento
function showDiscountModal(discountId = null) {
  const modal = document.getElementById('discountModal');
  const form = document.getElementById('discountForm');
  const title = document.getElementById('discountModalTitle');
  
  if (!modal) return;

  if (discountId) {
    title.textContent = 'Editar Código de Descuento';
    // Cargar datos del descuento
    const discount = discountManager.discounts.find(d => d._id === discountId);
    if (discount) {
      form.code.value = discount.code;
      form.type.value = discount.type;
      form.value.value = discount.value;
      form.minPurchase.value = discount.minPurchase || '';
      form.usageLimit.value = discount.usageLimit || '';
      form.expiryDate.value = discount.expiryDate ? discount.expiryDate.split('T')[0] : '';
      form.description.value = discount.description || '';
    }
    form.dataset.editId = discountId;
  } else {
    title.textContent = 'Crear Código de Descuento';
    form.reset();
    delete form.dataset.editId;
    // Generar código automático
    form.code.value = discountManager.generateRandomCode();
  }

  modal.classList.add('active');
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DiscountManager, renderDiscountsList, showDiscountModal };
}




