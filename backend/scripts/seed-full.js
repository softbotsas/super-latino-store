const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('../models/Department');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Service = require('../models/Service');

dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/superlatino', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// Función para generar slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Datos completos de departamentos
const departments = [
  { 
    name: 'Grocery', 
    slug: 'grocery',
    icon: '🛒', 
    color: '#10B981', 
    description: 'Comida, bebidas y productos frescos',
    order: 1
  },
  { 
    name: 'Pharmacy', 
    slug: 'pharmacy',
    icon: '💊', 
    color: '#EF4444', 
    description: 'Salud, bienestar y medicamentos',
    order: 2
  },
  { 
    name: 'Electronics', 
    slug: 'electronics',
    icon: '📱', 
    color: '#3B82F6', 
    description: 'Electrónicos, computadoras y tecnología',
    order: 3
  },
  { 
    name: 'Clothing', 
    slug: 'clothing',
    icon: '👕', 
    color: '#8B5CF6', 
    description: 'Ropa, zapatos y accesorios de moda',
    order: 4
  },
  { 
    name: 'Baby & Kids', 
    slug: 'baby-kids',
    icon: '👶', 
    color: '#F59E0B', 
    description: 'Todo para bebés, niños y maternidad',
    order: 5
  },
  { 
    name: 'Home & Garden', 
    slug: 'home-garden',
    icon: '🏡', 
    color: '#059669', 
    description: 'Hogar, jardín, muebles y herramientas',
    order: 6
  },
  { 
    name: 'Toys', 
    slug: 'toys',
    icon: '🎮', 
    color: '#EC4899', 
    description: 'Juguetes, juegos y entretenimiento',
    order: 7
  },
  { 
    name: 'Personal Care', 
    slug: 'personal-care',
    icon: '💄', 
    color: '#6366F1', 
    description: 'Cuidado personal, belleza y cosméticos',
    order: 8
  },
  { 
    name: 'Pets', 
    slug: 'pets',
    icon: '🐾', 
    color: '#F97316', 
    description: 'Comida y accesorios para mascotas',
    order: 9
  },
  { 
    name: 'Sports', 
    slug: 'sports',
    icon: '⚽', 
    color: '#14B8A6', 
    description: 'Deportes, fitness y actividades al aire libre',
    order: 10
  }
];

