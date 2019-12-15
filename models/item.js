'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    idWoW: DataTypes.BIGINT,
    icon: DataTypes.STRING,
    boss: DataTypes.STRING,
    prio: DataTypes.STRING,
  }, {});
  Item.associate = function(models) {
    // associations can be defined here
  };
  return Item;
};