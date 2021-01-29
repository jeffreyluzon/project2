'use strict';
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.comment)
      // models.user.hasMany(models.bounty, {through: "user_bounty"})
      models.user.belongsToMany(models.bounty, {through: "user_bounties"})
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 25],
          msg: 'name not meet req'
        } 
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'please enter valid email address'
        }
      }
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 99],
          msg: 'password must be created'
        }
      }
    } 
  }, {
    sequelize,
    modelName: 'user',
  });

  user.addHook('beforeCreate', (pendingUser, options)=>{
    console.log(`og password: ${pendingUser.password}`)
    let hashedPassword = bcrypt.hashSync(pendingUser.password, 10)
    console.log(`Hashed password: ${hashedPassword}`)
    pendingUser.password = hashedPassword
  })


  user.prototype.validPassword = async function(passwordInput) {
    let match = await bcrypt.compare(passwordInput, this.password)
    console.log("???????????match:", match)
    return match
  }
  
  return user;
};