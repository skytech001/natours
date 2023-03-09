const express = require("express");
const { isLoggedIn, isAuth } = require("../controllers/authController");
const { createBookingCheckout } = require("../controllers/bookingController");
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  getMyTours,
} = require("../controllers/viewsController");

const router = express.Router();

router.get("/", isLoggedIn, getOverview);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/me", isAuth, getAccount);
router.get("/my-tours", isAuth, getMyTours);

module.exports = router;
