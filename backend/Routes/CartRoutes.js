import express from "express";
import VerifyToken from "../middleware/VerifyToken.js";
import { getCartItems, addToCart, removeFromCart, clearCart } from "../Controller/CartController.js";
const router = express.Router();

router.get("/", VerifyToken, getCartItems);
router.post("/", VerifyToken, addToCart);
router.delete("/:id", VerifyToken, removeFromCart);
router.delete("/clear/:userId", VerifyToken, clearCart);

export default router;
