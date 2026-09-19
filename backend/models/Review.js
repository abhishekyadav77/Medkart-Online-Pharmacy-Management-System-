const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// One review per user per medicine
reviewSchema.index({ medicine: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
