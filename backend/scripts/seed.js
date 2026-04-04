const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('../models/Department');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Service = require('../models/Service');
const User = require('../models/User');

dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/superlatino', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// Datos de departamentos
const departments = [
  { name: 'Grocery', icon: '🛒', color: '#10B981', description: 'Comida y bebidas' },
  { name: 'Pharmacy', icon: '💊', color: '#EF4444', description: 'Salud y bienestar' },
  { name: 'Electronics', icon: '📱', color: '#3B82F6', description: 'Electrónicos y tecnología' },
  { name: 'Clothing', icon: '👕', color: '#8B5CF6', description: 'Ropa, zapatos y accesorios' },
  { name: 'Baby & Kids', icon: '👶', color: '#F59E0B', description: 'Productos para bebés y niños' },
  { name: 'Home & Garden', icon: '🏡', color: '#059669', description: 'Hogar, jardín y herramientas' },
  { name: 'Toys', icon: '🎮', color: '#EC4899', description: 'Juguetes y juegos' },
  { name: 'Personal Care', icon: '💄', color: '#6366F1', description: 'Cuidado personal' },
  { name: 'Pets', icon: '🐾', color: '#F97316', description: 'Productos para mascotas' },
  { name: 'Sports', icon: '⚽', color: '#14B8A6', description: 'Deportes y actividades al aire libre' }
];

// Datos de servicios
const services = [
  {
    name: 'Transferencias de Dinero',
    category: 'money-transfers',
    description: 'Envía dinero a tus seres queridos de forma rápida y segura',
    icon: '💰',
    price: 5.99,
    pricingType: 'variable',
    featured: true,
    features: [
      { title: 'Envíos rápidos', description: 'En minutos', icon: '⚡' },
      { title: 'Seguro', description: '100% garantizado', icon: '🔒' },
      { title: 'Global', description: 'A cualquier país', icon: '🌍' }
    ]
  },
  {
    name: 'Recargas de Celular',
    category: 'cell-phone-topups',
    description: 'Recarga tu celular o el de tu familia instantáneamente',
    icon: '📱',
    price: 0,
    pricingType: 'variable',
    featured: true,
    features: [
      { title: 'Instantáneo', description: 'En segundos', icon: '⚡' },
      { title: 'Todas las compañías', description: 'AT&T, Verizon, T-Mobile', icon: '📡' }
    ]
  },
  {
    name: 'Pago de Servicios',
    category: 'utility-payments',
    description: 'Paga tus recibos de luz, agua, gas y más',
    icon: '💳',
    price: 2.99,
    pricingType: 'fixed',
    featured: true
  },
  {
    name: 'Money Orders',
    category: 'money-order',
    description: 'Obtén money orders de forma segura',
    icon: '💵',
    price: 1.50,
    pricingType: 'fixed'
  },
  {
    name: 'Activación de Celulares',
    category: 'cell-phone-activations',
    description: 'Activa tu línea celular con nosotros',
    icon: '📲',
    price: 25,
    pricingType: 'fixed'
  },
  {
    name: 'IPTV Television',
    category: 'iptv-television',
    description: 'Servicio de televisión por internet',
    icon: '📺',
    price: 19.99,
    pricingType: 'fixed',
    featured: true
  }
];

// Función para limpiar y poblar la base de datos
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

    // Insertar categorías (ejemplos)
    console.log('📂 Insertando categorías...');
    const groceryDept = createdDepartments.find(d => d.name === 'Grocery');
    const electronicsDept = createdDepartments.find(d => d.name === 'Electronics');
    
    const categories = [
      { name: 'Frutas y Verduras', department: groceryDept._id },
      { name: 'Carnes y Mariscos', department: groceryDept._id },
      { name: 'Lácteos', department: groceryDept._id },
      { name: 'Smartphones', department: electronicsDept._id },
      { name: 'Laptops', department: electronicsDept._id },
      { name: 'Televisores', department: electronicsDept._id }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categorías insertadas`);

    // Insertar productos de ejemplo
    console.log('🛍️  Insertando productos...');
    const frutasCategory = createdCategories.find(c => c.name === 'Frutas y Verduras');
    const smartphonesCategory = createdCategories.find(c => c.name === 'Smartphones');

    const products = [
      {
        name: 'Manzanas Rojas',
        description: 'Manzanas frescas y jugosas',
        price: 3.99,
        originalPrice: 4.99,
        discount: 20,
        category: frutasCategory._id,
        department: groceryDept._id,
        stock: 100,
        sku: 'FRUIT-001',
        featured: true,
        rating: { average: 4.5, count: 25 },
        images: [{
          url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb',
          alt: 'Manzanas rojas',
          isPrimary: true
        }]
      },
      {
        name: 'iPhone 14 Pro',
        description: 'Último modelo de iPhone con cámara avanzada',
        price: 999.99,
        originalPrice: 1099.99,
        discount: 9,
        category: smartphonesCategory._id,
        department: electronicsDept._id,
        stock: 25,
        sku: 'ELEC-001',
        featured: true,
        rating: { average: 4.8, count: 150 },
        images: [{
          url: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb',
          alt: 'iPhone 14 Pro',
          isPrimary: true
        }]
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} productos insertados`);

    // Insertar servicios
    console.log('⚡ Insertando servicios...');
    const createdServices = await Service.insertMany(services);
    console.log(`✅ ${createdServices.length} servicios insertados`);

    // Crear usuario administrador
    console.log('👤 Creando usuario administrador...');
    try {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (!existingAdmin) {
        const adminUser = new User({
          username: 'admin',
          email: 'admin@superlatino.com',
          password: 'admin123', // Cambiar en producción
          role: 'admin'
        });
        await adminUser.save();
        console.log('✅ Usuario administrador creado:');
        console.log('   Email: admin@superlatino.com');
        console.log('   Contraseña: admin123');
        console.log('   ⚠️  IMPORTANTE: Cambia la contraseña después del primer login!');
      } else {
        console.log('ℹ️  Usuario administrador ya existe');
      }
    } catch (error) {
      console.error('❌ Error creando usuario administrador:', error);
    }

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - Departamentos: ${createdDepartments.length}`);
    console.log(`   - Categorías: ${createdCategories.length}`);
    console.log(`   - Productos: ${createdProducts.length}`);
    console.log(`   - Servicios: ${createdServices.length}`);

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




