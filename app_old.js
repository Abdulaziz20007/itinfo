const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const logger = require("./services/logger.service");
const winston = require("winston");
const expressWinston = require("express-winston");

// logger.log("info", "Log");
// logger.error("Error");
// logger.warn("Warning");
// logger.debug("Debug");
// logger.info("Info");
// logger.trace("Trace");
// logger.table("Table");

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);

// console.log(config.get("secret"));

const PORT = config.get("port");
// app.use(requestLogging);
console.log(PORT);

const mainRouter = require("./routes/index.routes");

app.use(router); 
app.use(errorLogging);

const error_handling_middleware = require("./error_middleware/error_handling_middleware");
const { requestLogging, errorLogging } = require("./helpers/express_winston");

process.on("uncaughtException", (exception) => {
  console.log("uncaughtException", exception.message);
});
process.on("unhandledException", (exception) => {
  console.log("unhandledException", exception.message);
});

const app = express();
app.use(express.json()); // parse json
app.use(cookieParser());
app.use("/api", mainRouter);
app.use(error_handling_middleware); // Error handling eng ohirida chaqiriladi

async function start() {
  try {
    await mongoose.connect(config.get("dbAtlasUri"));
    app.listen(PORT, () => {
      console.log(`server started at: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.log(error);
    console.log("Malumotlar bazasiga ulanishda xatolik");
  }
}

start();
