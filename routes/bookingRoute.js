const express = require("express");
const { isAuth, restrictTo } = require("../controllers/authController");
const {
  getCheckoutSession,
  getAllBooking,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.use(isAuth);

router.get("/checkout-session/:tourId", isAuth, getCheckoutSession);

router.use(restrictTo("admin", "lead-guide"));
router.route("/").get(getAllBooking).post(createBooking);

router.route("/:id").get(getBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;
