const AuthService = require("../services/auth.service");
const authService = new AuthService();

exports.login = async (req, res) => {
  // #swagger.tags = ['Authentication']
  try {
    const { email, password } = req.body;
    const result = await authService.Login(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Error",
      error: "incorrect email or password",
      detail: error.message,
    });
  }
};

exports.refreshToken = async (req, res) => {
  // #swagger.tags = ['Authentication']
  try {
    const { userId, refreshToken } = req.body;
    const result = await authService.RefreshToken(userId, refreshToken);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Error",
      error: "failed to retrieve refresh token",
      detail: error.message,
    });
  }
};
