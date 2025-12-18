const AlbumService = require("../services/album.service");
const formatResponse = require("../utils/formatResponse");
const { Album } = require("../../db/models");
const fs = require("fs/promises");
const sharp = require("sharp");

class AlbumController {
  static async getAllAlbums(req, res) {
    try {
      const albums = await AlbumService.getAllAlbums();
      if (albums.length === 0)
        return res.status(200).json(formatResponse(200, "Альбомов не найдено"));
      return res
        .status(200)
        .json(formatResponse(200, "Альбомы успешно получены", albums));
    } catch (error) {
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }
  static async getAlbumById(req, res) {
    try {
      const { id } = req.params;
      const album = await AlbumService.getAlbumById(id);
      if (!album) return res.json(formatResponse(200, "Альбом не найден"));
      return res
        .status(200)
        .json(formatResponse(200, "Альбом успешно получен", album), album);
    } catch (error) {
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }
  static async createAlbum(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json(formatResponse(400, "Загрузите фото"));
      }
      const name = `image_${Date.now()}.webp`;
      const outputBuffer = await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toBuffer();
       await fs.mkdir("./public/img", { recursive: true });
      await fs.writeFile(`./public/img/${name}`, outputBuffer);
        const { user } = res.locals;
      if (!req.body)
        return res.status(400).json(formatResponse(400, "Заполни данные"));
      const { title, desc } = req.body;
      const { isValid, err } = Album.validate({ title, desc });
      if (!isValid)
        return res
          .status(400)
          .json(formatResponse(400, "Валидация не прошла", null, err));
      const album = await AlbumService.createAlbum({
        title,
        desc,
        isPrivate: false,
        userId: user.id,
        img: name,
      });
      return res.status(201).json(formatResponse(201, "Альбом создан", album));
    } catch (error) {
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }
  static async updateAlbum(req, res) {
    try {
      const { id } = req.params;
      const album = await AlbumService.updateAlbum(id);
      if (!album) return res.json(formatResponse(200, "Альбом не найден"));
      if (!req.body)
        return res
          .status(400)
          .json(formatResponse(400, "Заполни обязательные поля"));
      const { title, desc, isPrivate } = req.body;
      const { isValid, err } = Album.validate({ title, desc, isPrivate });
      if (!isValid)
        return res
          .status(400)
          .json(formatResponse(400, "Валидация не прошла", null, err));
      const updatedAlbum = await AlbumService.updateAlbum(id, {
        title,
        desc,
        isPrivate,
      });

      return res
        .status(200)
        .json(formatResponse(200, "Альбом успешно обновлен", updatedAlbum));
    } catch (error) {
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }
  static async deleteAlbum(req, res) {
    try {
      const { user } = req.locals;
      const { id } = req.params;
      const album = await AlbumService.getAlbumById(id);
      if (!album) return res.json(formatResponse(200, "Альбом не найден"));
      if (user.id !== album.userId)
        return res.json(
          formatResponse(403, "Вы не можете удалить этот альбом")
        );
      const result = await AlbumService.deleteAlbum(id);
      if (!result) return res.json(formatResponse(200, "Альбом не удалён"));
      return res.status(204).json(formatResponse(204, "Альбом успешно удалён"));
    } catch (error) {
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }
  static async searchAlbums(req, res) {
    try {
      const { filter } = req.query;
      const albums = await AlbumService.searchAlbums(filter);
      if (albums.length === 0)
        return res.status(200).json(formatResponse(200, "Альбомы не найдены"));
      return res
        .status(200)
        .json(formatResponse(200, "Альбомы успешно получены", albums), albums);
    } catch (error) {
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }
}

module.exports = AlbumController;
