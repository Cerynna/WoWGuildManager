'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    idWoW: DataTypes.BIGINT,
    icon: DataTypes.STRING,
    type: DataTypes.STRING,
    boss: {
      type: DataTypes.STRING,
      get() {
        return JSON.parse(this.getDataValue("boss"));
      },
      set(loot) {
        this.setDataValue("boss", JSON.stringify(loot));
      },
      defaultValue: JSON.stringify([])
    },
    raid: DataTypes.STRING,
    prio: DataTypes.STRING,
  }, {});
  Item.associate = function(models) {
    // associations can be defined here
  };
  return Item;
};