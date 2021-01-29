'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bounty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.bounty.belongsTo(models.user);
      models.bounty.belongsToMany(models.user, {through: "user_bounties"})
    }
  };
  bounty.init({
    uId: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'bounty',
  });
  return bounty;
};