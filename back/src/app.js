const expres = require("express");
const fileupload = require("express-fileupload");
const rutas = require("./routes/index.js");


const server = expres();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const FileController = require("./routes/FileController.js");
const fileController = new FileController();
const FileController1 = require("./routes/FileController-imagen.js");
const fileController1 = new FileController1();

server.use(expres.urlencoded({ extended: true, limit: "50mb" }));
server.use(expres.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use(fileupload());
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use("/", rutas),

server.use((err, req, res, next) => {
          // eslint-disable-line no-unused-vars
          const status = err.status || 500;
          const message = err.message || err;
          res.status(status).send(message);
        });

module.exports = server;
