const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.use(auth);
router.use(roleCheck("NORMAL_USER"));

router.post("/rate-store", userController.rateStore);

router.put("/rate-store", userController.updateRating);

module.exports = router;
