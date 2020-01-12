"use strict";
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

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      pseudo: DataTypes.STRING,
      login: DataTypes.STRING,
      classe: DataTypes.STRING,
      password: DataTypes.STRING,
      grade: DataTypes.STRING,
      spec: DataTypes.STRING,
      hash: {
        type: DataTypes.STRING,
        defaultValue: makeid(10)
      }
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
    // User.hasOne(models.Wishlist, {
    //   as: "wishlist"
    // })
    // User.belongsTo(models.Wishlist, {
    //   foreignKey: "wishlistId "
    // });
  };
  return User;
};
