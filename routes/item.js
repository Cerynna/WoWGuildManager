var express = require("express");
var router = express.Router();

const {
  User,
  Wishlist,
  Stuff,
  Event,
  Boss,
  Item,
  Raid,
  db,
  sequelize
} = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const blizzard = require("blizzard.js").initialize({
  key: "83282703b1c6485db2900a81dca9c94f",
  secret: "pzAzdNYwrtimPoNot39B7UqHEqfIphDA",
  origin: "eu",
  locale: "fr_FR"
});

blizzard.getApplicationToken().then(response => {
  blizzard.defaults.token = response.data.access_token;
});
router.get("/all", async (req, res) => {
  const allItem = await Item.findAll().then(x => x.map(y => y.get({
    plain: true
  })))

  // console.log(allItem)
  res.json(allItem)
})

router.get("/:id", async (req, res) => {
  const {
    id
  } = req.params;

  Item.findOne({
      where: {
        idWoW: id
      }
    })
    .then(item => {
      item = item.get({
        plain: true
      });
      res.json(item);
    })
    .catch(err => {
      if (err) {
        blizzard.wow
          .item({
            id: id
          })
          .then(({
            data
          }) => {
            res.json({
              name: data.name,
              idWoW: data.id,
              icon: data.icon
            });
          })
          .catch(err => {
            if (err) {
              res.json(false);
            }
          });
      }
    });
});

router.get("/find/:type/:data/:slot", async (req, res) => {
  let {
    type,
    data,
    slot
  } = req.params;
  let finder = {};
  type == "id" ? (type = "idWoW") : false;
  finder[`${type}`] = {
    [Op.like]: `%${data}%`
  };
  finder["type"] = slot;
  Item.findAll({
    where: finder
  }).then(items => {
    items = items.map(item => {
      return item.get({
        plain: true
      });
    });
    res.json(items);
  });
});

module.exports = router;