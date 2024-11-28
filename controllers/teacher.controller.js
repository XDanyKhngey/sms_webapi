const TeacherService = require("../services/teacher.service");
const teacherService = new TeacherService();

exports.getAllTeachers = async (req, res) => {
  try {
    // #swagger.tags = ['Teachers']
    // #swagger.security = [{ "bearerAuth": [] }]
    const teachers = await teacherService.GetAll();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    // #swagger.tags = ['Teachers']
    // #swagger.security = [{ "bearerAuth": [] }]
    const teacher = await teacherService.GetById(req.params.id);
    res.status(200).json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    // #swagger.tags = ['Teachers']
    // #swagger.security = [{ "bearerAuth": [] }]
    const {
      firstname,
      lastname,
      dob,
      sex,
      mobile_phone,
      address,
      degree,
      email,
      password,
    } = req.body;
    const newTeacher = await teacherService.Create({
      firstname,
      lastname,
      dob,
      sex,
      mobile_phone,
      address,
      degree,
      email,
      password,
    });
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    // #swagger.tags = ['Teachers']
    // #swagger.security = [{ "bearerAuth": [] }]
    const { firstname, lastname, dob, sex, mobile_phone, address, degree } =
      req.body;
    const updatedTeacher = await teacherService.Update(req.params.id, {
      firstname,
      lastname,
      dob,
      sex,
      mobile_phone,
      address,
      degree,
    });
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    // #swagger.tags = ['Teachers']
    // #swagger.security = [{ "bearerAuth": [] }]
    const result = await teacherService.Delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
