const ErrorHandling = require("../Utils/errorHandling");
const asyncHandaler = require("../Utils/handelasync");
const users = require("../Models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");

exports.signUp = asyncHandaler(async (req, res, next) => {
  let user = await users.findOne({ email: req.body.email });
  if (user) {
    let err = new ErrorHandling(
      "Email Already Exists : " + req.body.email,
      404
    );
    return next(err);
  }
  let newUser = await users.create(req.body);
  return res.status(201).json({
    status: "success",
    massage: "Your account Created successfly",
  });
});

exports.signIn = asyncHandaler(async (req, res, next) => {
  let { email, password } = req.body;
  let user = await users.findOne({ email: email });
  if (!user) {
    let err = new ErrorHandling("Email Is not Exists: " + email, 403);
    return next(err);
  }
  let checkPass = await bcrypt.compare(password, user.password);
  if (!checkPass) {
    let err = new ErrorHandling(
      "Password OR Email Invalid Please, Try again",
      404
    );
    return next(err);
  }
  let token = jwt.sign(
    { data: { id: user._id, email: user.email, role: user.Role } },
    process.env.SECRET_KEY_JWT,
    {
      expiresIn: "1h",
    }
  );
  req.session.token = token;

  return res.status(200).json({
    status: "success",
    massage: "Login Successfly",
  });
});

exports.signOut = asyncHandaler(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
  });
  return res.status(200).json({
    status: "success",
    massage: "Logged out successfully",
  });
});
exports.checkUserLogin = asyncHandaler(async (req, res, next) => {
  if (!req.session.token) {
    let err = new ErrorHandling("You Are Not Authurith", 403);
    return next(err);
  }
  let decoded = await jwt.verify(req.session.token, process.env.SECRET_KEY_JWT);

  let user = await users.findById(decoded.data.id);
  if (!user && user._id !== decoded.data.id) {
    let err = new ErrorHandling("You Are Not Authentication", 403);
    return next(err);
  }

  if (decoded.exp * 1000 < Date.now()) {
    let err = new ErrorHandling(
      "Login Time Out , Please Try login again ...",
      403
    );
    return next(err);
  }
  next();
});
exports.checkRoleAdmin = asyncHandaler(async (req, res, next) => {
  let decoded = await jwt.verify(req.session.token, process.env.SECRET_KEY_JWT);
  if (decoded.data.role !== "admin") {
    let err = new ErrorHandling("You Are Not Authorization ", 403);
    return next(err);
  }
  next();
});
