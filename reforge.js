"use strict";

const fs = require("fs");
const Sequelize = require('sequelize')
const Op = Sequelize.Op
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
} = require("./models");
const lodash = require("lodash");
const ConsoleProgressBar = require("console-progress-bar");
const blizzard = require("blizzard.js").initialize({
  key: "83282703b1c6485db2900a81dca9c94f",
  secret: "pzAzdNYwrtimPoNot39B7UqHEqfIphDA",
  origin: "eu",
  locale: "fr_FR"
});
const csvFilePath = "database/loots.csv";
const csv = require("csvtojson");


const DBUser = JSON.parse(
  fs.readFileSync(`${__dirname}/database/Users.json`, "utf8")
);
const DBRaid = JSON.parse(
  fs.readFileSync(`${__dirname}/database/Raids.json`, "utf8")
);
const DBItem = JSON.parse(
  fs.readFileSync(`${__dirname}/database/Loots.json`, "utf8")
);
const errorItem = JSON.parse(
  fs.readFileSync(`${__dirname}/database/errorItem.json`, "utf8")
);
const defRaid = [{
    name: "Coeur du Magma",
    id: 2717,
    phase: 0
  },
  {
    name: "Onyxia",
    id: 2159,
    phase: 0
  },
  {
    name: "Repaire de l'Aile noire",
    id: 2677,
    phase: 1
  }
];
blizzard.getApplicationToken().then(response => {
  blizzard.defaults.token = response.data.access_token;
});



let progressBar

let step = 0;


if (process.env.MODE == "create") {
  console.log(process.env.MODE, Math.floor((DBUser.length + DBRaid.length + defRaid.length + DBItem.length) * 0.5), "  secondes")


  progressBar = new ConsoleProgressBar({
    maxValue: DBUser.length + DBRaid.length + defRaid.length + DBItem.length
  });


  sequelize.sync({
    force: true
  }).then(async () => {

    SeedRaidAndBoss();
    seedUser();
    seedEvent();
    SeedItem();

  });
}
if (process.env.MODE == "item") {
  CorrectItem();
}
if (process.env.MODE == "boss") {
  CorrectBoss();
}
if(process.env.MODE == "finish"){
  // fs.rename('./reforged/database.sqlite3', './database.sqlite3', (err) => {
  //   if (err) throw err;
  //   console.log('Rename complete!');
  // });
  console.log("EXISTE PLUS !!!")
}
if (process.env.MODE == "init") {
  CreateDB();
}

// ID MC 2717
// ID ONY 2159
// ID BWL 2677




function seedUser() {
  let Runtime = setInterval(() => {
    if (step == 1) {
      const user = DBUser.shift();
      if (typeof user == "object") {
        progressBar.addValue(1);
        User.findOrCreate({
          where: {
            pseudo: user.name
          },
          defaults: {
            classe: user.classe,
            login: user.name,
            pseudo: user.name,
            spec: user.spe,
            password: user.pass,
            grade: user.grade,
            hash: user.id
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
            data: lodash.orderBy(user.wishlist, "name")
          });
          Stuff.create({
            userId: newuser.id,
            userName: user.name,
            data: lodash.orderBy(user.stuff, "name")
          });
        });
      } else {
        clearInterval(Runtime);
        step += 1;
      }
    }
  }, 500);
}

function seedEvent() {
  let Runtime = setInterval(() => {
    if (step == 2) {

      const raid = DBRaid.shift();
      if (typeof raid == "object") {
        progressBar.addValue(1);
        Event.findOrCreate({
          where: {
            date: JSON.stringify(raid.date)
          },
          defaults: {
            date: raid.date,
            name: raid.name,
            desc: raid.desc,
            type: raid.type,
            roster: raid.roster,
            d: raid.date.d,
            m: raid.date.m,
            y: raid.date.y,
          }
        });
      } else {
        clearInterval(Runtime);
        step += 1;
      }
    }
  }, 500);
}

