import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

const ProductForm = ({
  setIsAddProductOpen,
  handleGetProducts,
  setIsEditProductOpen,
  product,
}) => {
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    brand: "",
    category: "",
    description: "",
    rating: "",
    price: "",
    quantity: "", // ✅ Added quantity field
  });

  useEffect(() => {
    if (product) {
      setFormData({
        image: null,
        title: product.title,
        brand: product.brand,
        description: product.description,
        rating: product.rating,
        price: product.price,
        quantity: product.quantity, // ✅ Prefill quantity in edit mode
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const UserIdDecoded = jwtDecode(localStorage.getItem("token"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("userId", UserIdDecoded.id);
      data.append("image", formData.image);
      data.append("title", formData.title);
      data.append("brand", formData.brand);
      data.append("description", formData.description);
      data.append("rating", formData.rating);
      data.append("price", formData.price);
      data.append("quantity", formData.quantity); // ✅ Include quantity

      if (product) {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_KEY}/product/edit/${product._id}`,
          formData
        );

        if (response.status === 200) {
          setIsEditProductOpen(false);
          handleGetProducts();
        }
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_KEY}/product/add`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 200) {
          setIsAddProductOpen(false);
          handleGetProducts();
        }
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="absolute z-20 top-32 left-0 w-full h-full flex justify-center items-center pb-10">
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-200 shadow-lg rounded-lg p-6 w-96"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-3xl font-semibold text-center">
              {product ? "Edit Product" : "Add Product"}
            </h3>
            <button
              onClick={() => (setIsAddProductOpen(false), setIsEditProductOpen(false))}
              className="text-xl text-gray-700 font-semibold"
            >
              X
            </button>
          </div>

          {!product && (
            <label className="block text-gray-700 font-bold mb-1">
              Upload Image
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg mb-3"
                required
              />
            </label>
          )}

          <label className="block text-gray-700 font-bold mb-1">
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg mb-3"
              required
            />
          </label>

          <label className="block text-gray-700 font-bold mb-1">
            Brand
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg mb-3"
              required
            />
          </label>

          <label className="block text-gray-700 font-bold mb-1">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg mb-3"
              required
            ></textarea>
          </label>

          <label className="block text-gray-700 font-bold mb-1">
            Rating
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full px-3 py-2 border rounded-lg mb-3"
              required
            />
          </label>

          <label className="block text-gray-700 font-bold mb-1">
            Price
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg mb-3"
              required
            />
          </label>

          <label className="block text-gray-700 font-bold mb-1">
            Quantity
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border rounded-lg mb-3"
              required
            />
          </label>

          <button
            type="submit"
            className="mt-4 w-full text-white py-2 rounded-lg bg-[#088178] hover:bg-[#088179bd] transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
