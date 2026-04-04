const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function resetDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/superlatino', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado a MongoDB');
    console.log('🗑️  Eliminando base de datos...');
    
    await mongoose.connection.db.dropDatabase();
    
    console.log('✅ Base de datos eliminada completamente');
    console.log('💡 Ahora puedes ejecutar: npm run seed:full');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Desconectado');
    process.exit(0);
  }
}

resetDatabase();




