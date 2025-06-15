import express from "express";
import {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
} from "../Controller/CartController.js";

import VerifyToken from "../Middleware/VerifyToken.js";

const router = express.Router();

router.post("/", VerifyToken, addToCart);
router.get("/", VerifyToken, getCartItems);
router.delete("/:id", VerifyToken, removeFromCart);
router.delete("/clear/:userId", VerifyToken, clearCart); 

export default router;
