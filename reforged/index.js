"use strict";

const fs = require("fs");
const { User, db, sequelize } = require("../models");

sequelize;
// .query("SET FOREIGN_KEY_CHECKS = 0", { raw: true })
// .then(function(results) {
sequelize.sync({ force: true }).then(() => {
  seed();
});
// });

var DBUser = JSON.parse(
  fs.readFileSync(`${__dirname}/../database/Users.json`, "utf8")
);
// DBUser.forEach(user => {
//   console.log(user.name);
//   // User.create({
//   //   pseudo: user.name
//   // });

//   User.findOrCreate({
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
function seed() {
  let busy = false;
  setInterval(() => {
    if (!busy) {
      busy = true;
      const user = DBUser.shift();
      console.log( user);
      if (typeof user == "object") {
        User.findOrCreate({
          where: { pseudo: user.name },
          defaults: { classe: user.classe, login: user.name, spec: user.spe, password: user.pass }
        }).then(([user, created]) => {
          // console.log(
          //   user.get({
          //     plain: true
          //   })
          // );
          busy = false;
          console.log(created);
        });
      }
    }
  }, 100);
}

// let user = DBUser.shift();

// console.log(user)
