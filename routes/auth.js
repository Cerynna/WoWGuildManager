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
const jwt = require("jsonwebtoken");
const privateKey = "forgiven";
const bcrypt = require("bcrypt");
const saltRounds = 10;

const makeid = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};




router.post("/login", async (req, res) => {
  const { login, pass } = req.body;
  User.findOne({
    where: { login: login }
  }).then(user => {
    if (user) {
      user = user.get({
        plain: true
      });
      // console.log(user);

      bcrypt.compare(pass, user.password, function(err, resPass) {
        // console.log(resPass)
        if (resPass) {
          var token = jwt.sign(user, privateKey);
          res.cookie("token", token);
          res.cookie("user", user.hash);
          res.json(true);
        } else {
          res.json({
            err: {
              mess: "Password Incorrect",
              type: "pass"
            }
          });
        }
      });
    }
  });
});

router.post("/register", async (req, res) => {
  // req.body.login;
  // req.body.pass;
  // req.body.pass;
  var hash = bcrypt.hashSync(req.body.pass, saltRounds);

  User.findOrCreate({
    where: { login: req.body.login },
    defaults: {
      pseudo: req.body.login,
      login: req.body.login,
      password: hash,
      hash: makeid(10)
    }
  }).then(([user, created]) => {
    user = user.get({
      plain: true
    });
    if (!created) {
      res.json({
        err: {
          type: "login",
          mess: "Ce login est déja utilisé"
        }
      });
    } else {
      const token = jwt.sign(user, privateKey);
      res.cookie("token", token);
      res.cookie("user", user.hash);
      res.json(true);
    }
  });

});

router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("user");
  res.json(true);
});

// router.post("/auth/verif/", async (req, res) => {
//   const { token } = req.body;
//   jwt.verify(token, privateKey, (err, decoded) => {
//     const newToken = jwt.sign(findInDBUser(decoded.name), privateKey);
//     res.cookie("token", newToken);
//     res.cookie("user", user.id);
//     // res.cookie("grade", user.grade);
//     res.json(err ? false : true);
//   });
// });

router.post("/verifAdmin", async (req, res) => {
  const { token } = req.body;
  // console.log(req.body);
  jwt.verify(token, privateKey, (err, decoded) => {
    // console.log(decoded);
    res.json(decoded.grade >= 8 ? true : false);
  });
});
module.exports = router;
