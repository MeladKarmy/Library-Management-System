const express = require("express");
const router = express.Router();
const analitics = require("../Controllers/analitics");
const RateLimiter = require("../Utils/limitRequest");
const limiter = new RateLimiter();

router
  .route("/")
  //ADMIN
  .get(analitics.analyticalDataBorrowingBooks);

module.exports = router;
