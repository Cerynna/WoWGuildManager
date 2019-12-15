"use strict";
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      date: DataTypes.DATE,
      name: DataTypes.STRING,
      desc: DataTypes.TEXT,
      roster: {
        type: DataTypes.STRING,
        get() {
          return JSON.parse(this.getDataValue("data"));
        },
        set(data) {
          this.setDataValue("data", JSON.stringify(data));
        },
        defaultValue: JSON.stringify({
          accept: [],
          refuse: [],
          bench: [],
          valid: [
            { name: "GRP 1", list: [], id: 0 },
            { name: "GRP 2", list: [], id: 1 },
            { name: "GRP 3", list: [], id: 2 },
            { name: "GRP 4", list: [], id: 3 },
            { name: "GRP 5", list: [], id: 4 },
            { name: "GRP 6", list: [], id: 5 },
            { name: "GRP 7", list: [], id: 6 },
            { name: "GRP 8", list: [], id: 7 }
          ]
        })
      }
    },
    {}
  );
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};
