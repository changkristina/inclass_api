"use strict";
module.exports = function(sequelize, DataTypes) {
  var Favorite = sequelize.define("Favorite", {
    title: DataTypes.STRING,
    plot: DataTypes.TEXT,
    genre: DataTypes.STRING,
    runtime: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Favorite;
};