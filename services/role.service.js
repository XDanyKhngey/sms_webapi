const Role = require("../models/role");

class RoleService {
  async getAll() {
    return await Role.find();
  }

  async getById(id) {
    return await Role.findOne({
      _id: id,
    });
  }

  async getByName(name) {
    return await Role.findOne({
      name: name,
    });
  }
}

module.exports = RoleService;
