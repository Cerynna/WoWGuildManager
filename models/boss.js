'use strict';
module.exports = (sequelize, DataTypes) => {
  const Boss = sequelize.define('Boss', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    idWOW: DataTypes.BIGINT,
    raid: DataTypes.STRING,
    tag: DataTypes.STRING,
    loot: {
      type: DataTypes.STRING,
      get() {
        return JSON.parse(this.getDataValue("loot"));
      },
      set(loot) {
        this.setDataValue("loot", JSON.stringify(loot));
      },
      defaultValue: JSON.stringify([])
    },
  }, {});
  Boss.associate = function (models) {
    // associations can be defined here
  };
  return Boss;
};