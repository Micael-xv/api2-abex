import { DataTypes } from 'sequelize';
import { sequelize } from '../config/config';
import Orders from './ordersModel'; //importando o model de pedidos
import Products from './productsModel'; //importando o model de produtos

const NomeTabela = sequelize.define(
  'nomeTabelaBanco',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, //auto incremento
    },
    priceProducts: {
      field: 'price_products',
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    idProduct: { //nome que vai ser chamado
      field: 'id_product',//nome real que está na tabela
      unique: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

NomeTabela.belongsTo(Orders, {
  as: 'order',
  onDelete: 'no action',
  onUpdate: 'no action',
  foreignKey: {
    field: 'id_order', //nome real que está na tabela
    name: 'idOrder', //nome que vai ser chamado
  },
});

NomeTabela.belongsTo(Products, {
  as: 'product',
  onDelete: 'no action',
  onUpdate: 'no action',
  foreignKey: {
    field: 'id_product',
    name: 'idProduct',
  },
});

export default NomeTabela;