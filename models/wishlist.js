"use strict";
module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define(
    "Wishlist",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: DataTypes.INTEGER,
      userName: DataTypes.STRING,
      data: {
        type: DataTypes.STRING,
        get() {
          return JSON.parse(this.getDataValue("data"));
        },
        set(data) {
          this.setDataValue("data", JSON.stringify(data));
        },
        defaultValue: JSON.stringify({
          phase1: [
            {
              name: "Tete",
              type: "head",
              item: null
            },
            {
              name: "Mains",
              type: "hands",
              item: null
            },
            {
              name: "Colier",
              type: "neck",
              item: null
            },
            {
              name: "Cape",
              type: "back",
              item: null
            },
            {
              name: "Ceinture",
              type: "waist",
              item: null
            },
            {
              name: "Epaulière",
              type: "shoulder",
              item: null
            },
            {
              name: "Jambieres",
              type: "legs",
              item: null
            },
            {
              name: "Torse",
              type: "chest",
              item: null
            },
            {
              name: "Pieds",
              type: "feet",
              item: null
            },
            {
              name: "Bracelets",
              type: "wrists",
              item: null
            },
            {
              name: "Doigt 1",
              type: "finger",
              item: null
            },
            {
              name: "Doigt 2",
              type: "finger",
              item: null
            },
            {
              name: "Bijou 1",
              type: "trinket",
              item: null
            },
            {
              name: "Bijou 2",
              type: "trinket",
              item: null
            },
            {
              name: "Arme Principal",
              type: "mainhand",
              item: null
            },
            {
              name: "Arme Secondaire",
              type: "offhand",
              item: null
            },
            {
              name: "Relic/Idole/Arme Distant/",
              type: "relic",
              item: null
            }
          ],
          phase2: [
            {
              name: "Tete",
              type: "head",
              item: null
            },
            {
              name: "Mains",
              type: "hands",
              item: null
            },
            {
              name: "Colier",
              type: "neck",
              item: null
            },
            {
              name: "Cape",
              type: "back",
              item: null
            },
            {
              name: "Ceinture",
              type: "waist",
              item: null
            },
            {
              name: "Epaulière",
              type: "shoulder",
              item: null
            },
            {
              name: "Jambieres",
              type: "legs",
              item: null
            },
            {
              name: "Torse",
              type: "chest",
              item: null
            },
            {
              name: "Pieds",
              type: "feet",
              item: null
            },
            {
              name: "Bracelets",
              type: "wrists",
              item: null
            },
            {
              name: "Doigt 1",
              type: "finger",
              item: null
            },
            {
              name: "Doigt 2",
              type: "finger",
              item: null
            },
            {
              name: "Bijou 1",
              type: "trinket",
              item: null
            },
            {
              name: "Bijou 2",
              type: "trinket",
              item: null
            },
            {
              name: "Arme Principal",
              type: "mainhand",
              item: null
            },
            {
              name: "Arme Secondaire",
              type: "offhand",
              item: null
            },
            {
              name: "Relic/Idole/Arme Distant/",
              type: "relic",
              item: null
            }
          ],
          phase3: [
            {
              name: "Tete",
              type: "head",
              item: null
            },
            {
              name: "Mains",
              type: "hands",
              item: null
            },
            {
              name: "Colier",
              type: "neck",
              item: null
            },
            {
              name: "Cape",
              type: "back",
              item: null
            },
            {
              name: "Ceinture",
              type: "waist",
              item: null
            },
            {
              name: "Epaulière",
              type: "shoulder",
              item: null
            },
            {
              name: "Jambieres",
              type: "legs",
              item: null
            },
            {
              name: "Torse",
              type: "chest",
              item: null
            },
            {
              name: "Pieds",
              type: "feet",
              item: null
            },
            {
              name: "Bracelets",
              type: "wrists",
              item: null
            },
            {
              name: "Doigt 1",
              type: "finger",
              item: null
            },
            {
              name: "Doigt 2",
              type: "finger",
              item: null
            },
            {
              name: "Bijou 1",
              type: "trinket",
              item: null
            },
            {
              name: "Bijou 2",
              type: "trinket",
              item: null
            },
            {
              name: "Arme Principal",
              type: "mainhand",
              item: null
            },
            {
              name: "Arme Secondaire",
              type: "offhand",
              item: null
            },
            {
              name: "Relic/Idole/Arme Distant/",
              type: "relic",
              item: null
            }
          ],
          phase4: [
            {
              name: "Tete",
              type: "head",
              item: null
            },
            {
              name: "Mains",
              type: "hands",
              item: null
            },
            {
              name: "Colier",
              type: "neck",
              item: null
            },
            {
              name: "Cape",
              type: "back",
              item: null
            },
            {
              name: "Ceinture",
              type: "waist",
              item: null
            },
            {
              name: "Epaulière",
              type: "shoulder",
              item: null
            },
            {
              name: "Jambieres",
              type: "legs",
              item: null
            },
            {
              name: "Torse",
              type: "chest",
              item: null
            },
            {
              name: "Pieds",
              type: "feet",
              item: null
            },
            {
              name: "Bracelets",
              type: "wrists",
              item: null
            },
            {
              name: "Doigt 1",
              type: "finger",
              item: null
            },
            {
              name: "Doigt 2",
              type: "finger",
              item: null
            },
            {
              name: "Bijou 1",
              type: "trinket",
              item: null
            },
            {
              name: "Bijou 2",
              type: "trinket",
              item: null
            },
            {
              name: "Arme Principal",
              type: "mainhand",
              item: null
            },
            {
              name: "Arme Secondaire",
              type: "offhand",
              item: null
            },
            {
              name: "Relic/Idole/Arme Distant/",
              type: "relic",
              item: null
            }
          ],
          phase5: [
            {
              name: "Tete",
              type: "head",
              item: null
            },
            {
              name: "Mains",
              type: "hands",
              item: null
            },
            {
              name: "Colier",
              type: "neck",
              item: null
            },
            {
              name: "Cape",
              type: "back",
              item: null
            },
            {
              name: "Ceinture",
              type: "waist",
              item: null
            },
            {
              name: "Epaulière",
              type: "shoulder",
              item: null
            },
            {
              name: "Jambieres",
              type: "legs",
              item: null
            },
            {
              name: "Torse",
              type: "chest",
              item: null
            },
            {
              name: "Pieds",
              type: "feet",
              item: null
            },
            {
              name: "Bracelets",
              type: "wrists",
              item: null
            },
            {
              name: "Doigt 1",
              type: "finger",
              item: null
            },
            {
              name: "Doigt 2",
              type: "finger",
              item: null
            },
            {
              name: "Bijou 1",
              type: "trinket",
              item: null
            },
            {
              name: "Bijou 2",
              type: "trinket",
              item: null
            },
            {
              name: "Arme Principal",
              type: "mainhand",
              item: null
            },
            {
              name: "Arme Secondaire",
              type: "offhand",
              item: null
            },
            {
              name: "Relic/Idole/Arme Distant/",
              type: "relic",
              item: null
            }
          ],
          phase6: [
            {
              name: "Tete",
              type: "head",
              item: null
            },
            {
              name: "Mains",
              type: "hands",
              item: null
            },
            {
              name: "Colier",
              type: "neck",
              item: null
            },
            {
              name: "Cape",
              type: "back",
              item: null
            },
            {
              name: "Ceinture",
              type: "waist",
              item: null
            },
            {
              name: "Epaulière",
              type: "shoulder",
              item: null
            },
            {
              name: "Jambieres",
              type: "legs",
              item: null
            },
            {
              name: "Torse",
              type: "chest",
              item: null
            },
            {
              name: "Pieds",
              type: "feet",
              item: null
            },
            {
              name: "Bracelets",
              type: "wrists",
              item: null
            },
            {
              name: "Doigt 1",
              type: "finger",
              item: null
            },
            {
              name: "Doigt 2",
              type: "finger",
              item: null
            },
            {
              name: "Bijou 1",
              type: "trinket",
              item: null
            },
            {
              name: "Bijou 2",
              type: "trinket",
              item: null
            },
            {
              name: "Arme Principal",
              type: "mainhand",
              item: null
            },
            {
              name: "Arme Secondaire",
              type: "offhand",
              item: null
            },
            {
              name: "Relic/Idole/Arme Distant/",
              type: "relic",
              item: null
            }
          ]
        })
      }
    },
    {}
  );
  Wishlist.associate = function(models) {
    // associations can be defined here
    // Wishlist.hasOne(models.User, {as: "user",foreignKey: "wishlistId"});
  };
  return Wishlist;
};
