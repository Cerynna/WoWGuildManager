"use strict";
module.exports = (sequelize, DataTypes) => {
  const FormatRaid = sequelize.define(
    "FormatRaid",
    {
      name: DataTypes.STRING,
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      idWoW: DataTypes.BIGINT,
      boss: DataTypes.STRING,
      format: {
        type: DataTypes.STRING,
        get() {
          return JSON.parse(this.getDataValue("type"));
        },
        set(format) {
          this.setDataValue("type", JSON.stringify(format));
        },
        defaultValue: JSON.stringify({
          name: "Raid 40",
          format: [
            { name: "GRP1", list: [], id: 0 },
            { name: "GRP2", list: [], id: 1 },
            { name: "GRP3", list: [], id: 2 },
            { name: "GRP4", list: [], id: 3 },
            { name: "GRP5", list: [], id: 4 },
            { name: "GRP6", list: [], id: 5 },
            { name: "GRP7", list: [], id: 6 },
            { name: "GRP8", list: [], id: 7 }
          ]
        })
      }
    },
    {}
  );
  FormatRaid.associate = function(models) {
    // associations can be defined here
  };
  FormatRaid.definitions = [
    {
      name: "Raid 40",
      format: [
        { name: "GRP1", list: [], id: 0 },
        { name: "GRP2", list: [], id: 1 },
        { name: "GRP3", list: [], id: 2 },
        { name: "GRP4", list: [], id: 3 },
        { name: "GRP5", list: [], id: 4 },
        { name: "GRP6", list: [], id: 5 },
        { name: "GRP7", list: [], id: 6 },
        { name: "GRP8", list: [], id: 7 }
      ]
    },
    {
      name: "Raid 20",
      format: [
        { name: "GRP1 - A", list: [], id: 0 },
        { name: "GRP2 - A", list: [], id: 1 },
        { name: "GRP3 - A", list: [], id: 2 },
        { name: "GRP4 - A", list: [], id: 3 },
        { name: "GRP1 - B", list: [], id: 4 },
        { name: "GRP2 - B", list: [], id: 5 },
        { name: "GRP3 - B", list: [], id: 6 },
        { name: "GRP4 - B", list: [], id: 7 }
      ]
    },
    {
      name: "Raid 10",
      format: [
        { name: "GRP1 - A", list: [], id: 0 },
        { name: "GRP2 - A", list: [], id: 1 }
      ]
    }
  ];
  return FormatRaid;
};
