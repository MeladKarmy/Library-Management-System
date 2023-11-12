const express = require("express");
const router = express.Router();
const users = require("../Controllers/user");
const Auth = require("../Controllers/Auth");

router.use(Auth.checkUserLogin);

router
  .route("/")
  .get(Auth.checkRoleAdmin, users.getAllUsers)
  .post(Auth.checkRoleAdmin, users.createUser);
router
  .route("/:id")
  .get(users.getUser)
  .post(Auth.checkRoleAdmin, users.updateUsers)
  .delete(Auth.checkRoleAdmin, users.deleteUsers);

module.exports = router;
