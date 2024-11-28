const mongoose = require("mongoose");

const classroomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      unique: [true, "Name must be unique!"],
    },
    room_number: {
      type: String,
      required: [true, "Room Number is required!"],
      unique: [true, "Room Number must be unique!"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required!"],
    },
    desc: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Classroom", classroomSchema);
