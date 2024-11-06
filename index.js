const prisma = require("./prisma/prismaClient");

const express = require("express");

const app = express();
app.use(express.json())

const authRouters = require("./routes/authRoutes");
app.use("/auth", authRouters);

app.listen(8000);
