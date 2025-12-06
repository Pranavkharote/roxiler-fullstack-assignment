const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { loginSchema, userSignupSchema, passwordUpdateSchema } = require("../config/validateData");


router.post("/login", validate(loginSchema), authController.login)
router.post("/register", validate(userSignupSchema), authController.register)
router.patch("/user/update-password",auth, validate(passwordUpdateSchema), authController.updatePassword);

module.exports = router;