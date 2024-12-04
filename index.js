const prisma = require("./prisma/prismaClient");

const express = require("express");

const AuthController = require("./controllers/AuthController");
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json())

const authRouters = require("./routes/authRoutes");
app.use("/auth", authRouters);

app.use("/perfil", AuthController.verificaAutenticacao, perfilRoutes);

app.get("/privado", AuthController.verificaAutenticacao, (req, res) => {
    
    res.json({
        msg: "Voce acessou uma rota restrita!",
    });
});

app.listen(8000);


