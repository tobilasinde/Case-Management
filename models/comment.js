'use strict';
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('Comment', {
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
        }
  });

  // create association between user and role
  // a can have many users
  Comment.associate = function(models) {
    models.Comment.belongsTo(models.Case, {
        onDelete: "CASCADE",
        foreignKey: {
          allowNull: false
        }
      });
  };
  
  return Comment;
};
 
 