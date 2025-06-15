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

// Middleware
const corsOptions = {
  origin: "https://ecom-fullstake-3ysn.vercel.app",
  credentials: true, 
};
app.use(cors(corsOptions));
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
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err.message);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
