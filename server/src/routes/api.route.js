const express = require("express");
const albumRouter = require('./album.route');
// const authRouter = require("./auth.route");

const router = express.Router();

router.use('/album', albumRouter)
// router.use('/auth', authRouter)

module.exports = router;