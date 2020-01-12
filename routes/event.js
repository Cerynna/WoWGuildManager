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
const lodash = require("lodash")


router.post("/update", async (req, res) => {
  const {
    raid
  } = req.body;
  let raidDB = await Event.findOne({
    where: {
      id: raid.id
    }
  }).then((x) => x)

  raidDB.update({
    ...raid
  }).then((updateRaid) => {
    res.json(updateRaid.get({
      plain: true
    }))
  })
})


router.post("/accept", async (req, res) => {
  const {
    id,
    user
  } = req.body;
  let raid = await Event.findOne({
    where: {
      id: id
    }
  }).then((x) => x)
  let exist = FindInRoster(raid.roster, user)
  let newRaid = raid.get({
    plain: true
  })

  // console.log(exist)
  if (exist) {
    if (exist.indexOf("accept") < 0) {
      newRaid.roster.accept.push({
        user: user,
        date: Date.now()
      })
      // console.log(user, newRaid.roster.refuse)
    }
    if (exist.indexOf("refuse") >= 0) {
      let test = newRaid.roster.refuse.findIndex(userRefuse => {
        // console.log(userAccepte.user)
        return userRefuse.user == user
      })

      delete newRaid.roster.refuse[test]
      newRaid.roster.refuse = lodash.compact(newRaid.roster.refuse)
      // console.log(newRaid.roster.accept)
    }

    if (exist.indexOf("valid") >= 0) {
      // console.log(newRaid.roster.valid)
      newRaid.roster.valid.forEach((grp, iGrp) => {
        if (grp.list.indexOf(user) >= 0) {
          // console.log(newRaid.roster.valid[iGrp].list[grp.list.indexOf(user)])
          delete newRaid.roster.valid[iGrp].list[grp.list.indexOf(user)];
          newRaid.roster.valid[iGrp].list = lodash.compact(newRaid.roster.valid[iGrp].list)

        }
      })
    }
    // console.log(user, newRaid.roster)

  } else {
    // console.log(raid.roster.refuse)
    newRaid.roster.refuse.push({
      user: user,
      date: Date.now()
    })
  }
  raid.roster = newRaid.roster
  await raid.save().then(() => {})
  res.json(true)
})

router.post("/refuse", async (req, res) => {
  const {
    id,
    user
  } = req.body;
  let raid = await Event.findOne({
    where: {
      id: id
    }
  }).then((x) => x)


  let exist = FindInRoster(raid.roster, user)
  let newRaid = raid.get({
    plain: true
  })

  // console.log(exist)
  if (exist) {
    if (exist.indexOf("refuse") < 0) {
      newRaid.roster.refuse.push({
        user: user,
        date: Date.now()
      })
      // console.log(user, newRaid.roster.refuse)
    }
    if (exist.indexOf("accept") >= 0) {
      let test = newRaid.roster.accept.findIndex(userAccepte => {
        // console.log(userAccepte.user)
        return userAccepte.user == user
      })

      delete newRaid.roster.accept[test]
      newRaid.roster.accept = lodash.compact(newRaid.roster.accept)
      // console.log(newRaid.roster.accept)
    }

    if (exist.indexOf("valid") >= 0) {
      // console.log(newRaid.roster.valid)
      newRaid.roster.valid.forEach((grp, iGrp) => {
        if (grp.list.indexOf(user) >= 0) {
          // console.log(newRaid.roster.valid[iGrp].list[grp.list.indexOf(user)])
          delete newRaid.roster.valid[iGrp].list[grp.list.indexOf(user)];
          newRaid.roster.valid[iGrp].list = lodash.compact(newRaid.roster.valid[iGrp].list)

        }
      })
    }
    // console.log(user, newRaid.roster)

  } else {
    // console.log(raid.roster.refuse)
    newRaid.roster.refuse.push({
      user: user,
      date: Date.now()
    })
  }
  raid.roster = newRaid.roster
  await raid.save().then(() => {})
  res.json(true)



  // res.json(true)
})


function FindInRoster(roster, findUser) {
  // console.log(roster, findUser)
  let status = Object.keys(roster);
  let findStatus = [];
  status.map((sta) => {
    if (sta == "valid") {
      let index = [].concat.apply([], roster[sta].map(x => x.list)).indexOf(findUser);
      if (index >= 0) {
        findStatus.push(sta)
      }
    } else {
      roster[sta].forEach((user) => {
        (user.user == findUser) ? findStatus.push(sta): false
      })

    }


  })
  // console.log("test", findStatus)
  return (findStatus.length > 0) ? findStatus : false

}


router.get("/:day/:month/:year", async (req, res) => {
  const {
    day,
    month,
    year
  } = req.params;

  Event.findOne({
    where: {
      d: day,
      m: month,
      y: year
    }
  }).then(event => {
    if (event) {
      event = event.get({
        plain: true
      });
      res.json(event)
    } else {
      res.json(false)
    }

  });
});




// router.get("/api/raids", async (req, res) => {
//   res.json(findAllRaids());
// });
module.exports = router;