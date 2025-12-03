const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.use(auth);
router.use(roleCheck("STORE_OWNER"));

router.get("/dashboard", ownerController.getOwnerDashboard);
module.exports = router;