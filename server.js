const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Uncaught exceptions(Bugggsss!! outside our middlewares)
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTIONS! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const db = process.env.DATABASE;

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => console.log("db connection successful"));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(
    `App is running on port: ${port} in ${process.env.NODE_ENV} mode`
  );
});

//Unhandled rejection in promises(async code)
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...", err);
  server.close(() => {
    process.exit(1);
  });
});
