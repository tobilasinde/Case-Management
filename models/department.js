'use strict';
module.exports = (sequelize, DataTypes) => {
  var Department = sequelize.define('Department', {
    department_name: {
        type: DataTypes.STRING,
        allowNull: false,
        }
  });

  // create association between user and department
  // a department can have many users
  Department.associate = function(models) {
    models.Department.hasMany(models.User);
    models.Department.hasMany(models.Post);
    models.Department.hasMany(models.Case);
  };
  
  return Department;
};
 