// Sistema de Upload de Imágenes (Simulado con URLs)
// En producción, esto se conectaría a Cloudinary o AWS S3

class ImageUploader {
  constructor() {
    this.uploadedImages = [];
  }

  // Simular upload de imagen
  async uploadImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageData = {
          url: e.target.result, // Base64 data URL
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date()
        };
        
        this.uploadedImages.push(imageData);
        resolve(imageData);
      };
      
      reader.readAsDataURL(file);
    });
  }

  // Obtener todas las imágenes
  getImages() {
    return this.uploadedImages;
  }

  // Eliminar imagen
  deleteImage(url) {
    this.uploadedImages = this.uploadedImages.filter(img => img.url !== url);
  }
}

// Instancia global
const imageUploader = new ImageUploader();

// Funciones auxiliares para URLs de placeholder
function getPlaceholderImage(category) {
  const placeholders = {
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
    'grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    'pharmacy': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
    'clothing': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500',
    'default': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
  };
  
  return placeholders[category] || placeholders.default;
}

// Sugerir URLs de imágenes por nombre de producto
function suggestImageUrl(productName) {
  const searchTerm = productName.toLowerCase();
  
  const suggestions = {
    'iphone': 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500',
    'samsung': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
    'macbook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    'laptop': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
    'tv': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
    'leche': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500',
    'manzana': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500',
    'aguacate': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500',
    'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500',
    'queso': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500'
  };

  for (const [key, url] of Object.entries(suggestions)) {
    if (searchTerm.includes(key)) {
      return url;
    }
  }

  return getPlaceholderImage('default');
}

// Export para usar en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ImageUploader,
    imageUploader,
    getPlaceholderImage,
    suggestImageUrl
  };
}




