const csvFilePath = "database/loots.csv";
const csv = require("csvtojson");
const finder = { name: "céna" };
csv()
  .fromFile(csvFilePath)
  .then(loots => {
    // console.log(jsonObj);
    loots = loots.map(loot => {
      loot.boss = [loot.boss1, loot.boss2, loot.boss3, loot.boss4];
      delete loot.boss1;
      delete loot.boss2;
      delete loot.boss3;
      delete loot.boss4;
      return loot;
    });

    if (finder.name) {
      loots = loots
        .map(loot => {
          return loot.name.toLowerCase().indexOf(finder.name) >= 0 ? loot : false;
        })
        .filter(x => x);
    }

    console.log(loots);
    return loots
  });
