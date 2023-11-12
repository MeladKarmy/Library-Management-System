const books = require("../Models/books");
const ErrorHandling = require("../Utils/errorHandling");
const asyncHandaler = require("../Utils/handelasync");
const features = require("../Utils/feature");

exports.getAllBooks = asyncHandaler(async (req, res, next) => {
  const feature = new features(books.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let user = await feature.query;
  if (user.length == 0) {
    const err = new ErrorHandling("No books Found!", 404);
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

exports.getBook = asyncHandaler(async (req, res, next) => {
  const book = await books.findOne({ ISBN: req.params.id });

  if (!book) {
    const err = new ErrorHandling("Book with that ID is not found!", 404);
    return next(err);
  }
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.createBook = asyncHandaler(async (req, res, next) => {
  let checkBook = await books.findOne({ ISBN: req.body.ISBN });
  if (checkBook) {
    const err = new ErrorHandling("Book with that ID is Found!", 404);
    return next(err);
  }
  const book = await books.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.updateBooks = asyncHandaler(async (req, res, next) => {
  const updatedBook = await books.findOneAndUpdate(
    { ISBN: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBook) {
    const error = new ErrorHandling("Book with that ID is not found!", 404);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      book: updatedBook,
    },
  });
});

exports.deleteBooks = asyncHandaler(async (req, res, next) => {
  const deletedBook = await books.findOneAndDelete({ ISBN: req.params.id });

  if (!deletedBook) {
    const error = new ErrorHandling("Book with that ID is not found!", 404);
    return next(error);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
