'use strict';
module.exports = (sequelize, DataTypes) => {
  var Role = sequelize.define('Role', {
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        }
  });

  // create association between user and role
  // a can have many users
  Role.associate = function(models) {
    models.Role.hasMany(models.User);
  };
  
  return Role;
};
 
 