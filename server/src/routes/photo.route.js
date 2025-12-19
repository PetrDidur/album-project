const express = require("express");
const PhotoController = require("../controllers/photo.controller");
const isValid = require("../middlewares/isValidId");
const upload = require("../middlewares/upload"); // Предполагается, что у вас есть middleware для загрузки файлов

const router = express.Router();

// Маршруты для фотографий
router.get("/", PhotoController.getAllPhotos);
router.get("/search", PhotoController.searchPhotos);
router.get("/:id", isValid, PhotoController.getPhotoById);
router.get("/album/:albumId", isValid, PhotoController.getPhotosByAlbum);
router.post("/", upload.single("image"), PhotoController.createPhoto);
router.put("/:id", isValid, PhotoController.updatePhoto);
router.delete("/:id", isValid, PhotoController.deletePhoto);

module.exports = router;