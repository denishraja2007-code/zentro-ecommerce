require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");

const products = [
  { name: "Wireless Headphones", price: 2499, category: "electronics", rating: 4.5, description: "Noise cancelling over-ear headphones with 30 hours battery.", image: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Smart Watch", price: 3999, category: "electronics", rating: 4.3, description: "Fitness tracking, heart rate monitor, AMOLED display.", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Bluetooth Speaker", price: 1799, category: "electronics", rating: 4.2, description: "Portable waterproof speaker with deep bass.", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Laptop Backpack", price: 1299, category: "fashion", rating: 4.4, description: "Water resistant backpack with USB charging port.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Running Shoes", price: 2999, category: "fashion", rating: 4.6, description: "Lightweight breathable shoes for daily running.", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Sunglasses", price: 999, category: "fashion", rating: 4.1, description: "UV protected stylish sunglasses.", image: "https://images.unsplash.com/photo-1610136649349-0f646f318053?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Cotton T-Shirt", price: 599, category: "fashion", rating: 4.0, description: "Soft premium cotton regular fit t-shirt.", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Denim Jacket", price: 2199, category: "fashion", rating: 4.3, description: "Classic blue denim jacket for all seasons.", image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Coffee Mug Set", price: 799, category: "home", rating: 4.5, description: "Set of 4 ceramic mugs, dishwasher safe.", image: "https://plus.unsplash.com/premium_photo-1719289718424-0f5071da5a3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Table Lamp", price: 1499, category: "home", rating: 4.2, description: "Modern LED lamp with adjustable brightness.", image: "https://plus.unsplash.com/premium_photo-1668005190411-1042cd38522e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Wall Clock", price: 899, category: "home", rating: 4.0, description: "Minimal silent wall clock.", image: "https://images.unsplash.com/photo-1558603655-491ecfa8324f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Indoor Plant Pot", price: 499, category: "home", rating: 4.4, description: "Decorative ceramic pot with plant.", image: "https://images.unsplash.com/photo-1669392597221-bbfd4b6e13ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Yoga Mat", price: 899, category: "sports", rating: 4.5, description: "Anti-slip eco friendly yoga mat.", image: "https://images.unsplash.com/photo-1763004871583-4183d64096b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Dumbbell Set", price: 2499, category: "sports", rating: 4.4, description: "Adjustable dumbbells, 10 kg pair.", image: "https://images.unsplash.com/photo-1703668984128-b506579acdd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Football", price: 699, category: "sports", rating: 4.1, description: "Durable size 5 football.", image: "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Water Bottle", price: 449, category: "sports", rating: 4.3, description: "Insulated steel bottle, keeps cold 24 hours.", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Mechanical Keyboard", price: 3299, category: "electronics", rating: 4.6, description: "RGB backlit mechanical keyboard.", image: "https://plus.unsplash.com/premium_photo-1683543124615-fb42e42c6201?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Gaming Mouse", price: 1199, category: "electronics", rating: 4.3, description: "Ergonomic mouse with adjustable DPI.", image: "https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Perfume", price: 1599, category: "fashion", rating: 4.2, description: "Long lasting fresh fragrance, 100ml.", image: "https://images.unsplash.com/photo-1763986665850-6e66549aa8e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { name: "Notebook Set", price: 349, category: "home", rating: 4.1, description: "Pack of 3 premium ruled notebooks.", image: "https://images.unsplash.com/photo-1647559709298-c0e3dcb47092?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Product.deleteMany();
  await Product.insertMany(products);

  const adminExists = await User.findOne({ email: "admin@store.com" });
  if (!adminExists) {
    await User.create({
      name: "Admin",
      email: "admin@store.com",
      password: "admin123",
      role: "admin",
    });
  }

  console.log("Seeded: 20 products + admin (admin@store.com / admin123)");
  process.exit();
};

run();