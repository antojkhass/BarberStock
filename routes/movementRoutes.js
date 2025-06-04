const express = require('express');
const { Op } = require('sequelize');
const Movement = require('../models/movement');
const Product = require('../models/product');
const router = express.Router();

// Ruta para registrar un movimiento (entrada o salida)
router.post('/', async (req, res) => {
  try {
    const { id_producto, tipo, cantidad, descripcion } = req.body;

    // Validar el tipo de movimiento
    if (!['entrada', 'salida'].includes(tipo)) {
      return res.status(400).json({ message: 'Tipo de movimiento inválido. Debe ser "entrada" o "salida".' });
    }

    // Validar que el producto exista
    const product = await Product.findByPk(id_producto);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    if (cantidad <= 0){
      return res.status(400).json({message: 'La cantidad debe ser mayor a cero.'})
    }

    // Registrar el movimiento
    const movement = await Movement.create({
      id_producto,
      tipo,
      cantidad,
      descripcion,
    });

    // Actualizar el stock del producto
    if (tipo === 'entrada') {
      product.stock += cantidad;
    } else if (tipo === 'salida') {
      if (product.stock < cantidad) {
        return res.status(400).json({ message: 'Stock insuficiente para realizar la salida.' });
      }
      product.stock -= cantidad;
    }
    await product.save();

    res.status(201).json({ message: 'Movimiento registrado con éxito.', movement });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el movimiento.', error });
  }
});

// Ruta para obtener movimientos de un producto específico
router.get('/producto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movements = await Movement.findAll({ 
      where: { id_producto: id },
      include: {
        model: Product,
        attributes: ['nombre']
      }
    });
    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los movimientos del producto.', error });
  }
});


router.get('/', async (req, res) => {
  const { producto, fecha_inicio, fecha_fin } = req.query;
  const where = {};

  // Filtro por producto
  if (producto) {
    where.id_producto = producto;
  }

  // Filtro por rango de fechas
  if (fecha_inicio || fecha_fin) {
    where.fecha = {};
    if (fecha_inicio) where.fecha[Op.gte] = new Date(fecha_inicio);
    if (fecha_fin) {
  const finCompleto = new Date(fecha_fin);
  finCompleto.setUTCHours(23, 59, 59, 999);
  where.fecha[Op.lte] = finCompleto;
}
  }


  try {
    const movements = await Movement.findAll({
      where,
      include: {
        model: Product,
        attributes: ['nombre'],
      },
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los movimientos', error });
  }
});


module.exports = router;
