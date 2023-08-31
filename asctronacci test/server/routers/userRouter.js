const userController = require("../controllers/userController");
const express = require("express");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);

router.post("/google-sign-in", userController.googleLogIn);

module.exports = router;
