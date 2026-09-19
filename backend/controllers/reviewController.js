const Review = require("../models/Review");
const Medicine = require("../models/Medicine");

// @route GET /api/medicines/:id/reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ medicine: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
};

// @route POST /api/medicines/:id/reviews (logged-in users)
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const medicineId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    const existing = await Review.findOne({ medicine: medicineId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this medicine" });
    }

    await Review.create({
      medicine: medicineId,
      user: req.user._id,
      userName: req.user.name,
      rating,
      comment,
    });

    // Recompute aggregate rating
    const stats = await Review.aggregate([
      { $match: { medicine: medicine._id } },
      { $group: { _id: "$medicine", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    medicine.avgRating = stats[0]?.avg || 0;
    medicine.numReviews = stats[0]?.count || 0;
    await medicine.save();

    res.status(201).json({ message: "Review added", avgRating: medicine.avgRating, numReviews: medicine.numReviews });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this medicine" });
    }
    res.status(500).json({ message: "Failed to add review", error: err.message });
  }
};

module.exports = { getReviews, addReview };
