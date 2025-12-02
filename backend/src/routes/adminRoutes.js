const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck")

router.use(auth);
router.use(roleCheck("SYSTEM_ADMIN"));

router.post("/add-user", adminController.addUser);
router.post("/add-store", adminController.addStore)
router.get("/dashboard", adminController.getDashboard)
router.get("/get-users", adminController.getUsers)
router.get("/get-stores", adminController.getStores)

module.exports = router;