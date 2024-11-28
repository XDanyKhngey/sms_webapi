const UserService = require("../services/user.service");
const userService = new UserService();

const RoleService = require("../services/role.service");
const roleService = new RoleService();

// Get all users
exports.getUsers = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.security = [{ "bearerAuth": [] }]
  const userId = req.params.id;
  try {
    const user = await userService.getById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Get user by ID
exports.changePassword = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.security = [{ "bearerAuth": [] }]
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;
  try {
    const result = await userService.changePassword(
      userId,
      currentPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.security = [{ "bearerAuth": [] }]
  const { email, password, role } = req.body;

  const errors = [];

  // Validate that required fields are present
  if (!email || !password || !role) {
    errors.push("Missing required fields");
  }

  // Validate role
  try {
    const roleObject = await roleService.getById(role); // Use roleService.getById to fetch role
    if (!roleObject) {
      errors.push("Role not found");
    }
  } catch (error) {
    errors.push(error.message);
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation errors", errors });
  }

  try {
    const result = await userService.create({ email, password, role });
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    // Handle other errors
    const responseErrors = [];
    if (error.name === "ValidationError") {
      for (const field in error.errors) {
        responseErrors.push(error.errors[field].message);
      }
    } else {
      responseErrors.push(error.message);
    }
    res
      .status(500)
      .json({ message: "Error creating user", errors: responseErrors });
  }
};
