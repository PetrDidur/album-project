const { Album } = require("../db/models");
const { Op } = require("sequelize");

class AlbumService {
  static async getAllAlbums() {
    return Album.findAll({ order: [["createdAt", "DESC"]] });
  }
  static async getAlbumById(id) {
    return Album.findByPk(id);
  }
  static async createAlbum({ title, desc, isPrivate, userId, img }) {
    return Album.create({ title, desc, isPrivate, userId, img });
  }
  static async updateAlbum(id, { title, desc, isPrivate }) {
   await Album.update({ title, desc, isPrivate }, { where: { id } });
   return Album.findByPk(id);
  }
  static async deleteAlbum(id) {
    return Album.destroy({ where: { id } });
    return true
  }
  static async searchAlbums(searh) {
    return Album.findAll({ where: { [Op.or]: [
        {title: { [Op.like]: `%${searh}%` } } ,
        {desc: { [Op.like]: `%${searh}%` } }
      ] }
    });
  }
}

module.exports = AlbumService;
