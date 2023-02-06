const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const db = process.env.DATABASE;

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => console.log("db connection successful"))
  .catch((error) => console.log(error));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
