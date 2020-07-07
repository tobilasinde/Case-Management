'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
      post_title: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      post_body: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      CurrentBusinessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      },
      DepartmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      },
      UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      } 
  });
  
  // create post association
  // a post will have a user
  // a field called UserId will be created in our post table inside the db
  Post.associate = function (models) {
    
    models.Post.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    
    models.Post.belongsTo(models.Department, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    
    models.Post.belongsTo(models.CurrentBusiness, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    
    models.Post.belongsToMany(models.Category,{ 
      as: 'categories', 
      through: 'PostCategories',
      foreignKey: 'post_id'
    });
        
  };
  
  return Post;
};

// Make sure you complete other models fields