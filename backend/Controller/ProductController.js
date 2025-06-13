import { uploadFile } from "../Cloudinary/Cloudinary.js";
import ProductModel from "../Model/ProductModel.js";
import userModel from "../Model/userModel.js";

export const addProduct = async (req, res) => {
  try {
    const { userId, description, brand, title, rating, price, quantity } = req.body;
    const image = req.file;

    console.log("Image:", image);

    const uploadedFile = await uploadFile(image);

    const product = new ProductModel({
      userId,
      image: uploadedFile,
      description,
      brand,
      title,
      rating,
      price,
      quantity,  // Include quantity
    });

    await product.save();
    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.find({ userId: id });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    console.log("Fetching all products")
    const products = await ProductModel.find()
    res.status(200).json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
}

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findOne({_id:id});
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Internal server error" });
  }
}

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, brand, title, rating, price, quantity } = req.body;

    const product = await ProductModel.findByIdAndUpdate(id, {
      description,
      brand,
      title,
      rating,
      price,
      quantity  // Allow quantity update
    });

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // if (product.quantity > 0) {
    //   return res.status(400).json({ message: "Cannot delete product with remaining stock" });
    // }

    await ProductModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    error && console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

