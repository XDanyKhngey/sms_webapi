const ClassroomService = require("../services/classroom.service");
const classroomService = new ClassroomService();

exports.getAllClassrooms = async (req, res) => {
  try {
    // #swagger.tags = ['Classrooms']
    // #swagger.security = [{ "bearerAuth": [] }]
    const classrooms = await classroomService.GetAll();
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClassroomById = async (req, res) => {
  try {
    // #swagger.tags = ['Classrooms']
    // #swagger.security = [{ "bearerAuth": [] }]
    const classroom = await classroomService.GetById(req.params.id);
    res.status(200).json(classroom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createClassroom = async (req, res) => {
  try {
    // #swagger.tags = ['Classrooms']
    // #swagger.security = [{ "bearerAuth": [] }]

    const { name, room_number, desc, capacity } = req.body;

    const newClassroom = await classroomService.Create({
      name,
      room_number,
      desc,
      capacity,
    });
    res.status(201).json(newClassroom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateClassroom = async (req, res) => {
  try {
    // #swagger.tags = ['Classrooms']
    // #swagger.security = [{ "bearerAuth": [] }]

    const { name, room_number, desc, capacity } = req.body;
    const updatedClassroom = await classroomService.Update(req.params.id, {
      name,
      room_number,
      desc,
      capacity,
    });
    res.status(200).json(updatedClassroom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteClassroom = async (req, res) => {
  try {
    // #swagger.tags = ['Classrooms']
    // #swagger.security = [{ "bearerAuth": [] }]
    const result = await classroomService.Delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
