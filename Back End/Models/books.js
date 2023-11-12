const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema(
  {
    ISBN: {
      type: Number,
      unique: true,
      require: [true, "ISBN Is Require"],
      minlength: [13, "ISBN Must Be 13 Digit"],
      maxlength: [13, "ISBN Must Be 13 Digit"],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      require: [true, "Title Is Require"],
      lowercase: true,
    },
    author: {
      type: String,
      trim: true,
      require: [true, "Author Is Require"],
      lowercase: true,
    },
    quantity: {
      type: Number,
      trim: true,
      require: [true, "Quantity is Require"],
      min: [0, "Quantity Must Be More Than 0"],
    },
    image: {
      type: String,
      require: [true, "Image Is Require"],
    },
    shelfLocation: {
      type: String,
      require: [true, "Shelf Location is Require"],
    },
  },
  { timestamps: true },
  { _id: false }
);

module.exports = mongoose.model("books", bookSchema);
