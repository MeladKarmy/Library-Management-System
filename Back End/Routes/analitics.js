const express = require("express");
const router = express.Router();
const analitics = require("../Controllers/analitics");
const Auth = require("../Controllers/Auth");

router.use(Auth.checkUserLogin);

router
  .route("/")
  //ADMIN
  .get(analitics.analyticalDataBorrowingBooks);

module.exports = router;
