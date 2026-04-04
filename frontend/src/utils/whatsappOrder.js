const WHATSAPP_NUMBER = '18038886188'

function normalizeText(value) {
  return String(value || '').trim()
}

function toCurrency(value) {
  const amount = Number(value || 0)
  return amount.toFixed(2)
}

export function buildWhatsAppOrderUrl(product, options = {}) {
  const quantity = Number(options.quantity || 1)
  const size = normalizeText(options.size)

  const lines = [
    'Hola! Quiero hacer un pedido por WhatsApp.',
    '',
    `Producto: ${normalizeText(product?.name)}`,
    `SKU: ${normalizeText(product?.sku) || 'N/A'}`,
    `Precio: $${toCurrency(product?.price)}`,
    `Cantidad: ${quantity}`
  ]

  if (size) {
    lines.push(`Talla: ${size}`)
  }

  if (product?.salesChannel === 'virtual') {
    lines.push('Canal: Tienda virtual')
  }

  lines.push('')
  lines.push('Direccion de tienda: 10171 Two Notch Rd Suite A, Columbia, SC 29229')

  const message = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

export function openWhatsAppOrder(product, options = {}) {
  const url = buildWhatsAppOrderUrl(product, options)
  window.open(url, '_blank', 'noopener,noreferrer')
}
