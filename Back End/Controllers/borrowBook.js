const books = require("../Models/books");
const users = require("../Models/users");
const Borrowing = require("../Models/borowBook");
const ErrorHandling = require("../Utils/errorHandling");
const asyncHandaler = require("../Utils/handelasync");
const features = require("../Utils/feature");

//Admin
exports.getAllBorowingBooks = asyncHandaler(async (req, res, next) => {
  const feature = new features(Borrowing.find(), { returnDate: null })
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let user = await feature.query;
  if (user.length == 0) {
    const err = new ErrorHandling("No Borrowing Found!", 404);
    return next(err);
  }

  res.status(200).json({
    status: "success",
    length: user.length,
    data: {
      user,
    },
  });
});
//Admin
exports.getAllBooksOverdue = asyncHandaler(async (req, res, next) => {
  let currentDate = Date.now();
  const feature = new features(Borrowing.find(), {
    dueDate: { lt: currentDate },
    returnDate: null,
  })
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let user = await feature.query;
  if (user.length == 0) {
    const err = new ErrorHandling("No Borrowing Found!", 404);
    return next(err);
  }

  res.status(200).json({
    status: "success",
    length: user.length,
    data: {
      user,
    },
  });
});
//Admin
exports.getAllBooksReturned = asyncHandaler(async (req, res, next) => {
  const feature = new features(Borrowing.find(), {
    returnDate: { $ne: null },
  })
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let user = await feature.query;
  if (user.length == 0) {
    const err = new ErrorHandling("No Returned Books Found!", 404);
    return next(err);
  }

  res.status(200).json({
    status: "success",
    length: user.length,
    data: {
      user,
    },
  });
});

//User
exports.getUserBorowingBooks = asyncHandaler(async (req, res, next) => {
  const feature = new features(Borrowing.find(), {
    userId: req.params.id,
    returnDate: null,
  })
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let user = await feature.query;
  if (user.length == 0) {
    const err = new ErrorHandling(
      "No Borrowing Books Found for This User!",
      404
    );
    return next(err);
  }

  res.status(200).json({
    status: "success",
    length: user.length,
    data: {
      user,
    },
  });
});

//User
exports.getUserBooksOverdue = asyncHandaler(async (req, res, next) => {
  let currentDate = Date.now();
  const feature = new features(Borrowing.find(), {
    userId: req.params.id,
    dueDate: { lt: currentDate },
    returnDate: null,
  })
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let user = await feature.query;
  if (user.length == 0) {
    const err = new ErrorHandling("No Borrowing Found!", 404);
    return next(err);
  }

  res.status(200).json({
    status: "success",
    length: user.length,
    data: {
      user,
    },
  });
});
//User
exports.getUserBooksReturned = asyncHandaler(async (req, res, next) => {
  const feature = new features(Borrowing.find(), {
    userId: req.params.id,
    returnDate: { $ne: null },
  }).filter();

  let user = await feature.query;
  if (user.length == 0) {
    const err = new ErrorHandling(
      "No Returned Books Found For This User ",
      404
    );
    return next(err);
  }

  res.status(200).json({
    status: "success",
    length: user.length,
    data: {
      user,
    },
  });
});
exports.getAllUserBooks = asyncHandaler(async (req, res, next) => {
  let userBooks = await Borrowing.find({ userId: req.params.id }).sort(
    "-checkoutDate"
  );
  if (userBooks.length == 0) {
    const err = new ErrorHandling("No Borrowing Found!", 404);
    return next(err);
  }

  res.status(200).json({
    status: "success",
    length: user.length,
    data: {
      userBooks,
    },
  });
});

