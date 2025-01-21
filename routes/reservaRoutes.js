const express = require("express");
const router = require("express").Router();

const ReservaController = require("../controllers/ReservaController");
const AuthController = require("../controllers/AuthController");

router.post("/novo", ReservaController.registrarReserva);

router.get("/", ReservaController.getReservas);

router.delete("/", ReservaController.cancelarReserva);

router.get("/listar", AuthController.verificarPermissaoAdm, ReservaController.buscarReservasData)

module.exports = router;