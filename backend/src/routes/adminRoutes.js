const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck")
const {userSignupSchema, userCreateSchema} = require("../config/validateData")
const validate = require("../middleware/validate");

router.use(auth);
router.use(roleCheck("SYSTEM_ADMIN"));

router.post("/add-user", validate(userCreateSchema), adminController.addUser);
router.post("/add-store", adminController.addStore)
router.get("/dashboard", adminController.getDashboard)
router.get("/get-users", adminController.getUsers)
// router.get("/get-stores", adminController.getStores)
router.get("/stores", adminController.getStores)

module.exports = router;