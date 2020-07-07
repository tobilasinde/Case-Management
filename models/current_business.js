'use strict';
module.exports = (sequelize, DataTypes) => {
  var CurrentBusiness = sequelize.define('CurrentBusiness', {
       current_business_name: {
        type: DataTypes.STRING,
        allowNull: false,
        }
  });
 
  // create association between current business and user
  // a current business can have many users
  CurrentBusiness.associate = function(models) {
    models.CurrentBusiness.hasMany(models.User);
    models.CurrentBusiness.hasMany(models.Post);
  };
  
  // CurrentBusiness.associate = function(models) {
  //   models.CurrentBusiness.belongsToMany(models.User,{ 
  //     as: 'users', 
  //     through: 'UserCurrentBusinesses',
  //     foreignKey: 'currentbusiness_id'
  //   });
  //   models.CurrentBusiness.hasMany(models.Post);
  // };
  
  return CurrentBusiness;
};

 