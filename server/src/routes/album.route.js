const express = require("express");
const AlbumController = require("../controllers/album.controller");
const isValid = require('../middlewares/isValidId');
const { verifyAccessToken } = require("../middlewares/verifyTokens");
const { verifyAccessToken } = require("../middlewares/verifyTokens");

const router = express.Router();

router.get('/search', AlbumController.searchAlbums)
router.get("/", AlbumController.getAllAlbums);
router.get("/:id", isValid,AlbumController.getAlbumById);
router.post("/",  verifyAccessToken, AlbumController.createAlbum);
router.put("/:id", isValid, AlbumController.updateAlbum);
router.delete("/:id", isValid, AlbumController.deleteAlbum);

module.exports = router;