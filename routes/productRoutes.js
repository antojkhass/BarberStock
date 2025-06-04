const express = require('express');
const Product = require('../models/product'); 
const router = express.Router();

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, codigo, categoria, precio_costo, precio_venta, stock } = req.body;
    const newProduct = await Product.create({
      nombre,
      codigo,
      categoria,
      precio_costo,
      precio_venta,
      stock,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ message: 'Error de validación', errors: messages });
    }
    res.status(500).json({ message: 'Error al agregar el producto', error });
  }
});

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
});

// Ruta para obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
});


// Ruta para actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, codigo, categoria, precio_costo, precio_venta, stock } = req.body;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await product.update({
      nombre,
      codigo,
      categoria,
      precio_costo,
      precio_venta,
      stock,
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
});

// Ruta para eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
});

module.exports = router;
