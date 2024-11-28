const mongoose = require("mongoose");

const parentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Reference the student collection
      required: true,
    },
  ],
  firstname: {
    type: String,
    required: [true, "Firstname is required!"],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, "Lastname is required!"],
    trim: true,
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth is required!"],
  },
  relationship: {
    type: String,
    require: [true, "Relationship is required!"],
    trim: true,
    enum: ["Mother", "Father", "Guardian", "Other"], // Restrict to predefined sex
  },
  sex: {
    type: String,
    require: [true, "Sex is required!"],
    trim: true,
    enum: ["M", "F"], // Restrict to predefined sex
  },
  mobile_phone: {
    type: String,
  },
  address: {
    type: String,
    require: [true, "Address is required!"],
  },
});

module.exports = mongoose.model("Parent", parentSchema);
