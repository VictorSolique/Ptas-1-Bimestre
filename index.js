const prisma = require("./prisma/prismaClient");

const express = require("express");
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json())

const authRouters = require("./routes/authRoutes");
app.use("/auth", authRouters);

app.listen(8000);


