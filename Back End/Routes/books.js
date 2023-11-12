const express = require("express");
const router = express.Router();
const books = require("../Controllers/book");
const Auth = require("../Controllers/Auth");

router.use(Auth.checkUserLogin);

router.route("/").get(books.getAllBooks).post(books.createBook);
router
  .route("/:id")
  .get(books.getBook)
  .post(books.updateBooks)
  .delete(books.deleteBooks);

module.exports = router;
