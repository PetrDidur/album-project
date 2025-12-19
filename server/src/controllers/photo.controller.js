const PhotoService = require("../services/photo.service");
const formatResponse = require("../utils/formatResponse");
const { Photo } = require("../../db/models");
const fs = require("fs/promises");
const sharp = require("sharp");

class PhotoController {
  // Получить все фотографии
  static async getAllPhotos(req, res) {
    try {
      const photos = await PhotoService.getAllPhotos();
      if (photos.length === 0) {
        return res.status(200).json(formatResponse(200, "Фотографии не найдены"));
      }
      return res
        .status(200)
        .json(formatResponse(200, "Фотографии успешно получены", photos));
    } catch (error) {
      console.error(error);
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }

  // Получить фотографию по ID
  static async getPhotoById(req, res) {
    try {
      const { id } = req.params;
      const photo = await PhotoService.getPhotoById(id);
      if (!photo) {
        return res.status(404).json(formatResponse(404, "Фотография не найдена"));
      }
      return res
        .status(200)
        .json(formatResponse(200, "Фотография успешно получена", photo));
    } catch (error) {
      console.error(error);
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }

  // Получить фотографии по альбому
  static async getPhotosByAlbum(req, res) {
    try {
      const { albumId } = req.params;
      const photos = await PhotoService.getPhotosByAlbum(albumId);
      if (photos.length === 0) {
        return res.status(200).json(formatResponse(200, "Фотографии в альбоме не найдены"));
      }
      return res
        .status(200)
        .json(formatResponse(200, "Фотографии альбома успешно получены", photos));
    } catch (error) {
      console.error(error);
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }

  // Создать фотографию
  static async createPhoto(req, res) {
    try {
      const { user } = res.locals;
      const { albumId, comment } = req.body;

      if (!req.file) {
        return res.status(400).json(formatResponse(400, "Загрузите изображение"));
      }

      if (!albumId) {
        return res.status(400).json(formatResponse(400, "Укажите ID альбома"));
      }

      // Валидация данных
      const { isValid, err } = Photo.validate({ imgURL: "temp", comment });
      if (!isValid) {
        return res
          .status(400)
          .json(formatResponse(400, "Валидация не прошла", null, err));
      }

      // Обработка изображения
      const name = `photo_${Date.now()}.webp`;
      const outputBuffer = await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toBuffer();

      await fs.mkdir("./public/photos", { recursive: true });
      await fs.writeFile(`./public/photos/${name}`, outputBuffer);

      const imgURL = `/photos/${name}`;

      // Создание фотографии
      const photo = await PhotoService.createPhoto({
        albumId,
        imgURL,
        comment: comment || null,
      });

      return res.status(201).json(formatResponse(201, "Фотография создана", photo));
    } catch (error) {
      console.error(error);
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }

  // Обновить фотографию
  static async updatePhoto(req, res) {
    try {
      const { id } = req.params;
      const { comment } = req.body;

      // Проверка существования фотографии
      const existingPhoto = await PhotoService.getPhotoById(id);
      if (!existingPhoto) {
        return res.status(404).json(formatResponse(404, "Фотография не найдена"));
      }

      // Валидация
      const { isValid, err } = Photo.validate({ 
        imgURL: existingPhoto.imgURL, 
        comment 
      });
      if (!isValid) {
        return res
          .status(400)
          .json(formatResponse(400, "Валидация не прошла", null, err));
      }

      // Обновление (только комментария, т.к. imgURL не меняем через update)
      const updatedPhoto = await PhotoService.updatePhoto(id, { 
        imgURL: existingPhoto.imgURL, 
        comment 
      });

      return res
        .status(200)
        .json(formatResponse(200, "Фотография успешно обновлена", updatedPhoto));
    } catch (error) {
      console.error(error);
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }

  // Удалить фотографию
  static async deletePhoto(req, res) {
    try {
      const { user } = res.locals;
      const { id } = req.params;

      const photo = await PhotoService.getPhotoById(id);
      if (!photo) {
        return res.status(404).json(formatResponse(404, "Фотография не найдена"));
      }

      // Проверка прав (владелец альбома может удалять фото)
      if (user.id !== photo.album.userId) {
        return res
          .status(403)
          .json(formatResponse(403, "Вы не можете удалить эту фотографию"));
      }

      // Удаление файла с диска
      if (photo.imgURL) {
        const filePath = `./public${photo.imgURL}`;
        try {
          await fs.unlink(filePath);
        } catch (fileError) {
          console.error("Ошибка при удалении файла:", fileError);
        }
      }

      // Удаление из БД
      await PhotoService.deletePhoto(id);

      return res.status(204).json(formatResponse(204, "Фотография успешно удалена"));
    } catch (error) {
      console.error(error);
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }

  // Поиск фотографий
  static async searchPhotos(req, res) {
    try {
      const { search } = req.query;
      
      if (!search || search.trim() === "") {
        return res.status(400).json(formatResponse(400, "Введите поисковый запрос"));
      }

      const photos = await PhotoService.searchPhotos(search);
      
      if (photos.length === 0) {
        return res.status(200).json(formatResponse(200, "Фотографии не найдены"));
      }
      
      return res
        .status(200)
        .json(formatResponse(200, "Фотографии успешно получены", photos));
    } catch (error) {
      console.error(error);
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }
}

module.exports = PhotoController;