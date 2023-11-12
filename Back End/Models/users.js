const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, "Name Is Require"],
    },
    email: {
      type: String,
      trim: true,
      require: [true, "Email Is Require"],
      unique: [true, "Email Is already used please, try another Email ..."],
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      require: [true, "password Is Require"],
      min: [8, "password Is too short"],
    },
    gender: {
      type: String,
      trim: true,
      enum: ["male", "famale"],
      require: [true, "Gender is Require"],
    },
    Role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    booksBorrow: {
      type: Number,
      min: [0, "Books Count Must Be 0 OR More"],
      default: 0,
    },
    dateCreated: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("users", userSchema);
