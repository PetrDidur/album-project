const { Photo, Album } = require("../../db/models");
const { Op } = require("sequelize");

class PhotoService {
  // Получить все фотографии
  static async getAllPhotos() {
    return Photo.findAll({
      include: [
        {
          model: Album,
          as: "album",
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // Получить фотографию по ID
  static async getPhotoById(id) {
    return Photo.findByPk(id, {
      include: [
        {
          model: Album,
          as: "album",
          attributes: ["id", "title", "userId"],
        },
      ],
    });
  }

  // Получить фотографии по альбому
  static async getPhotosByAlbum(albumId) {
    return Photo.findAll({
      where: { albumId },
      include: [
        {
          model: Album,
          as: "album",
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // Создать фотографию
  static async createPhoto({ albumId, imgURL, comment }) {
    return Photo.create({ albumId, imgURL, comment });
  }

  // Обновить фотографию
  static async updatePhoto(id, { imgURL, comment }) {
    await Photo.update({ imgURL, comment }, { where: { id } });
    return Photo.findByPk(id);
  }

  // Удалить фотографию
  static async deletePhoto(id) {
    return Photo.destroy({ where: { id } });
  }

  // Поиск фотографий по комментарию
  static async searchPhotos(search) {
    return Photo.findAll({
      where: {
        comment: {
          [Op.like]: `%${search}%`,
        },
      },
      include: [
        {
          model: Album,
          as: "album",
          attributes: ["id", "title"],
        },
      ],
    });
  }
}

module.exports = PhotoService;