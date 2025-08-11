const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const Db = require("./DB/db");
const rabbitmQ = require("./service/rabbit");
rabbitmQ.connect();
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

app.use("/" , userRoutes);

module.exports = app;