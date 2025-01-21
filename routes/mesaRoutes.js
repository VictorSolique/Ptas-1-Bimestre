const express = require("express");
const router = require("express").Router();

const MesaController = require("../controllers/MesaController");
const AuthController = require("../controllers/AuthController");

router.post("/novo", AuthController.verificarAutenticacao, AuthController.verificarPermissaoAdm, MesaController.novaMesa);

router.get("/", MesaController.buscarMesas)

router.get("/disponibilidade", MesaController.buscarMesaData)

module.exports = router;