const fs = require("fs");

class User {
  constructor(
    name,
    pass = null,
    wishlist = [],
    stuff = Stuff,
    classe = null,
    spe = null,
    grade = null,
    lastlog = Date.now(),
    id = makeid(10)
  ) {
    this.name = name;
    this.pass = pass;
    this.wishlist = wishlist;
    this.stuff = stuff;
    this.classe = classe;
    this.spe = spe;
    this.grade = grade;
    this.lastlog = lastlog;
    this.id = id;
    let user = this;
    if (findInDBUser(this._name)) {
      let DBUser = findInDBUser(this._name);
      Object.keys(DBUser).forEach(element => {
        this[`_${element}`] = DBUser[element];
      });
    }
    saveInDBUser(this);
  }

  set _name(val) {
    this.name = val;
  }
  get _name() {
    return this.name;
  }
  set _wishlist(val) {
    this.wishlist = val;
  }
  get _wishlist() {
    return this.wishlist;
  }
  set _stuff(val) {
    this.stuff = val;
  }
  get _stuff() {
    return this.stuff;
  }
  set _classe(val) {
    this.classe = val;
  }
  get _classe() {
    return this.classe;
  }
  set _spe(val) {
    this.spe = val;
  }
  get _spe() {
    return this.spe;
  }
  set _grade(val) {
    this.grade = val;
  }
  get _grade() {
    return this.grade;
  }
  set _pass(val) {
    this.pass = val;
  }
  get _pass() {
    return this.pass;
  }
  set _lastlog(val) {
    this.lastlog = val;
  }
  get _lastlog() {
    return this.lastlog;
  }
  set _id(val) {
    this.id = val;
  }
  get _id() {
    return this.id;
  }
  get _gradeName() {
    return Grades.find(grade => {
      return grade.id == this.grade;
    });
  }
  fulldata() {
    return {
      name: this.name,
      pass: this.pass,
      wishlist: this.wishlist,
      stuff: this.stuff,
      classe: this.classe,
      spe: this.spe,
      grade: this.grade,
      lastlog: this.lastlog,
      id: this.id
    };
  }
}

class Raid {
  constructor(id, type, name, date, desc, roster = []) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.date = date;
    this.desc = desc;
    this.roster = roster;
  }
}

const findInDBUser = name => {
  var DBUser = JSON.parse(fs.readFileSync(`${__dirname}/Users.json`, "utf8"));
  let findUser = DBUser.find(user => {
    return user.name == name;
  });
  return findUser !== undefined ? findUser : false;
};
const findInDBUserbyID = id => {
  var DBUser = JSON.parse(fs.readFileSync(`${__dirname}/Users.json`, "utf8"));
  let findUser = DBUser.find(user => {
    return user.id == id;
  });
  return findUser !== undefined ? findUser : false;
};

const saveInDBUser = user => {
  var DBUser = JSON.parse(fs.readFileSync(`${__dirname}/Users.json`, "utf8"));

  let indexUser = DBUser.map((currentUser, index) => {
    return currentUser.name == user.name ? index : false;
  })
    .filter(x => x !== false)
    .join();

  if (indexUser == "") {
    indexUser = DBUser.length;
  }
  DBUser[indexUser] = user;
  fs.writeFileSync(`${__dirname}/Users.json`, JSON.stringify(DBUser), "utf8");
};

const findInDBRaidbyID = id => {
  var DBRaid = JSON.parse(fs.readFileSync(`${__dirname}/Raids.json`, "utf8"));
  let findRaid = DBRaid.find(raid => {
    return raid.id == id;
  });
  return findRaid !== undefined ? findRaid : false;
};
const findInDBRaidbyDate = (day, month, year) => {
  var DBRaid = JSON.parse(fs.readFileSync(`${__dirname}/Raids.json`, "utf8"));
  let findRaid = DBRaid.find(raid => {
    return raid.date.d == day && raid.date.m == month && raid.date.y == year;
  });
  return findRaid !== undefined ? findRaid : false;
};

const findAllUsers = () => {
  return JSON.parse(fs.readFileSync(`${__dirname}/Users.json`, "utf8"));
};
const removeUser = idUser => {
  var DBUser = JSON.parse(fs.readFileSync(`${__dirname}/Users.json`, "utf8"));
  console.log(DBUser.length)
  const indexUser = DBUser.map((user, index) =>
    user.id == idUser ? index : false
  )
    .filter(x => x !== false)
    .pop();
  delete DBUser[indexUser];
  console.log(DBUser.length)
  const newDBUser = DBUser.filter(x => x !== null);

  console.log(newDBUser.length)
  fs.writeFileSync(`${__dirname}/Users.json`, JSON.stringify(newDBUser), "utf8");

  return true;
};
// removeUser("a5v2oMBRdC");
const saveInDBRaid = raid => {
  var DBRaid = JSON.parse(fs.readFileSync(`${__dirname}/Raids.json`, "utf8"));
  let indexRaid = DBRaid.map((currentRaid, index) => {
    return currentRaid.id == raid.id ? index : false;
  })
    .filter(x => x !== false)
    .join();
  if (indexRaid == "") {
    indexRaid = DBRaid.length;
  }
  DBRaid[indexRaid] = raid;
  fs.writeFileSync(`${__dirname}/Raids.json`, JSON.stringify(DBRaid), "utf8");
};
const indexStatusRaidForUser = (raid, user) => {
  let indexAccept = raid.roster.accept
    .map((currentUser, index) => {
      return currentUser.user == user ? index : false;
    })
    .filter(x => x !== false)
    .join();
  let indexRefuse = raid.roster.refuse
    .map((currentUser, index) => {
      return currentUser.user == user ? index : false;
    })
    .filter(x => x !== false)
    .join();

  return { indexAccept, indexRefuse };
};

const Grades = [
  { id: 0, name: "Membre" },
  { id: 2, name: "Officier" },
  { id: 9, name: "Maitre de Guilde" }
];
const Stuff = [
  { name: "Tete", type: "head", item: null },
  { name: "Mains", type: "hands", item: null },
  { name: "Colier", type: "neck", item: null },
  { name: "Ceinture", type: "waist", item: null },
  { name: "Epaulière", type: "shoulder", item: null },
  { name: "Jambieres", type: "legs", item: null },
  { name: "Torse", type: "chest", item: null },
  { name: "Pieds", type: "feet", item: null },
  { name: "Bracelets", type: "wrists", item: null },
  { name: "Doigt 1", type: "finger", item: null },
  { name: "Doigt 2", type: "finger", item: null },
  { name: "Bijou 1", type: "trinket", item: null },
  { name: "ijou 2", type: "trinket", item: null },
  { name: "Arme Principal", type: "mainhand", item: null },
  { name: "Arme Secondaire", type: "offhand", item: null },
  { name: "Relic/Idole/Arme Distant/", type: "relic", item: null }
];
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
module.exports = {
  User,
  Stuff,
  Grades,
  makeid,
  findInDBUser,
  findAllUsers,
  findInDBUserbyID,
  saveInDBUser,
  removeUser,
  findInDBRaidbyID,
  findInDBRaidbyDate,
  saveInDBRaid,
  indexStatusRaidForUser
};
