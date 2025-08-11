const express = require("express");
const http = require("http");
const app = express();
const expressProxy = require("express-http-proxy");
const { initializeSocket } = require("./socket");

const server = http.createServer(app);
initializeSocket(server);

app.use("/user" , expressProxy('http://localhost:3001'));
app.use("/captain" , expressProxy('http://localhost:3002'));
app.use("/ride" , expressProxy('http://localhost:3003'));

server.listen(3000 , () => {
    console.log(`gateway server is running on http://localhost:3000`);
});