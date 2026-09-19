const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    category: {
      type: String,
      enum: [
        "Painkiller",
        "Antibiotic",
        "Antiseptic",
        "Vitamin",
        "Diabetes",
        "Cardiac",
        "Skincare",
        "Other",
      ],
      default: "Other",
    },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 }, // optional strike-through price to show a discount
    stock: { type: Number, required: true, min: 0, default: 0 },
    requiresPrescription: { type: Boolean, default: false },
    manufacturer: { type: String, trim: true },
    expiryDate: { type: Date },
    imageUrl: { type: String, default: "" },
    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

medicineSchema.index({ name: "text", brand: "text", category: "text" });

module.exports = mongoose.model("Medicine", medicineSchema);
