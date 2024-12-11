const express = require("express");
const router = express.Router(); 

const ProfileController = require("../controllers/ProfileController");

router.post("/login", ProfileController.login);
router.post("/cadastro", ProfileController.cadastro);

module.exports = router;