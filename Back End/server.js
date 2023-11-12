const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception occured! Shutting down...");
  process.exit(1);
});

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.BD_URI, { useNewUrlParser: true }).then(() => {
  app.listen(PORT, () => {
    console.log("MongoDB Conection ....");
    console.log("server Conection & Listen to port : " + PORT);
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection occured! Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});
