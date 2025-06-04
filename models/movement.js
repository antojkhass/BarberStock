const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movement = sequelize.define('Movement', {
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'salida'),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'La cantidad debe ser mayor a 0' },
    },
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'movements',
  timestamps: false,
});


module.exports = Movement;
