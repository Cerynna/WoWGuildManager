"use strict";

const fs = require("fs");
const { User, Wishlist, Stuff, db, sequelize } = require("../models");
const lodash = require("lodash");

sequelize;
// .query("SET FOREIGN_KEY_CHECKS = 0", { raw: true })
// .then(function(results) {
// sequelize.sync({ force: true }).then(() => {
//   seedUser();
//   seedEvent();
// });
// });

var DBUser = JSON.parse(
  fs.readFileSync(`${__dirname}/../database/Users.json`, "utf8")
);
var DBRaid = JSON.parse(
  fs.readFileSync(`${__dirname}/../database/Raids.json`, "utf8")
);

// User.findOne({
//   where: { pseudo: "Hystérias" }
//   // include: [{ model: Wishlist, as: "wishlist", required: false }]
// }).then(user => {
//   user = user.get({
//     plain: true
//   });
//   Wishlist.findOne({ where: { userId: user.id } }).then(wishlist => {
//     user.wishlist = wishlist.get({
//       plain: true
//     }).data;
//     Stuff.findOne({ where: { userId: user.id } }).then(stuff => {
//       user.stuff = stuff.get({
//         plain: true
//       }).data;
//   console.log(user)
//     });
//   });

// });

// DBUser.forEach(user => {
//   console.log(user.name);
//   // User.create({
//   //   pseudo: user.name
//   // });

//   WishList.findOrCreate({
//     where: { pseudo: user.name },
//     defaults: { classe: user.classe }
//   }).then(([user, created]) => {
//     // console.log(
//     //   user.get({
//     //     plain: true
//     //   })
//     // );
//     console.log(created);

//   });
// });
function seedUser() {
  let busy = false;
  let Runtime = setInterval(() => {
    if (!busy) {
      busy = true;
      const user = DBUser.shift();
      if (typeof user == "object") {
        console.log(user.name);
        User.findOrCreate({
          where: { pseudo: user.name },
          defaults: {
            classe: user.classe,
            login: user.name,
            pseudo: user.name,
            spec: user.spe,
            password: user.pass,
            hash: user.id
            // WishlistId: 1
          }
        }).then(([newuser, created]) => {
          Object.keys(user.wishlist).map(phaseName => {
            user.wishlist[phaseName] = lodash.orderBy(
              user.wishlist[phaseName],
              "name"
            );
          });

          Wishlist.create({
            userId: newuser.id,
            userName: user.name,
            data: user.wishlist
          });
          // .then(wishlist => {
          //   // console.log(user.wishlist);
          // });
          // user.stuff = ;
          // console.log(lodash.orderBy(user.stuff, "name"))
          Stuff.create({
            userId: newuser.id,
            userName: user.name,
            data: lodash.orderBy(user.stuff, "name")
          });

          busy = false;
          console.log(created);
        });
      }else{
        clearInterval(Runtime);
      }
    }
  }, 1000);
}

function seedEvent() {
  let busy = false;
  setInterval(() => {
    if (!busy) {
      busy = true;
      const raid = DBRaid.shift();
      if (typeof user == "object") {
        console.log(raid);
        busy = false;
      }else{

      }

    }
  }, 1000);
}
seedEvent();
// let user = DBUser.shift();

// console.log(user)
