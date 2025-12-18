const authRouter = require('express').Router();
const AuthController = require('../controllers/auth.controller');

authRouter.post("/signup", AuthController.signUp);
authRouter.post("/login", AuthController.login);
authRouter.get("/logout", AuthController.logout);

module.exports = authRouter;