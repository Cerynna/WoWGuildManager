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


router.get("/all", async (req, res) => {
  const allBoss = await Boss.findAll().then(x => x.map(y => y.get({
    plain: true
  })))

  res.json(allBoss)
})


module.exports = router;