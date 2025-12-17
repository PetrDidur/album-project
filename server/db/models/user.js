'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Album, {
        foreignKey:'userId',
        as: 'albums'
      })
      this.belongsToMany(models.Album, {
        through:models.AlbumAccess, 
        foreignKey: 'userId',
        as: 'sharedAlbums'
      })
    }
  }
  User.init({
    userName: DataTypes.STRING,
    email: DataTypes.TEXT,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};