// Función principal
async function seedDatabase() {
  try {
    console.log('🗑️  Limpiando base de datos...');
    
    await Department.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Service.deleteMany({});

    console.log('✅ Base de datos limpiada');

    // Insertar departamentos
    console.log('📦 Insertando departamentos...');
    const createdDepartments = await Department.insertMany(departments);
    console.log(`✅ ${createdDepartments.length} departamentos insertados`);

    // Obtener departamentos para referencias
    const groceryDept = createdDepartments.find(d => d.name === 'Grocery');
    const pharmacyDept = createdDepartments.find(d => d.name === 'Pharmacy');
    const electronicsDept = createdDepartments.find(d => d.name === 'Electronics');
    const clothingDept = createdDepartments.find(d => d.name === 'Clothing');
    const babyDept = createdDepartments.find(d => d.name === 'Baby & Kids');
    const homeDept = createdDepartments.find(d => d.name === 'Home & Garden');
    const toysDept = createdDepartments.find(d => d.name === 'Toys');
    const personalDept = createdDepartments.find(d => d.name === 'Personal Care');
    const petsDept = createdDepartments.find(d => d.name === 'Pets');
    const sportsDept = createdDepartments.find(d => d.name === 'Sports');

    // Insertar categorías
    console.log('📂 Insertando categorías...');
    const categoriesData = [
      // Grocery
      { name: 'Frutas y Verduras', department: groceryDept._id, order: 1 },
      { name: 'Carnes y Mariscos', department: groceryDept._id, order: 2 },
      { name: 'Lácteos y Huevos', department: groceryDept._id, order: 3 },
      { name: 'Panadería', department: groceryDept._id, order: 4 },
      { name: 'Bebidas', department: groceryDept._id, order: 5 },
      { name: 'Snacks y Dulces', department: groceryDept._id, order: 6 },
      
      // Pharmacy
      { name: 'Medicamentos', department: pharmacyDept._id, order: 1 },
      { name: 'Vitaminas', department: pharmacyDept._id, order: 2 },
      { name: 'Primeros Auxilios', department: pharmacyDept._id, order: 3 },
      
      // Electronics
      { name: 'Smartphones', department: electronicsDept._id, order: 1 },
      { name: 'Laptops y Computadoras', department: electronicsDept._id, order: 2 },
      { name: 'Televisores', department: electronicsDept._id, order: 3 },
      { name: 'Audio', department: electronicsDept._id, order: 4 },
      
      // Clothing
      { name: 'Ropa de Mujer', department: clothingDept._id, order: 1 },
      { name: 'Ropa de Hombre', department: clothingDept._id, order: 2 },
      { name: 'Zapatos', department: clothingDept._id, order: 3 },
      
      // Baby & Kids
      { name: 'Pañales', department: babyDept._id, order: 1 },
      { name: 'Alimentación Bebé', department: babyDept._id, order: 2 },
      
      // Home & Garden
      { name: 'Muebles', department: homeDept._id, order: 1 },
      { name: 'Decoración', department: homeDept._id, order: 2 },
      { name: 'Herramientas', department: homeDept._id, order: 3 },
      
      // Toys
      { name: 'Juguetes Educativos', department: toysDept._id, order: 1 },
      { name: 'Videojuegos', department: toysDept._id, order: 2 },
      
      // Personal Care
      { name: 'Cuidado de la Piel', department: personalDept._id, order: 1 },
      { name: 'Cuidado del Cabello', department: personalDept._id, order: 2 },
      
      // Pets
      { name: 'Comida para Perros', department: petsDept._id, order: 1 },
      { name: 'Comida para Gatos', department: petsDept._id, order: 2 },
      
      // Sports
      { name: 'Fitness', department: sportsDept._id, order: 1 },
      { name: 'Deportes al Aire Libre', department: sportsDept._id, order: 2 }
    ];

    // Agregar slug a cada categoría
    const categories = categoriesData.map(cat => ({
      ...cat,
      slug: generateSlug(cat.name)
    }));

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categorías insertadas`);

    // Obtener categorías para productos
    const frutasCategory = createdCategories.find(c => c.name === 'Frutas y Verduras');
    const carnesCategory = createdCategories.find(c => c.name === 'Carnes y Mariscos');
    const lacteosCategory = createdCategories.find(c => c.name === 'Lácteos y Huevos');
    const bebidasCategory = createdCategories.find(c => c.name === 'Bebidas');
    const snacksCategory = createdCategories.find(c => c.name === 'Snacks y Dulces');
    const smartphonesCategory = createdCategories.find(c => c.name === 'Smartphones');
    const laptopsCategory = createdCategories.find(c => c.name === 'Laptops y Computadoras');
    const tvsCategory = createdCategories.find(c => c.name === 'Televisores');
    const medicamentosCategory = createdCategories.find(c => c.name === 'Medicamentos');
    const vitaminasCategory = createdCategories.find(c => c.name === 'Vitaminas');

    // Insertar MUCHOS productos
    console.log('🛍️  Insertando productos...');
    const products = [
      // GROCERY - Frutas y Verduras
      {
        name: 'Manzanas Rojas Orgánicas',
        description: 'Manzanas rojas frescas y crujientes, cultivadas orgánicamente. Perfectas para snacks saludables.',
        price: 3.99,
        originalPrice: 4.99,
        discount: 20,
        category: frutasCategory._id,
        department: groceryDept._id,
        stock: 150,
        sku: 'FRUIT-001',
        featured: true,
        rating: { average: 4.8, count: 156 },
        images: [{
          url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500',
          alt: 'Manzanas rojas orgánicas',
          isPrimary: true
        }],
        tags: ['orgánico', 'frutas', 'saludable']
      },
      {
        name: 'Aguacates Hass Premium',
        description: 'Aguacates Hass maduros y cremosos, ideales para guacamole y ensaladas.',
        price: 2.49,
        originalPrice: 2.99,
        discount: 17,
        category: frutasCategory._id,
        department: groceryDept._id,
        stock: 200,
        sku: 'FRUIT-002',
        featured: true,
        rating: { average: 4.9, count: 234 },
        images: [{
          url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500',
          alt: 'Aguacates Hass',
          isPrimary: true
        }],
        tags: ['aguacate', 'hass', 'fresco']
      },
      {
        name: 'Plátanos Frescos',
        description: 'Racimo de plátanos amarillos frescos, ricos en potasio y energía natural.',
        price: 1.99,
        category: frutasCategory._id,
        department: groceryDept._id,
        stock: 300,
        sku: 'FRUIT-003',
        featured: false,
        rating: { average: 4.5, count: 89 },
        images: [{
          url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500',
          alt: 'Plátanos frescos',
          isPrimary: true
        }],
        tags: ['plátano', 'energía', 'potasio']
      },
      {
        name: 'Tomates Cherry Orgánicos',
        description: 'Tomates cherry dulces y jugosos, perfectos para ensaladas y aperitivos.',
        price: 4.99,
        originalPrice: 5.99,
        discount: 17,
        category: frutasCategory._id,
        department: groceryDept._id,
        stock: 100,
        sku: 'FRUIT-004',
        featured: true,
        rating: { average: 4.7, count: 112 },
        images: [{
          url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500',
          alt: 'Tomates cherry',
          isPrimary: true
        }],
        tags: ['tomate', 'orgánico', 'ensalada']
      },
      {
        name: 'Lechuga Romana Fresca',
        description: 'Lechuga romana crujiente y nutritiva, ideal para ensaladas César.',
        price: 2.99,
        category: frutasCategory._id,
        department: groceryDept._id,
        stock: 120,
        sku: 'FRUIT-005',
        rating: { average: 4.4, count: 67 },
        images: [{
          url: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500',
          alt: 'Lechuga romana',
          isPrimary: true
        }],
        tags: ['lechuga', 'verdura', 'ensalada']
      },

      // GROCERY - Lácteos
      {
        name: 'Leche Entera Orgánica 1 Galón',
        description: 'Leche fresca orgánica de vacas alimentadas con pasto. Rica en calcio y vitaminas.',
        price: 5.99,
        originalPrice: 6.99,
        discount: 14,
        category: lacteosCategory._id,
        department: groceryDept._id,
        stock: 80,
        sku: 'DAIRY-001',
        featured: true,
        rating: { average: 4.8, count: 189 },
        images: [{
          url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500',
          alt: 'Leche orgánica',
          isPrimary: true
        }],
        tags: ['leche', 'orgánico', 'lácteos']
      },
      {
        name: 'Queso Cheddar Sharp',
        description: 'Queso cheddar añejo con sabor intenso, perfecto para sándwiches y quesadillas.',
        price: 7.99,
        category: lacteosCategory._id,
        department: groceryDept._id,
        stock: 60,
        sku: 'DAIRY-002',
        rating: { average: 4.6, count: 145 },
        images: [{
          url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500',
          alt: 'Queso cheddar',
          isPrimary: true
        }],
        tags: ['queso', 'cheddar', 'lácteos']
      },
      {
        name: 'Yogurt Griego Natural 32oz',
        description: 'Yogurt griego cremoso sin azúcar añadida, alto en proteínas.',
        price: 4.99,
        originalPrice: 5.99,
        discount: 17,
        category: lacteosCategory._id,
        department: groceryDept._id,
        stock: 90,
        sku: 'DAIRY-003',
        featured: true,
        rating: { average: 4.7, count: 203 },
        images: [{
          url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500',
          alt: 'Yogurt griego',
          isPrimary: true
        }],
        tags: ['yogurt', 'griego', 'proteína']
      },

      // GROCERY - Bebidas
      {
        name: 'Coca-Cola Pack 12 Latas',
        description: 'Refresco clásico Coca-Cola, pack de 12 latas de 12oz cada una.',
        price: 6.99,
        originalPrice: 7.99,
        discount: 13,
        category: bebidasCategory._id,
        department: groceryDept._id,
        stock: 200,
        sku: 'DRINK-001',
        featured: true,
        rating: { average: 4.9, count: 456 },
        images: [{
          url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500',
          alt: 'Coca-Cola',
          isPrimary: true
        }],
        tags: ['refresco', 'coca-cola', 'bebida']
      },
      {
        name: 'Agua Natural Crystal 24 Botellas',
        description: 'Agua purificada en botellas individuales de 16.9oz, pack de 24.',
        price: 4.99,
        category: bebidasCategory._id,
        department: groceryDept._id,
        stock: 150,
        sku: 'DRINK-002',
        rating: { average: 4.5, count: 234 },
        images: [{
          url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500',
          alt: 'Agua embotellada',
          isPrimary: true
        }],
        tags: ['agua', 'natural', 'hidratación']
      },
      {
        name: 'Jugo de Naranja Tropicana 89oz',
        description: 'Jugo de naranja 100% natural, sin azúcar añadida, rico en vitamina C.',
        price: 5.99,
        originalPrice: 6.99,
        discount: 14,
        category: bebidasCategory._id,
        department: groceryDept._id,
        stock: 70,
        sku: 'DRINK-003',
        featured: true,
        rating: { average: 4.8, count: 178 },
        images: [{
          url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500',
          alt: 'Jugo de naranja',
          isPrimary: true
        }],
        tags: ['jugo', 'naranja', 'vitamina C']
      },

      // ELECTRONICS - Smartphones
      {
        name: 'iPhone 15 Pro 256GB',
        description: 'Último modelo iPhone con chip A17 Pro, cámara de 48MP y pantalla Super Retina XDR.',
        price: 999.99,
        originalPrice: 1099.99,
        discount: 9,
        category: smartphonesCategory._id,
        department: electronicsDept._id,
        stock: 45,
        sku: 'ELEC-001',
        featured: true,
        rating: { average: 4.9, count: 567 },
        images: [{
          url: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500',
          alt: 'iPhone 15 Pro',
          isPrimary: true
        }],
        tags: ['iphone', 'smartphone', 'apple']
      },
      {
        name: 'Samsung Galaxy S24 Ultra 512GB',
        description: 'Smartphone premium con S Pen, cámara de 200MP y pantalla Dynamic AMOLED 2X.',
        price: 1199.99,
        originalPrice: 1299.99,
        discount: 8,
        category: smartphonesCategory._id,
        department: electronicsDept._id,
        stock: 35,
        sku: 'ELEC-002',
        featured: true,
        rating: { average: 4.8, count: 423 },
        images: [{
          url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
          alt: 'Samsung Galaxy S24',
          isPrimary: true
        }],
        tags: ['samsung', 'galaxy', 'android']
      },
      {
        name: 'Google Pixel 8 Pro 256GB',
        description: 'Smartphone con lo mejor de Google AI, cámara profesional y Android puro.',
        price: 899.99,
        originalPrice: 999.99,
        discount: 10,
        category: smartphonesCategory._id,
        department: electronicsDept._id,
        stock: 50,
        sku: 'ELEC-003',
        featured: false,
        rating: { average: 4.7, count: 289 },
        images: [{
          url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
          alt: 'Google Pixel 8',
          isPrimary: true
        }],
        tags: ['google', 'pixel', 'android']
      },

      // ELECTRONICS - Laptops
      {
        name: 'MacBook Pro 14" M3 Pro',
        description: 'Laptop profesional con chip M3 Pro, 18GB RAM, 512GB SSD, pantalla Liquid Retina XDR.',
        price: 1999.99,
        originalPrice: 2199.99,
        discount: 9,
        category: laptopsCategory._id,
        department: electronicsDept._id,
        stock: 25,
        sku: 'ELEC-004',
        featured: true,
        rating: { average: 4.9, count: 334 },
        images: [{
          url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
          alt: 'MacBook Pro',
          isPrimary: true
        }],
        tags: ['macbook', 'laptop', 'apple']
      },
      {
        name: 'Dell XPS 15 Intel i7',
        description: 'Laptop premium con pantalla 4K, Intel i7-13700H, 32GB RAM, 1TB SSD.',
        price: 1599.99,
        originalPrice: 1799.99,
        discount: 11,
        category: laptopsCategory._id,
        department: electronicsDept._id,
        stock: 30,
        sku: 'ELEC-005',
        featured: true,
        rating: { average: 4.7, count: 267 },
        images: [{
          url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
          alt: 'Dell XPS',
          isPrimary: true
        }],
        tags: ['dell', 'laptop', 'windows']
      },

      // ELECTRONICS - TVs
      {
        name: 'Samsung 65" QLED 4K Smart TV',
        description: 'TV QLED con Quantum HDR, Gaming Hub y diseño ultra delgado.',
        price: 899.99,
        originalPrice: 1199.99,
        discount: 25,
        category: tvsCategory._id,
        department: electronicsDept._id,
        stock: 20,
        sku: 'ELEC-006',
        featured: true,
        rating: { average: 4.8, count: 456 },
        images: [{
          url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
          alt: 'Samsung QLED TV',
          isPrimary: true
        }],
        tags: ['tv', 'samsung', '4k', 'smart']
      },
      {
        name: 'LG 55" OLED 4K Smart TV',
        description: 'TV OLED con negros perfectos, Dolby Vision IQ y webOS.',
        price: 1299.99,
        originalPrice: 1499.99,
        discount: 13,
        category: tvsCategory._id,
        department: electronicsDept._id,
        stock: 15,
        sku: 'ELEC-007',
        featured: true,
        rating: { average: 4.9, count: 389 },
        images: [{
          url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500',
          alt: 'LG OLED TV',
          isPrimary: true
        }],
        tags: ['tv', 'lg', 'oled', '4k']
      },

      // PHARMACY - Medicamentos
      {
        name: 'Tylenol Extra Strength 500mg - 100 Cápsulas',
        description: 'Analgésico y antipirético para alivio del dolor y fiebre.',
        price: 12.99,
        originalPrice: 14.99,
        discount: 13,
        category: medicamentosCategory._id,
        department: pharmacyDept._id,
        stock: 150,
        sku: 'PHARM-001',
        featured: true,
        rating: { average: 4.7, count: 289 },
        images: [{
          url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
          alt: 'Tylenol',
          isPrimary: true
        }],
        tags: ['medicina', 'dolor', 'fiebre']
      },
      {
        name: 'Advil Ibuprofen 200mg - 100 Tabletas',
        description: 'Antiinflamatorio no esteroideo para dolor, fiebre e inflamación.',
        price: 11.99,
        category: medicamentosCategory._id,
        department: pharmacyDept._id,
        stock: 120,
        sku: 'PHARM-002',
        rating: { average: 4.6, count: 234 },
        images: [{
          url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500',
          alt: 'Advil',
          isPrimary: true
        }],
        tags: ['medicina', 'antiinflamatorio', 'dolor']
      },

      // PHARMACY - Vitaminas
      {
        name: 'Centrum MultiVitamínico Adultos 200 Tabletas',
        description: 'Multivitamínico completo con vitaminas y minerales esenciales.',
        price: 24.99,
        originalPrice: 29.99,
        discount: 17,
        category: vitaminasCategory._id,
        department: pharmacyDept._id,
        stock: 100,
        sku: 'PHARM-003',
        featured: true,
        rating: { average: 4.8, count: 456 },
        images: [{
          url: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500',
          alt: 'Centrum',
          isPrimary: true
        }],
        tags: ['vitaminas', 'suplemento', 'salud']
      },
      {
        name: 'Vitamina D3 5000 IU - 360 Cápsulas',
        description: 'Suplemento de vitamina D3 para huesos y sistema inmune fuertes.',
        price: 19.99,
        originalPrice: 24.99,
        discount: 20,
        category: vitaminasCategory._id,
        department: pharmacyDept._id,
        stock: 90,
        sku: 'PHARM-004',
        featured: true,
        rating: { average: 4.7, count: 334 },
        images: [{
          url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
          alt: 'Vitamina D3',
          isPrimary: true
        }],
        tags: ['vitamina d', 'suplemento', 'inmunidad']
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} productos insertados`);

    // Insertar servicios
    console.log('⚡ Insertando servicios...');
    const servicesData = [
      {
        name: 'Transferencias de Dinero Internacionales',
        category: 'money-transfers',
        description: 'Envía dinero a tus seres queridos en cualquier país de forma rápida y segura. Tarifas bajas y cambio competitivo.',
        icon: '💰',
        price: 5.99,
        pricingType: 'variable',
        featured: true,
        order: 1,
        features: [
          { title: 'Envíos Rápidos', description: 'Disponible en minutos', icon: '⚡' },
          { title: 'Seguro 100%', description: 'Garantía de entrega', icon: '🔒' },
          { title: 'Global', description: 'A más de 200 países', icon: '🌍' },
          { title: 'Tarifas Bajas', description: 'Desde $5.99', icon: '💵' }
        ],
        requirements: ['Identificación válida', 'Información del receptor'],
        isActive: true
      },
      {
        name: 'Recargas de Celular USA',
        category: 'cell-phone-topups',
        description: 'Recarga tu celular o el de tu familia instantáneamente. Todas las compañías: AT&T, T-Mobile, Verizon, Metro PCS.',
        icon: '📱',
        price: 0,
        pricingType: 'variable',
        featured: true,
        order: 2,
        features: [
          { title: 'Instantáneo', description: 'En segundos', icon: '⚡' },
          { title: 'Todas las Compañías', description: 'AT&T, Verizon, T-Mobile', icon: '📡' },
          { title: 'Sin Comisión', description: 'Paga solo lo que recargas', icon: '💳' }
        ],
        requirements: ['Número de teléfono'],
        isActive: true
      },
      {
        name: 'Recargas Internacionales',
        category: 'international-topups',
        description: 'Recarga celulares en México, Colombia, Guatemala, Honduras, El Salvador y más países de Latinoamérica.',
        icon: '🌎',
        price: 0,
        pricingType: 'variable',
        featured: true,
        order: 3,
        features: [
          { title: 'Latinoamérica', description: 'Todos los países', icon: '🌎' },
          { title: 'Rápido', description: 'Entrega inmediata', icon: '⚡' },
          { title: 'Confiable', description: 'Miles de recargas diarias', icon: '✅' }
        ],
        requirements: ['Número de teléfono internacional'],
        isActive: true
      },
      {
        name: 'Pago de Servicios y Utilidades',
        category: 'utility-payments',
        description: 'Paga tus recibos de luz, agua, gas, internet, cable TV y más servicios desde un solo lugar.',
        icon: '💳',
        price: 2.99,
        pricingType: 'fixed',
        featured: true,
        order: 4,
        features: [
          { title: 'Todo en Uno', description: 'Todos tus servicios', icon: '📋' },
          { title: 'Recordatorios', description: 'Nunca olvides pagar', icon: '🔔' },
          { title: 'Historial', description: 'Rastrea tus pagos', icon: '📊' }
        ],
        requirements: ['Número de cuenta del servicio'],
        isActive: true
      },
      {
        name: 'Money Orders',
        category: 'money-order',
        description: 'Obtén money orders de forma segura para pagos de renta, servicios o cualquier transacción.',
        icon: '💵',
        price: 1.50,
        pricingType: 'fixed',
        featured: false,
        order: 5,
        features: [
          { title: 'Seguro', description: 'Método de pago confiable', icon: '🔒' },
          { title: 'Aceptado', description: 'En todas partes', icon: '✅' }
        ],
        requirements: ['Efectivo o tarjeta'],
        isActive: true
      },
      {
        name: 'Activación de Líneas Celulares',
        category: 'cell-phone-activations',
        description: 'Activa tu línea celular con nosotros. Todos los carriers disponibles, asesoría gratuita.',
        icon: '📲',
        price: 25.00,
        pricingType: 'fixed',
        featured: false,
        order: 6,
        features: [
          { title: 'Asesoría Gratis', description: 'Te ayudamos a elegir', icon: '💁' },
          { title: 'Rápido', description: 'Activación inmediata', icon: '⚡' },
          { title: 'Todos los Planes', description: 'Pre y postpago', icon: '📱' }
        ],
        requirements: ['Identificación', 'Teléfono compatible'],
        isActive: true
      },
      {
        name: 'Recargas de Llamadas Internacionales',
        category: 'international-call-topups',
        description: 'Recarga minutos para llamadas internacionales a tarifas muy económicas.',
        icon: '☎️',
        price: 0,
        pricingType: 'variable',
        featured: false,
        order: 7,
        features: [
          { title: 'Económico', description: 'Mejores tarifas', icon: '💰' },
          { title: 'Calidad', description: 'Llamadas claras', icon: '📞' }
        ],
        requirements: ['Número de PIN o cuenta'],
        isActive: true
      },
      {
        name: 'Pago de Renta',
        category: 'rent-payments',
        description: 'Paga tu renta de forma segura con money order o transferencia. Servicio rápido y confiable.',
        icon: '🏠',
        price: 3.99,
        pricingType: 'fixed',
        featured: true,
        order: 8,
        features: [
          { title: 'Confiable', description: 'Comprobante oficial', icon: '📄' },
          { title: 'Rápido', description: 'Mismo día', icon: '⚡' }
        ],
        requirements: ['Información del propietario'],
        isActive: true
      },
      {
        name: 'Servicios de Seguro',
        category: 'insurance-services',
        description: 'Cotiza y contrata seguros de auto, hogar, vida y salud. Asesoría en español.',
        icon: '🛡️',
        price: 0,
        pricingType: 'free',
        featured: true,
        order: 9,
        features: [
          { title: 'Cotización Gratis', description: 'Sin compromiso', icon: '📝' },
          { title: 'En Español', description: 'Asesoría completa', icon: '🗣️' },
          { title: 'Múltiples Opciones', description: 'Comparamos precios', icon: '🔍' }
        ],
        requirements: ['Información personal básica'],
        isActive: true
      },
      {
        name: 'IPTV Television en Streaming',
        category: 'iptv-television',
        description: 'Servicio de televisión por internet con canales de USA y Latinoamérica. Películas, deportes y más.',
        icon: '📺',
        price: 19.99,
        pricingType: 'fixed',
        featured: true,
        order: 10,
        features: [
          { title: 'Canales HD', description: 'Alta calidad', icon: '🎬' },
          { title: 'Deportes', description: 'Todos los eventos', icon: '⚽' },
          { title: 'Películas', description: 'Miles de títulos', icon: '🎥' },
          { title: 'Sin Contrato', description: 'Cancela cuando quieras', icon: '✅' }
        ],
        requirements: ['Internet de alta velocidad'],
        isActive: true
      },
      {
        name: 'Gift Cards y Tarjetas de Regalo',
        category: 'gift-cards',
        description: 'Compra gift cards de tus tiendas favoritas: Amazon, Walmart, iTunes, Google Play, PlayStation y más.',
        icon: '🎁',
        price: 0,
        pricingType: 'variable',
        featured: false,
        order: 11,
        features: [
          { title: 'Variedad', description: 'Cientos de opciones', icon: '🛍️' },
          { title: 'Digitales', description: 'Entrega instantánea', icon: '⚡' },
          { title: 'Físicas', description: 'También disponibles', icon: '💳' }
        ],
        requirements: [],
        isActive: true
      },
      {
        name: 'Publicidad y Marketing Digital',
        category: 'advertising-services',
        description: 'Impulsa tu negocio con publicidad en redes sociales, Google Ads y diseño gráfico profesional.',
        icon: '📢',
        price: 99.99,
        pricingType: 'variable',
        featured: false,
        order: 12,
        features: [
          { title: 'Redes Sociales', description: 'Facebook, Instagram, TikTok', icon: '📱' },
          { title: 'Google Ads', description: 'Llega a más clientes', icon: '🔍' },
          { title: 'Diseño', description: 'Gráficos profesionales', icon: '🎨' }
        ],
        requirements: ['Consulta inicial'],
        isActive: true
      },
      {
        name: 'Gestión de Redes Sociales',
        category: 'social-media-management',
        description: 'Administramos tus redes sociales profesionalmente. Contenido, diseño y crecimiento garantizado.',
        icon: '📱',
        price: 299.99,
        pricingType: 'fixed',
        featured: false,
        order: 13,
        features: [
          { title: 'Contenido Diario', description: 'Posts profesionales', icon: '📝' },
          { title: 'Diseño', description: 'Imágenes y videos', icon: '🎨' },
          { title: 'Reportes', description: 'Análisis mensual', icon: '📊' },
          { title: 'Crecimiento', description: 'Más seguidores', icon: '📈' }
        ],
        requirements: ['Acceso a redes sociales'],
        isActive: true
      }
    ];

    // Agregar slug a cada servicio
    const services = servicesData.map(serv => ({
      ...serv,
      slug: generateSlug(serv.name)
    }));

    const createdServices = await Service.insertMany(services);
    console.log(`✅ ${createdServices.length} servicios insertados`);

    // Actualizar estadísticas de departamentos
    for (const dept of createdDepartments) {
      const categoryCount = await Category.countDocuments({ department: dept._id });
      const productCount = await Product.countDocuments({ department: dept._id });
      
      await Department.findByIdAndUpdate(dept._id, {
        'stats.categoryCount': categoryCount,
        'stats.productCount': productCount
      });
    }

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📊 Resumen Final:');
    console.log(`   ✅ Departamentos: ${createdDepartments.length}`);
    console.log(`   ✅ Categorías: ${createdCategories.length}`);
    console.log(`   ✅ Productos: ${createdProducts.length}`);
    console.log(`   ✅ Servicios: ${createdServices.length}`);
    console.log(`\n🛍️  Productos por departamento:`);
    console.log(`   - Grocery: ${products.filter(p => p.department.equals(groceryDept._id)).length}`);
    console.log(`   - Electronics: ${products.filter(p => p.department.equals(electronicsDept._id)).length}`);
    console.log(`   - Pharmacy: ${products.filter(p => p.department.equals(pharmacyDept._id)).length}`);

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Desconectado de MongoDB');
    process.exit(0);
  }
}

// Ejecutar el seed
seedDatabase();