function SeedItem() {
  let Runtime = setInterval(() => {
    if (step == 3) {
      const item = DBItem.shift();
      if (typeof item == "object") {
        progressBar.addValue(1);
        blizzard.wow.item({
          id: item.id
        }).then(({
          data
        }) => {
          const WDBItem = data;
          Item.create({
            name: WDBItem.name,
            idWoW: item.id,
            icon: WDBItem.icon,
            boss: item.boss,
            type: item.type,
            prio: JSON.stringify(item.prio)
          });
        });
      } else {
        clearInterval(Runtime);
        step += 1;
      }
    }
  }, 500);
}

function SeedRaidAndBoss() {
  let Runtime = setInterval(() => {
    if (step == 0) {
      let raid = defRaid.shift();
      if (typeof raid == "object") {
        progressBar.addValue(1);
        blizzard.wow.zone({
          id: raid.id
        }).then(({
          data
        }) => {
          Raid.create({
            idWOW: data.id,
            name: data.name,
            slug: data.urlSlug,
            boss: JSON.stringify(data.bosses.map(x => x.id))
          });
          data.bosses.forEach(boss => {
            Boss.create({
              name: boss.name,
              idWOW: boss.id,
              tag: boss.urlSlug,
              raid: data.id
            });
          });
        });
      } else {
        clearInterval(Runtime);
        step += 1;
      }
    }
  }, 500);
}
async function CorrectItem() {
  let items = await Item.findAll({}).then(items => items);
  items.forEach(async (item) => {
    item.boss.forEach(async (bossName) => {
      let boss = await Boss.findOne({
        where: {
          [Op.or]: [{
            name: {
              [Op.substring]: bossName.slice(0, 4)
            },
          }, {
            tag: {
              [Op.substring]: bossName.slice(0, 4)
            },
          }]

        }
      }).then(async boss => boss.get({
        plain: true
      }))

      let raid = await Raid.findOne({
        where: {
          idWOW: boss.raid
        }
      }).then(x => x.get({
        plain: true
      }))
      let newBoss = item.get({
        plain: true
      }).boss
      newBoss[item.boss.indexOf(bossName)] = boss.idWOW;
      item.raid = raid.idWOW;
      item.boss = newBoss;
      await item.save().then(() => {})
    })
  })

}
// CorrectBoss();
async function CorrectBoss() {
  let allBoss = await Boss.findAll().then(x => x);
  let allItem = await Item.findAll().then(x => x);
  let bossItem = {}
  allItem.forEach(item => {
    console.log(item.boss)
    item.boss.forEach((oneboss) => {
      console.log(oneboss)
      if (!bossItem[oneboss]) {
        bossItem[oneboss] = [item.idWoW]
      } else {
        bossItem[oneboss].push(item.idWoW)
      }
    })
  })
  allBoss.forEach(async boss => {
    boss.loot = lodash.uniq(bossItem[boss.idWOW]);
    await boss.save().then(() => {})
  })

}

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
        loot.prio = [
          {
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
        return loot;
      });
      let buzy = false;
      let indexLoot = 0;
      const consoleProgressBar = new ConsoleProgressBar({
        maxValue: loots.length
      });
      let AutoRunLoots = setInterval(() => {
        if (!buzy) {
          buzy = true;
          if (loots[indexLoot] != undefined) {
            blizzard.wow
              .item({
                id: loots[indexLoot].id
              })
              .then(({ data }) => {

                loots[indexLoot].name = data.name.toLowerCase();
                loots[indexLoot].icon = data.icon;
                loots[indexLoot].quality = data.quality;
                indexLoot += 1;
                consoleProgressBar.addValue(1);
                buzy = false;
              })
              .catch(err => {
                if (err) {
                  console.log("ERR");
                  buzy = false;
                }
              });
          } else {
            buzy = null;
          }
        }
        if (buzy == null) {
          clearInterval(AutoRunLoots);
          fs.writeFileSync(
            `${__dirname}/database/Loots.json`,
            JSON.stringify(loots),
            "utf8"
          );
        }
      }, 500);

    });
}