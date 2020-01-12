'use strict';
module.exports = (sequelize, DataTypes) => {
  const Raid = sequelize.define('Raid', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idWOW: DataTypes.BIGINT,
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    boss: DataTypes.STRING,
    img: DataTypes.STRING,
    // format: DataTypes.OBJECT,
  }, {});
  Raid.associate = function(models) {
    // associations can be defined here
  };
  return Raid;
};