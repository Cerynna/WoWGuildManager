const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const privateKey = "forgiven";
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(express.static(path.join(__dirname, "/front/build")));
app.set("trust proxy", 1);
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

const {
  User,
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

app.post("/auth/login", async (req, res) => {
  const { login, pass } = req.body;
  const user = findInDBUser(login);
  if (user) {
    bcrypt.compare(pass, user.pass, function(err, resPass) {
      if (resPass) {
        var token = jwt.sign(user.id, privateKey);
        res.cookie("token", token);
        res.cookie("user", user.id);
        res.cookie("grade", user.grade);
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
    const token = jwt.sign(user.id, privateKey);
    res.cookie("token", token);
    res.cookie("user", user.id);
    res.cookie("grade", user.grade);
    res.json(true);
  }
});
app.post("/auth/verif", async (req, res) => {
  const { token } = req.body;
  jwt.verify(token, privateKey, (err, decoded) => {
    const newToken = jwt.sign(findInDBUser(decoded.name).id, privateKey);
    res.cookie("token", newToken);
    res.cookie("user", user.id);
    res.cookie("grade", user.grade);
    res.json(err ? false : true);
  });
});
app.get("/api/users", async (req, res) => {
  res.json(findAllUsers());
});

app.get("/api/user/name/:name", async (req, res) => {
  res.json(findInDBUser(req.params.name));
});
app.get("/api/user/id/:id", async (req, res) => {
  res.json(findInDBUserbyID(req.params.id));
});

app.post("/api/user/update/", async (req, res) => {
  const { user } = req.body;
  saveInDBUser(user);
  res.json(true);
});

app.get("/api/user/delete/:idUser", async (req, res) => {
  console.log("DELETE");
  const { idUser } = req.params;
  removeUser(idUser);
  res.json(true);
});

app.post("/api/decodeToken", async (req, res) => {
  var decoded = jwt.verify(req.body.token, privateKey);
  res.json(findInDBUser(decoded.name));
});

app.get("/api/raid/:day/:month/:year", async (req, res) => {
  const { day, month, year } = req.params;
  res.json(findInDBRaidbyDate(day, month, year));
});

app.get("/api/raids", async (req, res) => {
  res.json(findAllRaids());
});


// scp root@51.38.190.243:/var/www/WoWGuildManager/ /home/cerynna/Bureau/RecupGuild

app.get("/api/raid/:raidId", async (req, res) => {
  const { raidId } = req.params;
  res.json(findInDBRaidbyID(raidId));
});
app.post("/api/raid/update", async (req, res) => {
  const { raid } = req.body;
  saveInDBRaid(raid);
  res.json(true);
});
app.post("/api/raid/refuse", async (req, res) => {
  const { id, user } = req.body;
  const raid = findInDBRaidbyID(id);
  const { indexAccept, indexRefuse, indexBench } = indexStatusRaidForUser(
    raid,
    user
  );
  if (indexAccept !== "") {
    raid.roster.accept.splice(indexAccept, 1);
  }
  if (indexBench !== "") {
    raid.roster.bench.splice(indexBench, 1);
  }
  if (indexRefuse == "") {
    raid.roster.refuse.push({ user: user, date: Date.now() });
  }

  saveInDBRaid(raid);
  res.json(true);
});
app.post("/api/raid/accept", async (req, res) => {
  const { id, user } = req.body;
  const raid = findInDBRaidbyID(id);

  const { indexAccept, indexRefuse, indexBench } = indexStatusRaidForUser(
    raid,
    user
  );

  if (indexRefuse !== "") {
    raid.roster.refuse.splice(indexRefuse, 1);
  }
  if (indexBench !== "") {
    raid.roster.bench.splice(indexBench, 1);
  }
  if (indexAccept == "") {
    raid.roster.accept.push({ user: user, date: Date.now(), valid: false });
  }
  saveInDBRaid(raid);
  res.json(true);
});
app.post("/api/raid/bench", async (req, res) => {
  const { id, user } = req.body;
  const raid = findInDBRaidbyID(id);

  const { indexAccept, indexRefuse, indexBench } = indexStatusRaidForUser(
    raid,
    user
  );

  if (indexRefuse !== "") {
    raid.roster.refuse.splice(indexRefuse, 1);
  }
  if (indexAccept !== "") {
    raid.roster.accept.splice(indexAccept, 1);
  }
  if (indexBench == "") {
    raid.roster.bench.push({ user: user, date: Date.now() });
  }
  saveInDBRaid(raid);
  res.json(true);
});

app.post("/api/raid/new", async (req, res) => {
  console.log(req.body);
  req.body.id = makeid(10);
  saveInDBRaid(req.body);
  res.json(true);
});

app.get("*", (req, res) => {
  const index = path.join(__dirname, "/front/build/index.html");
  res.sendFile(path.join(index));
});

const port = process.env.NODE_ENV === "development" ? 8000 : 3000;
app.listen(port, async () => {
  console.log(`WOWGUILDMANAGER RUN IN PORT ${port}`);
});
