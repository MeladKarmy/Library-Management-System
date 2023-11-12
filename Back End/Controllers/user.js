const users = require("../Models/users");
const ErrorHandling = require("../Utils/errorHandling");
const asyncHandaler = require("../Utils/handelasync");
const features = require("../Utils/feature");

exports.getAllUsers = asyncHandaler(async (req, res, next) => {
  const feature = new features(users.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let user = await feature.query;
  if (user.length == 0) {
    const err = new ErrorHandling("No Users Found!", 404);
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

exports.getUser = asyncHandaler(async (req, res, next) => {
  const user = await users.findById(req.params.id);

  if (!user) {
    const err = new ErrorHandling("user with that ID is Not Found !", 404);
    return next(err);
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.createUser = asyncHandaler(async (req, res, next) => {
  let checkUser = await users.findOne({ email: req.body.email });
  if (checkUser) {
    const err = new ErrorHandling(
      "user with that ID is Found! , Please try with another Email..",
      404
    );
    return next(err);
  }
  const user = await users.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUsers = asyncHandaler(async (req, res, next) => {
  const updatedUser = await users.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    const error = new ErrorHandling("User with that ID is not found!", 404);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUsers = asyncHandaler(async (req, res, next) => {
  const deletedUser = await users.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    const error = new ErrorHandling("User with that ID is Not Found!", 404);
    return next(error);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
