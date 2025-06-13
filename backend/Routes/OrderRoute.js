import express from "express";
import { createOrder, getOrdersByUser, getSellerOrders } from "../Controller/OrderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/:userId", getOrdersByUser);
router.get("/seller/:sellerId", getSellerOrders);

export default router;
