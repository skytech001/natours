const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../../models/tourModel");
const toursimple = require("./tours_simple.json");

dotenv.config({ path: "../../config.env" });

const db = process.env.DATABASE;

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => console.log("db connection successful"))
  .catch((error) => console.log(error));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours_simple.json`, "utf-8")
);
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("data loaded");
    process.emit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("data deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
console.log(process.argv);
