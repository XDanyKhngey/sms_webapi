const RoleService = require("../services/role.service");
const roleService = new RoleService();

exports.getAll = async (req, res) => {
  // #swagger.tags = ['Roles']
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const roles = await roleService.getAll();
    res.json(roles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch datas", error: error.message });
  }
};

exports.getById = async (req, res) => {
  // #swagger.tags = ['Roles']
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const roleId = req.params.id;
    const roles = await roleService.getById(roleId);
    res.json(roles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch datas", error: error.message });
  }
};
