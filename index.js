const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const privateKey = "forgiven";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const lodash = require("lodash");
const fs = require("fs");
const ConsoleProgressBar = require("console-progress-bar");

const csvFilePath = "database/loots.csv";
const csv = require("csvtojson");

const blizzard = require("blizzard.js").initialize({
  key: "83282703b1c6485db2900a81dca9c94f",
  secret: "pzAzdNYwrtimPoNot39B7UqHEqfIphDA",
  origin: "eu",
  locale: "fr_FR"
});

blizzard.getApplicationToken().then(response => {
  blizzard.defaults.token = response.data.access_token;
});

app.use(express.static(path.join(__dirname, "/front/build")));

app.set("trust proxy", 1);

app.use(bodyParser.json({
  limit: "100mb",
  extended: true
}));

app.use(bodyParser.urlencoded({
  limit: "100mb",
  extended: true
}));

app.use(cookieParser());

const {
  User,
  Stuff,
  makeid,
  findInDBUser,
  findAllUsers,
  findAllRaids,
  saveInDBUser,
  removeUser,
  findInDBUserbyID,
  findInDBRaidbyID,
  findInDBRaidbyDate,
  saveInDBRaid,
  indexStatusRaidForUser
} = require("./database");


if (!fs.existsSync(`${__dirname}/database/Loots.json`)) {
  CreateDB();
}

