const express = require("express");
const router = express.Router();
const AuthUser = require("../Controllers/Auth");
router.route("/signup").post(AuthUser.signUp);

router.route("/signin").post(AuthUser.signIn);
router.route("/logout").post(AuthUser.signOut);
module.exports = router;
