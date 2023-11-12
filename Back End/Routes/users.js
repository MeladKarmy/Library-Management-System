const express = require("express");
const router = express.Router();
const users = require("../Controllers/user");
const Auth = require("../Controllers/Auth");

router.route("/").get(users.getAllUsers).post(users.createUser);
router
  .route("/:id")
  .get(users.getUser)
  .post(users.updateUsers)
  .delete(users.deleteUsers);

module.exports = router;
