const express = require("express");
const router = express.Router();
const {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");
const { getReviews, addReview } = require("../controllers/reviewController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getMedicines);
router.get("/:id", getMedicineById);
router.get("/:id/reviews", getReviews);
router.post("/:id/reviews", protect, addReview);
router.post("/", protect, adminOnly, createMedicine);
router.put("/:id", protect, adminOnly, updateMedicine);
router.delete("/:id", protect, adminOnly, deleteMedicine);

module.exports = router;
