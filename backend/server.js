require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "6mb" }));
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/orders", orderRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Online Pharmacy Management System API is running...");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong on the server",
    error: err.message,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});