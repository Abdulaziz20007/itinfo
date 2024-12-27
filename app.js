const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const logger = require("./services/logger.service");
const exHbs = require("express-handlebars");

const hbs = exHbs.create({
  defaultLayout: "main",
  extname: "hbs", //handlebars
});

const PORT = config.get("port");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("views"));


const apiRouter = require("./routes/index.routes");

const viewRouter = require("./routes/view.routes");
app.use("/", viewRouter);
app.use("/api", apiRouter);

async function start() {
  try {
    await mongoose.connect(config.get("dbAtlasUri"));
    app.listen(PORT, () => {
      console.log(`server started at: http://45.138.158.245:${PORT}/api`);
      console.log(`website started at: http://45.138.158.245:${PORT}/`);
    });
  } catch (error) {
    console.log(error);
    console.log("Malumotlar bazasiga ulanishda xatolik");
  }
}

start();
