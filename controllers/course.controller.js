const CourseService = require("../services/course.service");
const courseService = new CourseService();

exports.getAllCourses = async (req, res) => {
  try {
    // #swagger.tags = ['Courses']
    // #swagger.security = [{ "bearerAuth": [] }]
    const courses = await courseService.GetAll();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    // #swagger.tags = ['Courses']
    // #swagger.security = [{ "bearerAuth": [] }]
    const course = await courseService.GetById(req.params.id);
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    // #swagger.tags = ['Courses']
    // #swagger.security = [{ "bearerAuth": [] }]

    const { name, price, desc } = req.body;

    const newCourse = await courseService.Create({ name, price, desc });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    // #swagger.tags = ['Courses']
    // #swagger.security = [{ "bearerAuth": [] }]

    const { name, price, desc } = req.body;
    const updatedCourse = await courseService.Update(req.params.id, {
      name,
      price,
      desc,
    });
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    // #swagger.tags = ['Courses']
    // #swagger.security = [{ "bearerAuth": [] }]
    const result = await courseService.Delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
