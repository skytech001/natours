const express = require("express");
const { isLoggedIn, isAuth } = require("../controllers/authController");
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
} = require("../controllers/viewsController");

const router = express.Router();

router.get("/", isLoggedIn, getOverview);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/me", isAuth, getAccount);

module.exports = router;
