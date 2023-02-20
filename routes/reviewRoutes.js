const express = require("express");
const { isAuth, restrictTo } = require("../controllers/authController");
const {
  getAllReviews,
  getReview,
  createReview,
  deleteReview,
  updateReview,
  setTourUserId,
} = require("../controllers/reviewController");

//merge params to get access to param from nested route
const router = express.Router({ mergeParams: true });

router.use(isAuth);
router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserId, createReview);
router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("admin", "user"), updateReview)
  .delete(restrictTo("admin", "user"), deleteReview);

module.exports = router;
