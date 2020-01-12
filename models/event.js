"use strict";
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      date: {
        type: DataTypes.STRING,
        get() {
          return JSON.parse(this.getDataValue("date"));
        },
        set(date) {
          this.setDataValue("date", JSON.stringify(date));
        }
      },
      name: DataTypes.STRING,
      desc: DataTypes.TEXT,
      type: DataTypes.STRING,
      d: DataTypes.STRING,
      m: DataTypes.STRING,
      y: DataTypes.STRING,
      roster: {
        type: DataTypes.STRING,
        get() {
          const roster = JSON.parse(this.getDataValue("roster"));
          Object.keys(roster).forEach((state, index) => {
            // console.log(state);
            roster[state] = JSON.parse(roster[state]);
            if (state == "valid") {
              roster[state].forEach((grp, index) => {
                roster[state][index] = JSON.parse(roster[state][index]);
              });
            }
          });

          return roster;
        },
        set(roster) {

          Object.keys(roster).map(state => {
            if (state == "valid") {
              // console.log(state);
              roster[state].map((grp, index) => {
                roster[state][index] = JSON.stringify(
                  roster[state][index]
                );
  
              });
            } 
            roster[state] = JSON.stringify(roster[state]);
          })

          this.setDataValue("roster", JSON.stringify(roster));
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