app.post("/auth/login", async (req, res) => {
  const {
    login,
    pass
  } = req.body;
  const user = findInDBUser(login);
  if (user) {
    bcrypt.compare(pass, user.pass, function (err, resPass) {
      // console.log(resPass)
      if (resPass) {
        delete user.wishlist;
        delete user.stuff;

        var token = jwt.sign(user, privateKey);
        // console.log("AUTH LOGIN", token)
        res.cookie("token", token);
        res.cookie("user", user.id);
        // res.cookie("grade", user.grade);
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
  } else {
    res.json({
      err: {
        mess: "Login Incorrect",
        type: "all"
      }
    });
  }
});

app.post("/auth/register", async (req, res) => {
  // req.body.login;
  // req.body.pass;
  // req.body.pass;
  var hash = bcrypt.hashSync(req.body.pass, saltRounds);
  if (findInDBUser(req.body.login)) {
    res.json({
      err: {
        type: "login",
        mess: "Ce login est déja utilisé"
      }
    });
  } else {
    const user = new User(req.body.login, hash);
    const token = jwt.sign(user, privateKey);
    res.cookie("token", token);
    res.cookie("user", user.id);
    // res.cookie("grade", user.grade);
    res.json(true);
  }
});

app.get("/auth/logout", async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("user");
  res.json(true);
});

app.post("/auth/verif/", async (req, res) => {
  const {
    token
  } = req.body;
  jwt.verify(token, privateKey, (err, decoded) => {
    const newToken = jwt.sign(findInDBUser(decoded.name), privateKey);
    res.cookie("token", newToken);
    res.cookie("user", user.id);
    // res.cookie("grade", user.grade);
    res.json(err ? false : true);
  });
});

app.post("/auth/verifAdmin", async (req, res) => {
  const {
    token
  } = req.body;
  // console.log(req.body);
  jwt.verify(token, privateKey, (err, decoded) => {
    // console.log(decoded);
    res.json(decoded.grade >= 8 ? true : false);
  });
});

app.get("/api/users", async (req, res) => {
  res.json(findAllUsers());
});

app.get("/api/user/name/:name", async (req, res) => {
  res.json(findInDBUser(req.params.name));
});

app.get("/api/user/id/:id", async (req, res) => {
  let User = findInDBUserbyID(req.params.id);
  // console.log(req.params.id, User.name);
  if (User) {
    if (!User.wishlist.phase1) {
      // console.log("LES PHASE EXISTE PAS");
      User.wishlist = {
        phase1: Stuff,
        phase2: Stuff,
        pahse3: Stuff,
        pahse4: Stuff,
        pahse5: Stuff,
        pahse6: Stuff
      };
      saveInDBUser(User);
    }
    User.stuff.forEach((slot, index) => {
      if (slot.name == "ijou 2") {
        // console.log(slot);
        User.stuff[index].name = "Bijou 2";
        saveInDBUser(User);
      }
    });
    Object.keys(User.wishlist).forEach((phase, index) => {
      User.wishlist[phase] = lodash.orderBy(User.wishlist[phase], "name");

      User.wishlist[phase].forEach((slot, index) => {
        if (slot.name == "ijou 2") {
          User.wishlist[phase][index].name = "Bijou 2";
          saveInDBUser(User);
        }
      });
    });
    let findBack = User.stuff
      .map(slot => {
        return slot.name == "Cape" ? slot : false;
      })
      .filter(x => x).length;
    if (findBack === 0) {
      User.stuff.push({
        name: "Cape",
        type: "back",
        item: null
      });
      // console.log(User);

      saveInDBUser(User);
    }
    User.stuff = lodash.orderBy(User.stuff, "name");
    res.json(User);
  } else {
    res.json(false);
  }

  // res.json(User);
});

app.post("/api/user/updateWL", async (req, res) => {
  const {
    idUser,
    type,
    item
  } = req.body;
  console.log(idUser, type, item);

  let User = findInDBUserbyID(idUser);
  // console.log(User.wishlist[type.phase]);
  const indexWL = User.wishlist[type.phase].findIndex(
    slot => slot.name === type.name
  );
  User.wishlist[type.phase][indexWL].item = item;
  // console.log(User.wishlist[type.phase][indexWL]);
  saveInDBUser(User);
  res.json(User);
});

app.post("/api/user/updateStuff", async (req, res) => {
  const {
    idUser,
    type,
    item
  } = req.body;
  console.log(idUser, type, item);

  let User = findInDBUserbyID(idUser);
  const indexWL = User[type.phase].findIndex(slot => slot.name === type.name);
  User[type.phase][indexWL].item = item;
  // console.log(User[type.phase][indexWL]);
  saveInDBUser(User);
  res.json(User);
});

app.get("/api/user/deleteWL/:id", async (req, res) => {
  const {
    id
  } = req.params;
  let User = findInDBUserbyID(id);
  User.wishlist = {
    phase1: Stuff,
    phase2: Stuff,
    pahse3: Stuff,
    pahse4: Stuff,
    pahse5: Stuff,
    pahse6: Stuff
  };
  saveInDBUser(User);

  res.json(User);
});

app.post("/api/user/update/", async (req, res) => {
  const {
    user
  } = req.body;
  saveInDBUser(user);
  res.json(true);
});

app.get("/api/user/delete/:idUser", async (req, res) => {
  // console.log("DELETE");
  const {
    idUser
  } = req.params;
  removeUser(idUser);
  res.json(true);
});

app.post("/api/decodeToken", async (req, res) => {
  var decoded = jwt.verify(req.body.token, privateKey);
  res.json(findInDBUser(decoded.name));
});

app.get("/api/raid/:day/:month/:year", async (req, res) => {
  const {
    day,
    month,
    year
  } = req.params;
  res.json(findInDBRaidbyDate(day, month, year));
});

app.get("/api/raids", async (req, res) => {
  res.json(findAllRaids());
});

app.get("/api/loots", async (req, res) => {
  var DBLoots = JSON.parse(
    fs.readFileSync(`${__dirname}/database/Loots.json`, "utf8")
  );
  // console.log(lodash.orderBy(DBLoots, "length"));

  res.json(DBLoots);
});

app.get("/api/loots/find/:type/:data/:slot", async (req, res) => {
  const {
    type,
    data,
    slot
  } = req.params;
  // console.log(type);
  var DBLoots = JSON.parse(
    fs.readFileSync(`${__dirname}/database/Loots.json`, "utf8")
  );
  // console.log(DBLoots);
  const findLoot = DBLoots.filter(loot => {
    // console.log(loot[type].indexOf(data), loot.type, slot);
    if (type == "name") {
      return loot[type].indexOf(data) >= 0 && loot.type == slot;
    } else {
      return loot[type] == data && loot.type == slot;
    }
  });
  // console.log(findLoot);
  res.json(findLoot);
});

app.get("/api/loots/id/:id", async (req, res) => {
  // console.log('LOOTID', req.params.id)
  csv()
    .fromFile(csvFilePath)
    .then(loots => {
      // console.log(jsonObj);
      loots = loots.map(loot => {
        loot.boss = [
          loot.boss1.toLowerCase(),
          loot.boss2.toLowerCase(),
          loot.boss3.toLowerCase(),
          loot.boss4.toLowerCase()
        ];
        delete loot.boss1;
        delete loot.boss2;
        delete loot.boss3;
        delete loot.boss4;
        return loot;
      });

      if (req.params.id) {
        loots = loots
          .map(loot => {
            // console.log(loot.id.toLowerCase().indexOf(req.params.id));
            return loot.id.toLowerCase().indexOf(req.params.id) >= 0 ?
              loot :
              false;
          })
          .filter(x => x);
      }

      // console.log(loots);
      res.json(loots);
    });
});

app.get("/api/loots/type/:type", async (req, res) => {
  csv()
    .fromFile(csvFilePath)
    .then(loots => {
      // console.log(jsonObj);
      loots = loots.map(loot => {
        loot.boss = [
          loot.boss1.toLowerCase(),
          loot.boss2.toLowerCase(),
          loot.boss3.toLowerCase(),
          loot.boss4.toLowerCase()
        ];
        delete loot.boss1;
        delete loot.boss2;
        delete loot.boss3;
        delete loot.boss4;
        return loot;
      });

      if (req.params.type) {
        loots = loots
          .map(loot => {
            return loot.type.toLowerCase().indexOf(req.params.type) >= 0 ?
              loot :
              false;
          })
          .filter(x => x);
      }

      // console.log(loots);
      res.json(loots);
    });
});

// scp root@51.38.190.243:/var/www/WoWGuildManager/ /home/cerynna/Bureau/RecupGuild

app.get("/api/raid/:raidId", async (req, res) => {
  const {
    raidId
  } = req.params;
  res.json(findInDBRaidbyID(raidId));
});

app.post("/api/raid/update", async (req, res) => {
  const {
    raid
  } = req.body;
  // console.log(req.body)
  raid.roster.valid.forEach((grp, i) => {
    raid.roster.valid[i].list = raid.roster.valid[i].list.filter(
      (value, index, self) => {
        return self.indexOf(value) === index;
      }
    );
  });
  // console.log("UPDATE RAID", raid.roster.valid);
  saveInDBRaid(raid);
  res.json(true);
});

app.post("/api/raid/refuse", async (req, res) => {
  const {
    id,
    user
  } = req.body;
  const raid = findInDBRaidbyID(id);
  const {
    indexAccept,
    indexRefuse,
    indexBench,
    indexValid
  } = indexStatusRaidForUser(raid, user);

  // console.log(user, indexAccept, indexRefuse, indexBench);

  if (indexAccept !== undefined) {
    raid.roster.accept.splice(indexAccept, 1);
  }
  if (indexBench !== undefined) {
    raid.roster.bench.splice(indexBench, 1);
  }
  if (indexRefuse === undefined) {
    raid.roster.refuse.push({
      user: user,
      date: Date.now()
    });
  }
  if (indexValid !== undefined) {
    raid.roster.valid[indexValid].list = raid.roster.valid[
      indexValid
    ].list.filter(x => x !== user);
  }
  // console.log(raid.roster);
  saveInDBRaid(raid);
  res.json(true);
});

app.post("/api/raid/accept", async (req, res) => {
  const {
    id,
    user
  } = req.body;
  const raid = findInDBRaidbyID(id);

  const {
    indexAccept,
    indexRefuse,
    indexBench,
    indexValid
  } = indexStatusRaidForUser(raid, user);

  if (indexRefuse !== undefined) {
    raid.roster.refuse.splice(indexRefuse, 1);
  }
  if (indexBench !== undefined) {
    raid.roster.bench.splice(indexBench, 1);
  }
  if (indexAccept === undefined) {
    raid.roster.accept.push({
      user: user,
      date: Date.now(),
      valid: false
    });
  }
  if (indexValid !== undefined) {
    raid.roster.valid[indexValid].list = raid.roster.valid[
      indexValid
    ].list.filter(x => x !== user);
  }
  saveInDBRaid(raid);
  res.json(true);
});

app.post("/api/raid/bench", async (req, res) => {
  const {
    id,
    user
  } = req.body;
  const raid = findInDBRaidbyID(id);

  const {
    indexAccept,
    indexRefuse,
    indexBench,
    indexValid
  } = indexStatusRaidForUser(raid, user);

  if (indexRefuse !== undefined) {
    raid.roster.refuse.splice(indexRefuse, 1);
  }
  if (indexAccept !== undefined) {
    raid.roster.accept.splice(indexAccept, 1);
  }
  if (indexBench === undefined) {
    raid.roster.bench.push({
      user: user,
      date: Date.now()
    });
  }
  if (indexValid !== undefined) {
    raid.roster.valid[indexValid].list = raid.roster.valid[
      indexValid
    ].list.filter(x => x !== user);
  }
  saveInDBRaid(raid);
  res.json(true);
});

app.post("/api/raid/new", async (req, res) => {
  // console.log(req.body);
  req.body.id = makeid(10);
  saveInDBRaid(req.body);
  res.json(true);
});

app.get("/api/item/:id", async (req, res) => {
  const {
    id
  } = req.params;
  // console.log(typeof id)
  blizzard.wow
    .item({
      id: id
    })
    .then(({
      data
    }) => {
      // console.log("data", data);
      res.json(data);
    })
    .catch(err => {
      if (err) {
        // console.log("ERR", err);
        res.json(false);
      }
    });
});

app.get("*", (req, res) => {
  const index = path.join(__dirname, "/front/build/index.html");
  res.sendFile(path.join(index));
});

const port = process.env.NODE_ENV === "development" ? 8000 : 3000;
app.listen(port, async () => {
  console.log(`WOWGUILDMANAGER RUN IN PORT ${port}`);
});

// async function example() {
//   // try {

//   // console.log(item);
//   // } catch (err) {
//   // console.error(err);
//   // }
// }

// example();

function CreateDB() {
  csv()
    .fromFile(csvFilePath)
    .then(loots => {
      // console.log(jsonObj);
      loots = loots.map(loot => {
        loot.boss = [
          loot.boss1.toLowerCase(),
          loot.boss2.toLowerCase(),
          loot.boss3.toLowerCase(),
          loot.boss4.toLowerCase(),
          loot.boss5.toLowerCase()
        ].filter(x => x != "");
        loot.prio = [{
            classe: loot.prio1.toLowerCase(),
            spe: loot.spe1.toLowerCase()
          },
          {
            classe: loot.prio2.toLowerCase(),
            spe: loot.spe2.toLowerCase()
          },
          {
            classe: loot.prio3.toLowerCase(),
            spe: loot.spe3.toLowerCase()
          },
          {
            classe: loot.prio4.toLowerCase(),
            spe: loot.spe4.toLowerCase()
          },
          {
            classe: loot.prio5.toLowerCase(),
            spe: loot.spe5.toLowerCase()
          }
        ].filter(x => x.classe != "" && x.spe != "");
        delete loot.boss1;
        delete loot.boss2;
        delete loot.boss3;
        delete loot.boss4;
        delete loot.boss5;

        delete loot.prio1;
        delete loot.prio2;
        delete loot.prio3;
        delete loot.prio4;
        delete loot.prio5;

        delete loot.spe1;
        delete loot.spe2;
        delete loot.spe3;
        delete loot.spe4;
        delete loot.spe5;
        loot.id = parseInt(loot.id);
        // console.log(loot.prio);
        return loot;
      });
      //       loots.map((loot)=>{

      // // console.log(loot.id)
      //         // blizzard.wow
      //         // .item({ id: loot.id })
      //         // .then(({ data }) => {
      //         //   // console.log(loots);
      //         //   console.log("data", data);
      //         //   // res.json(data);
      //         // })
      //         // .catch(err => {
      //         //   if (err) {
      //         //     // console.log("ERR", err);
      //         //     // res.json(false);
      //         //   }
      //         // });
      //       })
      let buzy = false;
      // console.log(loots);
      let indexLoot = 0;
      const consoleProgressBar = new ConsoleProgressBar({
        maxValue: loots.length
      });
      // loots = loots.slice(0, 5);
      let AutoRunLoots = setInterval(() => {
        if (!buzy) {
          buzy = true;
          if (loots[indexLoot] != undefined) {
            // blizzard.wow.boss({id: data.itemSource.sourceId})
            blizzard.wow
              .item({
                id: loots[indexLoot].id
              })
              .then(({
                data
              }) => {
                // console.log(loots);
                // console.log(
                //   indexLoot,
                //   data.id,
                //   loots[indexLoot].n
                // );

                // blizzard.wow
                //   .boss({ id: data.itemSource.sourceId })
                //   .then(({ data }) => {
                //     console.log(data.name);
                //   });

                loots[indexLoot].name = data.name.toLowerCase();
                loots[indexLoot].icon = data.icon;
                loots[indexLoot].quality = data.quality;
                // console.log("data", data);
                indexLoot += 1;
                consoleProgressBar.addValue(1);
                buzy = false;
                // resolve(data);
              })
              .catch(err => {
                if (err) {
                  console.log("ERR");
                  buzy = false;
                  // res.json(false);
                }
              });
          } else {
            buzy = null;
          }
        }
        if (buzy == null) {
          clearInterval(AutoRunLoots);
          // console.log(loots);
          fs.writeFileSync(
            `${__dirname}/database/Loots.json`,
            JSON.stringify(loots),
            "utf8"
          );
        }
      }, 500);

      // if (req.params.type) {
      //   loots = loots
      //     .map(loot => {
      //       return loot.type.toLowerCase().indexOf(req.params.type) >= 0
      //         ? loot
      //         : false;
      //     })
      //     .filter(x => x);
      // }

      // res.json(loots);
    });
}
// CreateDB();

// var promise1 = Promise.resolve(3);
// var promise2 = 42;
// var promise3 = new Promise(function(resolve, reject) {
//   // console.log(resolve)

// });

// Promise.all([promise1, promise2, promise3]).then(function(values) {
//   console.log(values);
// });