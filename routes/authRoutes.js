const router = require("express").Router();

const AuthController = require("../controllers/AuthController");

router.post("/cadastro", AuthController.cadastro);
router.post("/login", AuthController.login);

module.exports = router;