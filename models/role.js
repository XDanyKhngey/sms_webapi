const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required!"],
      unique: [true, "Role name must be unique!"],
      trim: true,
      enum: ["admin", "student", "teacher", "parent"], // Restrict to predefined roles
    },
    description: {
      type: String,
      trim: true,
    },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  },
  { versionKey: false } // Disable versioning
);

module.exports = mongoose.model("Role", roleSchema);
