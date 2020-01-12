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

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/all", async (req, res) => {
  const allUsers = await User.findAll({});
  res.json(allUsers);
});

router.get("/delete/:idUser", async (req, res) => {
  const { idUser } = req.params;
  console.log("DELETE", idUser);
  User.destroy({ where: { id: idUser } }).then(() => {
    res.json(true);
  });
});

router.get("/name/:name", async (req, res) => {
  //   res.json(findInDBUser(req.params.name));
  User.findOne({ where: { name: req.params.name } }).then(user => {
    user = user.get({
      plain: true
    });

    res.json(user);
  });
});

router.get("/id/:id", async (req, res) => {
  //   res.json(findInDBUser(req.params.name));
  User.findOne({ where: { hash: req.params.id } }).then(user => {
    user = user.get({
      plain: true
    });
    Stuff.findOne({ where: { userId: user.id } }).then(stuff => {
      stuff = stuff.get({
        plain: true
      });
      user.stuff = stuff.data;
      Wishlist.findOne({ where: { userId: user.id } }).then(wishlist => {
        wishlist = wishlist.get({
          plain: true
        });
        user.wishlist = wishlist.data;
        res.json(user);
      });
    });
  });
});

router.post("/updateWL", async (req, res) => {
  const { idUser, type, item } = req.body;
  // console.log(idUser, type, item);
  User.findOne({ where: { hash: idUser } }).then(user => {
    Wishlist.findOne({ where: { userId: user.id } }).then(wishlist => {
      Stuff.findOne({ where: { userId: user.id } }).then(stuff => {
        // console.log(stuff)
        user = user.get({
          plain: true
        }).data;
        let plainStuff = stuff.get({
          plain: true
        }).data;
        let plainWishlist = wishlist.get({
          plain: true
        }).data;

        if (type.phase == "stuff") {
          let indexslot = plainStuff.findIndex(slot => {
            return slot.name == type.name;
          });
          plainStuff[indexslot].item = item;
          stuff
            .update({
              data: plainStuff
            })
            .then(() => {
              // user["stuff"] = plainStuff;
              // user["wishlist"] = plainWishlist;
              res.json(user);
            });
        }

        if (type.phase != "stuff") {
          let indexslot = plainWishlist[type.phase].findIndex(slot => {
            return slot.name == type.name;
          });

          plainWishlist[type.phase][indexslot].item = item;
          wishlist
            .update({
              data: plainWishlist
            })
            .then(() => {
              // user["stuff"] = plainStuff;
              // user["wishlist"] = plainWishlist;
              res.json(user);
            });
        }
      });
    });
  });
  //   console.log(idUser, type, item);

  //   let User = findInDBUserbyID(idUser);
  //   // console.log(User.wishlist[type.phase]);

  //   if (type.phase == "stuff") {
  //     const indexWL = User[type.phase].findIndex(slot => slot.name === type.name);
  //     User[type.phase][indexWL].item = item;
  //   } else {
  //     const indexWL = User.wishlist[type.phase].findIndex(
  //       slot => slot.name === type.name
  //     );
  //     User.wishlist[type.phase][indexWL].item = item;
  //   }

  //   // console.log(User.wishlist[type.phase][indexWL]);
  //   saveInDBUser(User);
  //   res.json(User);
});

// app.post("/api/user/updateStuff", async (req, res) => {
//   const { idUser, type, item } = req.body;
//   console.log(idUser, type, item);

//   let User = findInDBUserbyID(idUser);
//   const indexWL = User[type.phase].findIndex(slot => slot.name === type.name);
//   User[type.phase][indexWL].item = item;
//   // console.log(User[type.phase][indexWL]);
//   saveInDBUser(User);
//   res.json(User);
// });

// app.get("/api/user/deleteWL/:id", async (req, res) => {
//   const { id } = req.params;
//   let User = findInDBUserbyID(id);
//   User.wishlist = {
//     phase1: Stuff,
//     phase2: Stuff,
//     pahse3: Stuff,
//     pahse4: Stuff,
//     pahse5: Stuff,
//     pahse6: Stuff
//   };
//   saveInDBUser(User);

//   res.json(User);
// });

router.post("/update", async (req, res) => {
  const userForm = req.body.user;
  // console.log(user);
  User.findOne({ where: { id: userForm.id } }).then(user => {
    user
      .update({
        pseudo: userForm.pseudo,
        login: userForm.login,
        password: userForm.password,
        hash: userForm.hash,
        classe: userForm.classe,
        spec: userForm.spec,
        grade: userForm.grade
      })
      .then(userDB => {
        // console.log(userDB);
        res.json(true);
      });
  });
  //   saveInDBUser(user);
});

module.exports = router;
