import mongoose from "mongoose";
import Order from "../Model/OrderModel.js";
import Product from "../Model/ProductModel.js";

export const createOrder = async (req, res) => {
  try {
    const { buyerId, items, totalAmount, address } = req.body;

    if (!buyerId || !items || items.length === 0 || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    console.log("Creating order:", req.body);

    // ✅ 1. Check if all products are in stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found!` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.title}. Available: ${product.quantity}` });
      }
    }

    // ✅ 2. Create the order
    const newOrder = new Order({
      buyerId,
      items,
      totalAmount,
      address,
      status: "pending",
    });

    await newOrder.save();

    // ✅ 3. Decrease product quantity
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: -item.quantity } }, // 🛑 Reduce quantity
        { new: true }
      );
    }

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong!", error: error.message });
  }
};


export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ buyerId: userId })
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error: error.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
      const sellerId = req.params.sellerId; // 🟢 Seller ID from request params

      // 🟢 1. Find all products of the seller
      const sellerProducts = await Product.find({ userId: sellerId }).select("_id title quantity");
      console.log("✅ Seller products:", sellerProducts);
      
      if (!sellerProducts.length) {
          return res.status(404).json({ message: "No products found for this seller" });
      }

      // 🟢 2. Convert product IDs to ObjectId
      const sellerProductIds = sellerProducts.map((product) => new mongoose.Types.ObjectId(product._id));
      console.log("✅ Seller Product IDs:", sellerProductIds);
      
      // 🟢 3. Find orders where at least one product belongs to the seller
      const orders = await Order.find({ "items.productId": { $in: sellerProductIds } });
      console.log("✅ Orders containing seller's products:", orders);
      
      // 🟢 4. Filter orders to include only seller's products
      const sellerOrders = orders.map((order) => {
          const sellerItems = order.items.filter((item) =>
              sellerProductIds.some(id => id.equals(item.productId))
          );

          return {
              _id: order._id, // Order ID
              buyerId: order.buyerId, // Buyer ID
              totalAmount: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), // 🟢 Only seller's product price
              status: order.status,
              createdAt: order.createdAt,
              address: order.address,
              items: sellerItems.map((item) => ({
                  productId: item.productId, // SKU of product
                  title: item.title, // Product Name
                  quantity: item.quantity, // Quantity Ordered
                  price: item.price, // Price per unit
              }))
          };
      }).filter(order => order.items.length > 0); // Remove empty orders

      res.json(sellerOrders);
  } catch (error) {
      console.error("❌ Error fetching seller orders:", error);
      res.status(500).json({ message: "Error fetching seller orders" });
  }
};
