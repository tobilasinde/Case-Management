'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
           username: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
              len: [3, 50] // must be between 8 and 50.
            }
        },
        
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
            validate: {
                isEmail: true
            }
            // ,            primaryKey: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: true
        },

        last_login: {
            type: DataTypes.DATE
        },

        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        
        // you can also write in a single line without issues
        permission : {type: DataTypes.STRING},
        name:{type: DataTypes.STRING, unique: false},
        module_name: {type: DataTypes.STRING},
        module_id : {type: DataTypes.INTEGER},
        account_id : {type: DataTypes.STRING}
        
  });

 
  User.associate = function (models) {
    
    models.User.hasMany(models.Post);
    models.User.hasMany(models.Comment);
    
    models.User.belongsTo(models.Department, {
    allowNull: true
    });
    
    models.User.belongsTo(models.Profile, {
    allowNull: true
    });
    
    models.User.belongsTo(models.Role, {
    allowNull: true
    });
    
    models.User.belongsTo(models.CurrentBusiness, {
    allowNull: true
    });
    
        
  };
  
  return User;
};
 