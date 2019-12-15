'use strict';
module.exports = (sequelize, DataTypes) => {
  const WishList = sequelize.define('WishList', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    idWOW: DataTypes.BIGINT,
    raid: DataTypes.STRING,
    loot: DataTypes.STRING,
  }, {});
  WishList.associate = function(models) {
    // associations can be defined here
  };
  return WishList;
};