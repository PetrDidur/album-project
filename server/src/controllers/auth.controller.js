const { User } = require("../../db/models");
const bcrypt = require("bcrypt");
const AuthService = require("../services/auth.service");
const generateTokens = require("../utils/generateTokens");
const cookieConfig = require("../configs/cookieConfig");
const formatResponse = require("../utils/formatResponse");

class AuthController {
  static async signUp(req, res) {
    const { email, password, name } = req.body;
    const { isValid, err } = User.validateSignUpData({ email, password, name });
    if (!isValid) return res.status(400).json(formatResponse(400, err));

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const { user, created } = await AuthService.signUp({
        name,
        email,
        password: hashedPassword,
      });
      if (!created)
        return res.status(400).json(formatResponse(400, "User already exists"));
      const plainUser = user.get();
      delete plainUser.password;
      const { accessToken, refreshToken } = generateTokens({ user: plainUser });
      return res
        .status(201)
        .cookie("refreshToken", refreshToken, cookieConfig.refresh)
        .json(
          formatResponse(201, "Registration successful", {
            user: plainUser,
            accessToken,
          })
        );
    } catch (error) {
      console.log(error);
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const { isValid, err } = User.validateLoginData({ email, password });
    if (!isValid) return res.status(400).json(formatResponse(400, err));
    try {
      const user = await AuthService.getUserByEmail({ email });
      if (!user)
        return res.status(400).json(formatResponse(400, "User not found"));
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res
          .status(400)
          .json(formatResponse(400, "Invalid email or password"));
      const plainUser = user.get();
      delete plainUser.password;
      const { accessToken, refreshToken } = generateTokens({ user: plainUser });
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieConfig.refresh)
        .json(
          formatResponse(201, "Login successful", {
            user: plainUser,
            accessToken,
          })
        );
    } catch (error) {
      console.log(error);
      return res.status(500).json(formatResponse(500, "Server Error"));
    }
  }

  static async logout(req, res) {
    return res
      .clearCookie("refreshToken", cookieConfig.refresh)
      .json(formatResponse(200, "Logout success"));
  }
}
module.exports = AuthController;
