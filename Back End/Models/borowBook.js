const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "users",
      require: [true, "User ID Is Require"],
    },
    ISBN: {
      type: Number,
      ref: "books",
      require: [true, "ISBN Is Require"],
    },
    checkoutDate: {
      type: Date,
      default: Date.now(),
    },
    dueDate: {
      type: Date,
      require: [true, "Due Date Date Is Require"],
    },
    returnDate: {
      type: Date,
      require: [true, "Return Date Is Require"],
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);
