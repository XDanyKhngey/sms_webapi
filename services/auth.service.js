const { v6: uuidv6 } = require("uuid");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const BcryptService = require("../services/bcrypt.service");
const bcryptService = new BcryptService(12);

const UserService = require("../services/user.service");
const userService = new UserService();

class AuthService {
  async Login(email, password) {
    try {
      const user = await userService.getByEmailWithPassword(email);
      const isCorrectPassword = await bcryptService.comparePassword(
        password,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error(`failed to authenticate : ${error.message}`);
      }
      //generate token
      const refreshToken = uuidv6();

      await userService.updateRefreshToken(user._id, refreshToken);

      const token = jwt.sign(
        { userId: user._id },
        String(process.env.JWT_SECRET),
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );

      const response = {
        access_token: token,
        refresh_token: refreshToken,
      };

      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async RefreshToken(userId, oldRefreshToken) {
    try {
      const user = await userService.getById(userId);
      if (user.refresh_token !== oldRefreshToken) {
        throw new Error("Invalid Refresh Token!");
      }

      const refreshToken = uuidv6();

      await userService.updateRefreshToken(user._id, refreshToken);

      const token = jwt.sign(
        { userId: user._id },
        String(process.env.JWT_SECRET),
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );
      return {
        access_token: token,
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = AuthService;
