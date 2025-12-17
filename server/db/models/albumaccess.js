'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AlbumAccess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here'
      this.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      this.belongsTo(models.Album, {
        foreignKey: 'albumId'
      })
    }
  }
  AlbumAccess.init({
    role: DataTypes.ENUM('viewer', 'editor'),
    defaultValue: 'viewer'
  }, {
    sequelize,
    modelName: 'AlbumAccess',
    tableName: 'AlbumAccess'
  });
  return AlbumAccess;
};