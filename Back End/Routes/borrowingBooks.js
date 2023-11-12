const express = require("express");
const router = express.Router();
const borrowBooks = require("../Controllers/borrowBook");
const RateLimiter = require("../Utils/limitRequest");
const limiter = new RateLimiter();

router
  .route("/borrowBook")
  //ADMIN
  .post(limiter.getMiddleware(), borrowBooks.borrowBook)
  .get(borrowBooks.getAllBorowingBooks);

//USER
router
  .route("/borrowBook/:id")
  .get(borrowBooks.getUserBorowingBooks)
  //ADMIN
  .delete(borrowBooks.deleteBorrowBooks);
//ADMIN
router
  .route("/overdueBooks")

  .get(borrowBooks.getAllBooksOverdue);
//USER
router
  .route("/overdueBook/:id")

  .get(borrowBooks.getUserBooksOverdue);

router
  .route("/returnBook")
  //ADMIN
  .post(limiter.getMiddleware(), borrowBooks.returnBook)
  //ADMIN
  .get(borrowBooks.getAllBooksReturned);
//USER
router
  .route("/returnBook/:id")

  .get(borrowBooks.getUserBooksReturned);
router
  .route("/overdueBooks/lastMonth")

  .get(borrowBooks.getAllOverdueBooksBooksLastMonth);
router
  .route("/borrowingBooks/lastMonth")

  .get(borrowBooks.getAllBorowingBooksLastMonth);

module.exports = router;
