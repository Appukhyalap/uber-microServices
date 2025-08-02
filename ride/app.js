const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const db = require("./DB/db");
const rideRouter = require("./routes/rideRouter");
const RabbitMQ = require("./service/rabbit");
RabbitMQ.connect();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/' , rideRouter);

module.exports = app;

