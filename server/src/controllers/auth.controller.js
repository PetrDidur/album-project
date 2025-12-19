const { User } = require("../../db/models");
const bcrypt = require("bcrypt");
const AuthService = require("../services/auth.service");
const generateTokens = require("../utils/generateTokens");
const cookieConfig = require("../configs/cookieConfig");
const formatResponse = require("../utils/formatResponse");

class AuthController {
  static async signUp(req, res) {
    try {
      console.log("=== SIGNUP REQUEST ===");
      console.log("Request body:", req.body);

      const { email, password, name } = req.body;

      // Проверяем обязательные поля
      if (!email || !password || !name) {
        console.log("Missing required fields");
        return res
          .status(400)
          .json(formatResponse(400, "Email, password and name are required"));
      }

      // Преобразуем name в userName для валидации
      const validationData = {
        name, // <-- ИСПРАВЛЕНО: передаём name, а не userName
        email,
        password,
      };

      console.log("Validation data:", validationData);

      // Проверяем, существует ли метод validateSignUpData
      if (!User.validateSignUpData) {
        console.error("User.validateSignUpData method not found!");
        return res
          .status(500)
          .json(formatResponse(500, "Server configuration error"));
      }

      const { isValid, err } = User.validateSignUpData(validationData);

      if (!isValid) {
        console.log("Validation failed:", err);
        return res.status(400).json(formatResponse(400, err));
      }

      console.log("Validation passed");

      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed");

      // Создаем пользователя через сервис
      const userData = {
        name, // <-- передаём как name
        email,
        password: hashedPassword,
      };

      console.log("Calling AuthService.signUp with:", userData);

      const { user, created } = await AuthService.signUp(userData);

      if (!created) {
        console.log("User already exists with email:", email);
        return res
          .status(400)
          .json(formatResponse(400, "User with this email already exists"));
      }

      console.log("User created successfully");

      // Получаем plain объект пользователя
      const plainUser = user.get();
      console.log("User from DB:", plainUser);

      // Удаляем пароль из ответа
      delete plainUser.password;

      // Преобразуем userName обратно в name для фронтенда
      const userResponse = {
        ...plainUser,
        name: plainUser.userName, // Переименовываем userName в name
      };
      delete userResponse.userName; // Удаляем поле userName

      console.log("User response for frontend:", userResponse);

      // Генерируем токены
      const { accessToken, refreshToken } = generateTokens({
        user: { ...userResponse, id: plainUser.id },
      });

      console.log("Tokens generated");

      // Отправляем ответ
      return res
        .status(201)
        .cookie("refreshToken", refreshToken, cookieConfig.refresh)
        .json(
          formatResponse(201, "Registration successful", {
            user: userResponse,
            accessToken,
          })
        );
    } catch (error) {
      console.error("=== SIGNUP ERROR ===");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // Проверяем специфичные ошибки Sequelize
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json(formatResponse(400, "User with this email already exists"));
      }

      if (error.name === "SequelizeValidationError") {
        return res
          .status(400)
          .json(
            formatResponse(400, error.errors.map((e) => e.message).join(", "))
          );
      }

      return res
        .status(500)
        .json(formatResponse(500, "Server Error: " + error.message));
    }
  }

  static async login(req, res) {
    try {
      console.log("=== LOGIN REQUEST ===");
      console.log("Request body:", req.body);

      const { email, password } = req.body;

      // Проверяем обязательные поля
      if (!email || !password) {
        console.log("Missing email or password");
        return res
          .status(400)
          .json(formatResponse(400, "Email and password are required"));
      }

      // Проверяем, существует ли метод validateLoginData
      if (!User.validateLoginData) {
        console.error("User.validateLoginData method not found!");
        return res
          .status(500)
          .json(formatResponse(500, "Server configuration error"));
      }

      const { isValid, err } = User.validateLoginData({ email, password });

      if (!isValid) {
        console.log("Login validation failed:", err);
        return res.status(400).json(formatResponse(400, err));
      }

      console.log("Login validation passed");

      // Ищем пользователя
      console.log("Searching for user with email:", email);
      const user = await AuthService.getUserByEmail({ email });

      if (!user) {
        console.log("User not found for email:", email);
        return res
          .status(400)
          .json(formatResponse(400, "Invalid email or password"));
      }

      console.log("User found:", user.email);

      // Проверяем пароль
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log("Invalid password for email:", email);
        return res
          .status(400)
          .json(formatResponse(400, "Invalid email or password"));
      }

      console.log("Password valid");

      // Получаем plain объект пользователя
      const plainUser = user.get();

      // Удаляем пароль из ответа
      delete plainUser.password;

      // Преобразуем userName в name для фронтенда
      const userResponse = {
        ...plainUser,
        name: plainUser.userName, // Переименовываем userName в name
      };
      delete userResponse.userName; // Удаляем поле userName

      console.log("User response for login:", userResponse);

      // Генерируем токены
      const { accessToken, refreshToken } = generateTokens({
        user: { ...userResponse, id: plainUser.id },
      });

      console.log("Login tokens generated");

      // Отправляем ответ
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieConfig.refresh)
        .json(
          formatResponse(200, "Login successful", {
            user: userResponse,
            accessToken,
          })
        );
    } catch (error) {
      console.error("=== LOGIN ERROR ===");
      console.error("Error:", error);
      return res
        .status(500)
        .json(formatResponse(500, "Server Error: " + error.message));
    }
  }

  static async logout(req, res) {
    try {
      console.log("=== LOGOUT REQUEST ===");

      return res
        .clearCookie("refreshToken", cookieConfig.refresh)
        .json(formatResponse(200, "Logout successful"));
    } catch (error) {
      console.error("Logout error:", error);
      return res
        .status(500)
        .json(formatResponse(500, "Server Error: " + error.message));
    }
  }
  static async refreshTokens(req, res) {
    try {
      const { user } = res.locals;

      const { accessToken, refreshToken } = generateTokens({ user });

      res.status(200).cookie('refreshToken', refreshToken, cookieConfig.refresh).json(
         formatResponse(200, 'Success', {
          user,
          accessToken,
        }),
      );
    } catch (error) {
      console.log(error);
      res.status(500).json(formatResponse(500, 'Server Error'));
    }
  }
}

module.exports = AuthController;
