import Cart from "../Model/CartModel.js";
import Product from "../Model/ProductModel.js";
import mongoose from "mongoose";

// Validate ObjectId helper
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

//  Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ userId, productId, quantity });
    }

    await cartItem.save();

    res.status(201).json({ message: "Item added to cart", cart: cartItem });
  } catch (error) {
    console.error(" Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get Cart Items by User
export const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const cartItems = await Cart.find({ userId }).populate("productId");
    res.status(200).json(cartItems);
  } catch (error) {
    console.error(" Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//  Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid cart item ID" });
    }

    const deleted = await Cart.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error(" Error removing cart item:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//  Clear entire cart (optional)
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    await Cart.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(" Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
