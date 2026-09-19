const Order = require("../models/Order");
const Medicine = require("../models/Medicine");

// @route POST /api/orders  (customer places order)
const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, phone, paymentMethod, prescriptionImage } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    let totalAmount = 0;
    let requiresPrescription = false;
    const orderItems = [];

    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res.status(404).json({ message: `Medicine not found: ${item.medicineId}` });
      }
      if (medicine.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${medicine.name}` });
      }
      if (medicine.requiresPrescription) requiresPrescription = true;

      orderItems.push({
        medicine: medicine._id,
        name: medicine.name,
        quantity: item.quantity,
        price: medicine.price,
      });
      totalAmount += medicine.price * item.quantity;

      medicine.stock -= item.quantity;
      await medicine.save();
    }

    // Prescription upload is optional — if provided, we store it for pharmacist verification,
    // but it never blocks checkout.

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      phone,
      paymentMethod: paymentMethod || "COD",
      requiresPrescription,
      prescriptionImage: prescriptionImage || "",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};

// @route GET /api/orders/myorders (customer's own orders)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// @route GET /api/orders (admin: all orders)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// @route PUT /api/orders/:id/status (admin updates order status)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order", error: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
