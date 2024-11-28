const ParentService = require("../services/parent.service");
const parentService = new ParentService();

exports.getAllParents = async (req, res) => {
  // #swagger.tags = ['Parents']
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const parents = await parentService.GetAll();
    res.status(200).json(parents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParentById = async (req, res) => {
  // #swagger.tags = ['Parents']
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const parent = await parentService.GetById(req.params.id);
    res.status(200).json(parent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createParent = async (req, res) => {
  // #swagger.tags = ['Parents']
  // #swagger.security = [{ "bearerAuth": [] }]

  // Destructure expected properties from req.body
  const {
    firstname,
    lastname,
    dob,
    sex,
    relationship,
    mobile_phone,
    address,
    email,
    password,
    student,
  } = req.body;

  try {
    // Validate if all required fields are present
    if (
      !firstname ||
      !lastname ||
      !dob ||
      !sex ||
      !address ||
      !relationship ||
      !student ||
      !email ||
      !password
    ) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const newParent = await parentService.Create({
      firstname,
      lastname,
      dob,
      sex,
      mobile_phone,
      address,
      relationship,
      email,
      student,
      password,
    });
    res.status(201).json(newParent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateParent = async (req, res) => {
  // #swagger.tags = ['Parents']
  // #swagger.security = [{ "bearerAuth": [] }]
  const { firstname, lastname, dob, sex, mobile_phone, address, relationship } =
    req.body;
  try {
    const updatedParent = await parentService.Update(req.params.id, {
      firstname,
      lastname,
      dob,
      sex,
      mobile_phone,
      address,
      relationship,
    });
    res.status(200).json(updatedParent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteParent = async (req, res) => {
  // #swagger.tags = ['Parents']
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const result = await parentService.Delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
