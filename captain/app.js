const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const captainRoutes = require("./routes/captainRoutes");
const Db = require("./DB/db");
const rabbitMQ = require("./service/rabbit");
rabbitMQ.connect();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.use("/" , captainRoutes);

module.exports = app;