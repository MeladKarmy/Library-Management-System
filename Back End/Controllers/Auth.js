const ErrorHandling = require("../Utils/errorHandling");
const asyncHandaler = require("../Utils/handelasync");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

signUp = asyncHandaler(async (req, res, next) => {
  let role = req.body.role;
  let users = role === "student" ? students : "teacher" ? teachers : admin;
  let {
    fNameArabic,
    lNameArabic,
    fNameEnglish,
    lNameEnglish,
    schoolId,
    email,
    password,
    phone,
    age,
    gender,
    classGrade,
  } = req.body;
  let fullNameArabic = fNameArabic + " " + lNameArabic;
  let fullNameEnglish = fNameEnglish + " " + lNameEnglish;
  let user = await users.findOne({ email: req.body.email });
  if (user) {
    let err = new ErrorHandling("Email Already Exists : " + email, 404);
    return next(err);
  }
  let userPhone = await users.findOne({ phone: req.body.phone });

  if (userPhone) {
    let err = new ErrorHandling("Phone Nunmber Already Exists : " + phone, 404);
    return next(err);
  }
  let newUser = await users.create({
    fNameArabic,
    lNameArabic,
    fNameEnglish,
    lNameEnglish,
    fullNameArabic,
    fullNameEnglish,
    schoolId,
    email,
    password,
    phone,
    age,
    gender,
    classGrade,
  });
  return res.status(201).json({
    status: "success",
    massageEn: "Your account Created successfly",
    massageAr: "تم إنشاء حسابك بنجاح",
  });
});

signIn = asyncHandaler(async (req, res, next) => {
  let role = req.body.role;
  let users = role === "student" ? students : "teacher" ? teachers : admin;
  let { email, password } = req.body;
  let user = await users.findOne({ email: req.body.email });
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
  await users.findByIdAndUpdate(user._id, { isOnline: true }, { new: true });
  let token = jwt.sign(
    { data: { id: user.id, email: user.email, role: user.Role } },
    process.env.SECRET_KEY_JWT,
    {
      expiresIn: "1h",
    }
  );
  let tokenName = jwt.sign(
    { data: { nameAr: user.fullNameArabic, nameEn: user.fullNameEnglish } },
    process.env.SECRET_KEY_JWT,
    {
      expiresIn: "1h",
    }
  );
  req.session.token = token;
  req.session.data = tokenName;

  res.cookie("userData", tokenName);
  return res.status(200).json({
    status: "success",
    massageEn: "Welcome to School",
    massageAr: "أهــلا بك داخل المدرسه",
  });
});

signOut = asyncHandaler(async (req, res, next) => {
  let role = req.body.role;
  let users = role === "student" ? students : "teacher" ? teachers : admin;
  let decoded = jwt.verify(req.session.token, process.env.SECRET_KEY_JWT);
  await users.findByIdAndUpdate(
    decoded.data.id,
    { isOnline: false },
    { new: true }
  );
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
  });
  return res.status(200).json({
    status: "success",
    massageEn: "Logged out successfully",
    massageAr: "تم تسجيل الخروج بنجاح",
  });
});
checkUserLogin = asyncHandaler(async (req, res, next) => {
  let role = req.body.role;
  let users = role === "student" ? students : "teacher" ? teachers : admin;

  if (!req.session.token) {
    let err = new ErrorHandling("You Are Not Authurith", 403);
    return next(err);
  }
  let decoded = await jwt.verify(req.session.token, process.env.SECRET_KEY_JWT);
  let decodedName = await jwt.verify(
    req.session.data,
    process.env.SECRET_KEY_JWT
  );

  let user = await users.findById(decoded.data.id);
  if (!user && user._id !== decoded.data.id) {
    let err = new ErrorHandling("You Are Not Authentication", 403);
    return next(err);
  }
  if (
    user.Role !== decoded.data.role &&
    user.fullNameArabic !== decodedName.data.nameAr &&
    user.fullNameEnglish !== decodedName.data.nameEn
  ) {
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
checkRoleAdmin = asyncHandaler(async (req, res, next) => {
  let decoded = await jwt.verify(req.session.token, process.env.SECRET_KEY_JWT);
  if (decoded.data.role !== "admin") {
    let err = new ErrorHandling("You Are Not Authorization ", 403);
    return next(err);
  }
  next();
});
checkRoleSubTeacher = asyncHandaler(async (req, res, next) => {
  let decoded = await jwt.verify(req.session.token, process.env.SECRET_KEY_JWT);
  if (decoded.data.role !== "subTeacher") {
    let err = new ErrorHandling("You Are Not Authorization ", 403);
    return next(err);
  }
  next();
});
checkRoleTeacher = asyncHandaler(async (req, res, next) => {
  let decoded = await jwt.verify(req.session.token, process.env.SECRET_KEY_JWT);
  if (decoded.data.role !== "teacher") {
    let err = new ErrorHandling("You Are Not Authorization", 403);
    return next(err);
  }
  next();
});
getAll = asyncHandaler(async (req, res, next) => {
  let role = req.body.role;
  let users = role === "student" ? students : "teacher" ? teachers : admin;

  let user = await users.find();
  if (!user) {
    let err = new ErrorHandling("no data", 404);
    return next(err);
  }
  res.status(200).json({
    status: "success",
    massageEn: "Welcome to School",
    massageAr: "أهــلا بك داخل المدرسه",
    data: user,
  });
});

module.exports = {
  signUp,
  signIn,
  signOut,
  checkUserLogin,
  checkRoleAdmin,
  checkRoleSubTeacher,
  checkRoleTeacher,
  getAll,
};
