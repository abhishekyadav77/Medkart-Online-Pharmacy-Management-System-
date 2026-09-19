const Medicine = require("../models/Medicine");

// @route GET /api/medicines?search=&category=&page=&limit=
const getMedicines = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [medicines, total] = await Promise.all([
      Medicine.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Medicine.countDocuments(query),
    ]);

    res.json({
      medicines,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch medicines", error: err.message });
  }
};

// @route GET /api/medicines/:id
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch medicine", error: err.message });
  }
};

// @route POST /api/medicines (admin only)
const createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ message: "Failed to create medicine", error: err.message });
  }
};

// @route PUT /api/medicines/:id (admin only)
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ message: "Failed to update medicine", error: err.message });
  }
};

// @route DELETE /api/medicines/:id (admin only)
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Medicine removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete medicine", error: err.message });
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
