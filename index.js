const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");
const app = express();
app.use(express.json())

// Responder a qualquer requisição encaminhada para
// /auth/algumaCoisa
const authRouters = require("./routes/authRoutes");
app.use("/auth", authRouters);

app.listen(8000);
