const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    sex: {
      type: String,
      require: [true, "Sex is required!"],
      trim: true,
      enum: ["M", "F"], // Restrict to predefined sex
    },
    degree: {
      type: String,
      required: [
        true,
        "Degree is required!, allow: 'Bachelor', 'Master', 'Doctoral'",
      ],
      trim: true,
      enum: ["Bachelor", "Master", "Doctoral"], // Restrict to predefined sex
    },
    mobile_phone: {
      type: String,
    },
    address: {
      type: String,
      require: [true, "Address is required!"],
    },

    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Teacher", teacherSchema);
