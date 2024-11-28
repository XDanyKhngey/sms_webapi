const bcrypt = require("bcryptjs");

class BcryptService {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  async hashPassword(password) {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw new Error(`Error hashing password: ${error.message}`);
    }
  }

  async comparePassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Error comparing password: ${error.message}`);
    }
  }
}

module.exports = BcryptService;
