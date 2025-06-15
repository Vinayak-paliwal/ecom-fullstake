import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import routes
import adminRoute from "./Routes/adminRoute.js";
import productRoute from "./Routes/ProductRoute.js";
import addressRoute from "./Routes/AddressRoute.js";
import orderRoute from "./Routes/OrderRoute.js";
import cartRoute from "./Routes/CartRoutes.js";
import userRoute from "./Routes/userRoute.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//  Allowed frontend URLs
const allowedOrigins = [
  "https://ecom-fullstake-3ysn.vercel.app",
  "https://ecom-fullstake-grqcxa4bb-vinayak-paliwals-projects.vercel.app",
  "http://localhost:5173",
];

//  Smart CORS config
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/admin", adminRoute);
app.use("/auth", userRoute);
app.use("/product", productRoute);
app.use("/address", addressRoute);
app.use("/order", orderRoute);
app.use("/cart", cartRoute);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Hello from server backend!" });
});

// MongoDB Connection
mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(" Connected to MongoDB");
}).catch((err) => {
  console.error(" MongoDB connection error:", err.message);
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
