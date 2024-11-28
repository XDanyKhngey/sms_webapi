const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course Name is required!"],
      unique: [true, "Name must be unique!"],
    },
    price: {
      type: Number,
      require: [true, "Price is required!"],
    },
    desc: {
      type: String,
    },
    isEnable: {
      type: Boolean,
      default: true,
    },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
