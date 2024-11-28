const mongoose = require("mongoose");

const examSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference the Course collection
      required: true,
    },
    exam_name: {
      type: String,
      required: [true, "Exam Name is required!"],
      unique: [true, "Name must be unique!"],
    },
    exam_date: {
      type: Date,
      required: [true, "Date is required!"],
    },
    total_marks: {
      type: Number,
      require: [true, "total mark is required!"],
    },
    desc: {
      type: String,
    },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);
