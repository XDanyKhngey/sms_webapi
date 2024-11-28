const ExamService = require("../services/exam.service");
const examService = new ExamService();

exports.getAllExams = async (req, res) => {
  try {
    // #swagger.tags = ['Exams']
    // #swagger.security = [{ "bearerAuth": [] }]
    const exams = await examService.GetAll();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    // #swagger.tags = ['Exams']
    // #swagger.security = [{ "bearerAuth": [] }]
    const exam = await examService.GetById(req.params.id);
    res.status(200).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createExam = async (req, res) => {
  try {
    // #swagger.tags = ['Exams']
    // #swagger.security = [{ "bearerAuth": [] }]

    const { courseId, exam_name, exam_date, total_marks, desc } = req.body;

    const newExam = await examService.Create({
      courseId,
      exam_name,
      exam_date,
      total_marks,
      desc,
    });
    res.status(201).json(newExam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    // #swagger.tags = ['Exams']
    // #swagger.security = [{ "bearerAuth": [] }]

    const { courseId, exam_name, exam_date, total_marks, desc } = req.body;
    const updatedExam = await examService.Update(req.params.id, {
      courseId,
      exam_name,
      exam_date,
      total_marks,
      desc,
    });
    res.status(200).json(updatedExam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    // #swagger.tags = ['Exams']
    // #swagger.security = [{ "bearerAuth": [] }]
    const result = await examService.Delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
