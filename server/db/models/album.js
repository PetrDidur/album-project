'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as:"owner"
      })
      this.hasMany(models.Photo, {
        foreignKey: "albumId",
        as: 'photos',
        onDelete: "CASCADE"
      })
      this.belongsToMany(models.User, {
        through: models.AlbumAccess,
        foreignKey: 'albumId',
        as: 'allowedUsers'
      })
    }
  }
  Album.init({
    title: DataTypes.STRING,
    desc: DataTypes.TEXT,
    isPrivate: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};