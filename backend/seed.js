// Run with: node seed.js
// Populates the database with an admin user and sample medicines for demo/testing.
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Medicine = require("./models/Medicine");

const sampleMedicines = [
  // Painkillers
  { name: "Paracetamol 500mg", brand: "Crocin", category: "Painkiller", price: 30, mrp: 40, stock: 200, description: "Fever and pain relief tablet.", manufacturer: "GSK" },
  { name: "Ibuprofen 400mg", brand: "Brufen", category: "Painkiller", price: 45, mrp: 55, stock: 140, description: "Relieves pain, inflammation and fever.", manufacturer: "Abbott" },
  { name: "Combiflam Tablet", brand: "Combiflam", category: "Painkiller", price: 38, stock: 180, description: "Fast relief from body ache and headache.", manufacturer: "Sanofi" },
  { name: "Volini Pain Relief Gel", brand: "Volini", category: "Painkiller", price: 165, mrp: 199, stock: 90, description: "Topical gel for muscle and joint pain.", manufacturer: "Sun Pharma" },

  // Antibiotics
  { name: "Amoxicillin 250mg", brand: "Mox", category: "Antibiotic", price: 85, stock: 100, requiresPrescription: true, description: "Broad-spectrum antibiotic capsule.", manufacturer: "Ranbaxy" },
  { name: "Azithromycin 500mg", brand: "Azithral", category: "Antibiotic", price: 110, mrp: 130, stock: 75, requiresPrescription: true, description: "Treats bacterial respiratory infections.", manufacturer: "Alembic" },
  { name: "Ciprofloxacin 500mg", brand: "Ciplox", category: "Antibiotic", price: 95, stock: 60, requiresPrescription: true, description: "Broad-spectrum antibiotic for infections.", manufacturer: "Cipla" },

  // Antiseptic
  { name: "Dettol Antiseptic Liquid", brand: "Dettol", category: "Antiseptic", price: 110, mrp: 125, stock: 150, description: "For cuts, wounds and disinfection.", manufacturer: "Reckitt" },
  { name: "Betadine Solution", brand: "Betadine", category: "Antiseptic", price: 95, stock: 110, description: "Antiseptic solution for wound care.", manufacturer: "Win-Medicare" },
  { name: "Savlon Antiseptic Cream", brand: "Savlon", category: "Antiseptic", price: 65, mrp: 75, stock: 130, description: "Antiseptic cream for minor cuts and burns.", manufacturer: "ITC" },

  // Vitamins
  { name: "Vitamin C 500mg", brand: "Limcee", category: "Vitamin", price: 45, stock: 300, description: "Immunity booster chewable tablet.", manufacturer: "Abbott" },
  { name: "Vitamin D3 60K", brand: "Uprise D3", category: "Vitamin", price: 130, mrp: 150, stock: 140, description: "Weekly vitamin D3 supplement.", manufacturer: "Alkem" },
  { name: "Multivitamin Tablets", brand: "Revital H", category: "Vitamin", price: 220, mrp: 260, stock: 100, description: "Daily multivitamin and mineral supplement.", manufacturer: "Sun Pharma" },
  { name: "Zinc + Vitamin C", brand: "Zincovit", category: "Vitamin", price: 95, stock: 160, description: "Immunity support tablet with zinc.", manufacturer: "Apex Labs" },

  // Diabetes
  { name: "Metformin 500mg", brand: "Glycomet", category: "Diabetes", price: 60, stock: 120, requiresPrescription: true, description: "Blood sugar control tablet.", manufacturer: "USV" },
  { name: "Glimepiride 2mg", brand: "Amaryl", category: "Diabetes", price: 88, mrp: 100, stock: 70, requiresPrescription: true, description: "Helps control high blood sugar in type 2 diabetes.", manufacturer: "Sanofi" },

  // Cardiac
  { name: "Atorvastatin 10mg", brand: "Lipitor", category: "Cardiac", price: 150, stock: 80, requiresPrescription: true, description: "Cholesterol lowering tablet.", manufacturer: "Pfizer" },
  { name: "Amlodipine 5mg", brand: "Amlodac", category: "Cardiac", price: 55, mrp: 65, stock: 95, requiresPrescription: true, description: "Manages high blood pressure.", manufacturer: "Zydus" },
  { name: "Ecosprin 75mg", brand: "Ecosprin", category: "Cardiac", price: 25, stock: 200, requiresPrescription: true, description: "Low-dose aspirin for heart health.", manufacturer: "USV" },

  // Skincare
  { name: "Cetaphil Moisturizing Lotion", brand: "Cetaphil", category: "Skincare", price: 480, mrp: 550, stock: 60, description: "Gentle daily moisturizer for all skin types.", manufacturer: "Galderma" },
  { name: "Sunscreen SPF 50", brand: "Neutrogena", category: "Skincare", price: 399, mrp: 450, stock: 85, description: "Broad spectrum sun protection lotion.", manufacturer: "J&J" },
  { name: "Acne Gel", brand: "Clindac A", category: "Skincare", price: 145, stock: 70, requiresPrescription: true, description: "Topical gel to treat acne breakouts.", manufacturer: "Cipla" },

  // Other
  { name: "ORS Powder", brand: "Electral", category: "Other", price: 20, stock: 250, description: "Oral rehydration salts sachet.", manufacturer: "FDC" },
  { name: "Digital Thermometer", brand: "Dr. Trust", category: "Other", price: 199, mrp: 249, stock: 55, description: "Fast and accurate digital thermometer.", manufacturer: "Dr. Trust" },
  { name: "N95 Face Mask (Pack of 5)", brand: "Venus", category: "Other", price: 249, mrp: 299, stock: 120, description: "5-layer protective face masks.", manufacturer: "Venus" },
  { name: "Hand Sanitizer 500ml", brand: "Lifebuoy", category: "Other", price: 150, mrp: 175, stock: 140, description: "Kills 99.9% germs, alcohol-based.", manufacturer: "HUL" },
];

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({ email: "admin@pharmacy.com" });
    await Medicine.deleteMany({});

    await User.create({
      name: "Admin",
      email: "admin@pharmacy.com",
      password: "admin123",
      role: "admin",
    });

    await Medicine.insertMany(sampleMedicines);

    console.log("Seed data inserted successfully!");
    console.log("Admin login -> email: admin@pharmacy.com | password: admin123");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedData();
