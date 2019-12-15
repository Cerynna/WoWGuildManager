'use strict';
module.exports = (sequelize, DataTypes) => {
  const Raid = sequelize.define('Raid', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    idWOW: DataTypes.BIGINT,
    boss: DataTypes.STRING,
    // format: DataTypes.OBJECT,
  }, {});
  Raid.associate = function(models) {
    // associations can be defined here
  };
  return Raid;
};