'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Album, {
        foreignKey: 'albumId', 
        as:'album'
      })
    }

    // Добавляем валидацию по аналогии с Album
    static validate(data) {
      const errors = {};
      
      if (!data.imgUrl || data.imgUrl.trim() === "") {
        errors.imgUrl = "URL изображения обязателен";
      }
      
      if (data.comment && data.comment.length > 500) {
        errors.comment = "Комментарий не может быть длиннее 500 символов";
      }
      
      if (!data.albumId) {
        errors.albumId = "ID альбома обязателен";
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        err: errors,
      };
    }
  }
  
  Photo.init({
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Albums',
        key: 'id',
      },
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    }
  }, {
    sequelize,
    modelName: 'Photo',
    tableName: 'Photos',
  });
  
  return Photo;
};