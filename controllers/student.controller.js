const StudentService = require("../services/student.service");
const studentService = new StudentService();

exports.getAllStudents = async (req, res) => {
  // #swagger.tags = ['Students']
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const students = await studentService.GetAll();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  // #swagger.tags = ['Students']
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const student = await studentService.GetById(req.params.id);
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createStudent = async (req, res) => {
  // #swagger.tags = ['Students']
  // #swagger.security = [{ "bearerAuth": [] }]

  // Destructure expected properties from req.body
  const {
    firstname,
    lastname,
    dob,
    sex,
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
      !email ||
      !password
    ) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const newStudent = await studentService.Create({
      firstname,
      lastname,
      dob,
      sex,
      mobile_phone,
      address,
      email,
      password,
      student,
    });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  // #swagger.tags = ['Students']
  // #swagger.security = [{ "bearerAuth": [] }]
  const { firstname, lastname, dob, sex, mobile_phone, address } = req.body;
  try {
    const updatedStudent = await studentService.Update(req.params.id, {
      firstname,
      lastname,
      dob,
      sex,
      mobile_phone,
      address,
    });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  // #swagger.tags = ['Students']
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const result = await studentService.Delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
