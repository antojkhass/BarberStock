const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre no puede estar vacío' }
    }
  },
    codigo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre no puede estar vacío' }
    }
  },
  precio_costo: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: { msg: 'El precio de costo debe ser un número válido' },
      min: { args: [0], msg: 'El precio de costo no puede ser negativo' },
    }
  },
  precio_venta: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: { msg: 'El precio de venta debe ser un número válido' },
      min: { args: [0], msg: 'El precio de venta no puede ser negativo' },
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: { msg: 'El stock debe ser un número entero' },
      min: { args: [0], msg: 'El stock no puede ser negativo' },
    }
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'products',
  timestamps: false, 
});


module.exports = Product;
