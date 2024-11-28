const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required!"],
      trim: true,
      unique: [true, "Email must be unique!"],
      minlength: [5, "Email must have at least 5 characters!"],
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address!",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      trim: true,
      select: false,
    },
    refresh_token: {
      type: String,
      trim: true,
    },
    refresh_token_expire: {
      type: Date,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role", // Reference the Role collection
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  },
  { versionKey: false } // Disable versioning
);

module.exports = mongoose.model("User", userSchema);