exports.getBorrowBook = asyncHandaler(async (req, res, next) => {
  const user = await users.findById(req.params.id);

  if (!user) {
    const err = new ErrorHandling("user with that ID is not found!", 404);
    return next(err);
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.borrowBook = asyncHandaler(async (req, res, next) => {
  let { userId, ISBN, dueDate } = req.body;
  let checkIsUserBorrowSameBook = await Borrowing.findOne({
    userId,
    ISBN,
    returnDate: null,
  });

  if (checkIsUserBorrowSameBook) {
    const err = new ErrorHandling("You are still Borrowing this book", 404);
    return next(err);
  }
  let book = await books.findOne({ ISBN });

  if (!book || book.quantity <= 0) {
    const err = new ErrorHandling("Book not available for check out", 404);
    return next(err);
  }
  let user = await users.findById(userId);
  if (!user) {
    const err = new ErrorHandling("User Not Found !", 404);
    return next(err);
  }
  let newOrder = Borrowing.create({
    ISBN,
    userId,
    dueDate: new Date(Date.now() + dueDate * 24 * 60 * 60 * 1000),
  });
  await books.findOneAndUpdate({ ISBN }, { $inc: { quantity: -1 } });
  await users.findByIdAndUpdate(userId, { $inc: { booksBorrow: 1 } });

  res.status(200).json({
    status: "success",
    data: "You Are Borrow A Book",
  });
});

exports.returnBook = asyncHandaler(async (req, res, next) => {
  let { userId, ISBN } = req.body;
  let checkIsUserBorrowSameBook = await Borrowing.findOne({
    userId,
    ISBN,
    returnDate: null,
  });

  if (!checkIsUserBorrowSameBook) {
    const err = new ErrorHandling(
      "You are still Borrowing this book OR You Don't Have This Book To Return IT",
      404
    );
    return next(err);
  }
  let returnDate = Date.now();
  const updatedBook = await Borrowing.findOneAndUpdate(
    { ISBN, userId },
    { returnDate },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBook) {
    const error = new ErrorHandling(
      "Book OR User with that ID is not found!",
      404
    );
    return next(error);
  }
  await books.findOneAndUpdate({ ISBN }, { $inc: { quantity: 1 } });
  await users.findByIdAndUpdate(userId, { $inc: { booksBorrow: -1 } });

  res.status(200).json({
    status: "success",
    data: {
      book: updatedBook,
    },
  });
});

exports.deleteBorrowBooks = asyncHandaler(async (req, res, next) => {
  const deletedBorrowBook = await books.findByIdAndDelete(req.params.id);

  if (!deletedBorrowBook) {
    const error = new ErrorHandling("This Process With ID is Not Found!", 404);
    return next(error);
  }

  res.status(204).json({
    status: "success",
    data: "Delet Success",
  });
});

//-----------------------------------------------
exports.getAllOverdueBooksBooksLastMonth = asyncHandaler(
  async (req, res, next) => {
    const lastMonthStartDate = new Date();
    lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1);
    lastMonthStartDate.setHours(0, 0, 0, 0);

    const feature = new features(Borrowing.find(), {
      dueDate: { gte: lastMonthStartDate, lte: new Date() },
      returnDate: null,
    })
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let user = await feature.query;
    if (user.length == 0) {
      const err = new ErrorHandling("No Borrowing Found last Month !", 404);
      return next(err);
    }

    res.status(200).json({
      status: "success",
      length: user.length,
      data: {
        user,
      },
    });
  }
);
exports.getAllBorowingBooksLastMonth = asyncHandaler(async (req, res, next) => {
  const lastMonthStartDate = new Date();
  lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1);
  lastMonthStartDate.setHours(0, 0, 0, 0);

  const feature = new features(Borrowing.find(), {
    checkoutDate: { lte: new Date(), gte: lastMonthStartDate },
    returnDate: null,
  })
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let user = await feature.query;
  if (user.length == 0) {
    const err = new ErrorHandling("No Borrowing Found last Month !", 404);
    return next(err);
  }

  res.status(200).json({
    status: "success",
    length: user.length,
    data: {
      user,
    },
  });
});
