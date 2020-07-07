'use strict';
module.exports = (sequelize, DataTypes) => {
  var Profile = sequelize.define('Profile', {
    profile_name: {
        type: DataTypes.STRING,
        allowNull: false,
        }
  });

  // create association between user and profile
  // a profile can have many users
  Profile.associate = function(models) {
    models.Profile.hasMany(models.User);
  };
  
  return Profile;
};
 