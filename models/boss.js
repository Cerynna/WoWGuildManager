'use strict';
module.exports = (sequelize, DataTypes) => {
  const Boss = sequelize.define('Boss', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    idWOW: DataTypes.BIGINT,
    raid: DataTypes.STRING,
    loot: DataTypes.STRING,
  }, {});
  Boss.associate = function(models) {
    // associations can be defined here
  };
  return Boss;
};