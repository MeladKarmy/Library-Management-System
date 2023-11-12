const express = require("express");
const router = express.Router();
const borrowBooks = require("../Controllers/borrowBook");
const Auth = require("../Controllers/Auth");
const RateLimiter = require("../Utils/limitRequest");
const limiter = new RateLimiter();

router.use(Auth.checkUserLogin);

router
  .route("/borrowBook")
  //ADMIN
  .post(limiter.getMiddleware(), Auth.checkRoleAdmin, borrowBooks.borrowBook)
  .get(Auth.checkRoleAdmin, borrowBooks.getAllBorowingBooks);

//USER
router
  .route("/borrowBook/:id")
  .get(borrowBooks.getUserBorowingBooks)
  //ADMIN
  .delete(Auth.checkRoleAdmin, borrowBooks.deleteBorrowBooks);
//ADMIN
router
  .route("/overdueBooks")

  .get(Auth.checkRoleAdmin, borrowBooks.getAllBooksOverdue);
//USER
router
  .route("/overdueBook/:id")

  .get(borrowBooks.getUserBooksOverdue);

router
  .route("/returnBook")
  //ADMIN
  .post(limiter.getMiddleware(), Auth.checkRoleAdmin, borrowBooks.returnBook)
  //ADMIN
  .get(Auth.checkRoleAdmin, borrowBooks.getAllBooksReturned);
//USER
router
  .route("/returnBook/:id")

  .get(borrowBooks.getUserBooksReturned);
//ADMIN
router
  .route("/overdueBooks/lastMonth")

  .get(Auth.checkRoleAdmin, borrowBooks.getAllOverdueBooksBooksLastMonth);
router
  .route("/borrowingBooks/lastMonth")

  .get(Auth.checkRoleAdmin, borrowBooks.getAllBorowingBooksLastMonth);

module.exports = router;
