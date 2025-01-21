const express = require("express");
const router = express.Router(); 

const PerfilController = require("../controllers/PerfilController");
const AuthController = require("../controllers/AuthController");

router.get("/", PerfilController.getPerfil);

router.patch("/", PerfilController.atualizarPerfil);

router.get("/todos", AuthController.verificarPermissaoAdm, PerfilController.buscarUsuarios)

module.exports = router;
