const express = require('express');
const sequelize = require('./config/database');
const Product = require('./models/product');
const Movement = require('./models/movement');
const productRoutes = require('./routes/productRoutes');
const movementRoutes = require('./routes/movementRoutes');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;





//Habilitar CORS
app.use(cors());

// Middleware para manejar JSON
app.use(express.json());

// Definir las relaciones
Product.hasMany(Movement, { foreignKey: 'id_producto' });
Movement.belongsTo(Product, { foreignKey: 'id_producto' });

// Sincronizar base de datos
sequelize.sync({ alter: true }) // sequelize.sync({ force: true }); -- Para borrar todo de la base de datos
                                
  .then(() => console.log('Base de datos sincronizada'))
  .catch((error) => console.error('Error al sincronizar la base de datos:', error));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Sincronizar base de datos
sequelize.sync({ force: false })
  .then(() => console.log('Base de datos sincronizada'))
  .catch((error) => console.error('Error al sincronizar la base de datos:', error));

// Configurar rutas de la API
app.use('/api/products', productRoutes);
app.use('/api/movements', movementRoutes);

// Servir el archivo index.html para la ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});









