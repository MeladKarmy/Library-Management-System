const express = require("express");
const router = express.Router();
const analitics = require("../Controllers/analitics");
const RateLimiter = require("../Utils/limitRequest");
const limiter = new RateLimiter();

router
  .route("/")
  //ADMIN
  .get(analitics.ANALITICS);

module.exports = router;
