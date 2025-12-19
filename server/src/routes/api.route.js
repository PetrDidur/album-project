const express = require("express");
const albumRouter = require('./album.route');
const photoRouter = require('./photo.route');
// const authRouter = require("./auth.route");

const router = express.Router();

router.use('/album', albumRouter)
router.use('/photo', photoRouter);
// router.use('/auth', authRouter)

module.exports = router;