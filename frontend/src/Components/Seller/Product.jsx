import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductForm from "./ProductForm";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import Button from "../UI/Button";

const Product = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(true);
  const [orders, setOrders] = useState([]);

  const UserIdDecoded = jwtDecode(localStorage.getItem("token"));

  const handleGetProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_KEY}/product/${UserIdDecoded.id}`
      );

      // console.log("Products:", response.data);
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGetOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_KEY}/order/seller/${UserIdDecoded.id}`
      );

      if (response.status === 200) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  

  useEffect(() => {
    handleGetProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_KEY}/product/delete/${id}`
      );
      if (response.status === 200) {
        handleGetProducts();
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className=" min-h-[100vh]">
        <div className="flex justify-between m-4">
          <div>
          <Button
            onClick={() => (setIsProductOpen(true), setIsOrderOpen(false))}
          className="ml-20"
          >
            Product
          </Button>
          <Button
          onClick={() => (setIsOrderOpen(true), setIsProductOpen(false),handleGetOrders())}
            className="ml-6"
          >
            Order
          </Button>
          </div>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="text-white mx-10 p-2 rounded bg-[#088178] hover:bg-[#088179bd] "
          >
            Add New Product
          </button>
        </div>


        {isProductOpen && (
        <div className="mx-20 my-10 flex flex-wrap justify-evenly">
          {products.map((product) => (
            <div
              key={product._id}
              className="w-[23%] min-w-[250px] border border-[#cce7de] mx-2.5 my-[15px] px-3 py-[18px] rounded-2xl"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full rounded-2xl h-72"
              />
              {/* <div className="text-start px-2.5">
                        <h5 className="text-sm text-gray-500 mt-3"> {product.brand}</h5>
                        <h5 className="text-black font-bold">{product.title}</h5>
                        <h5 className="text-sm text-gray-500">{product.rating}</h5>
                        <h5 className="text-sm text-gray-500">{product.price}</h5> */}

              <div className="des ml-2 space-y-1">
                <span className="block mt-2">{product.brand}</span>
                <h5>{product.title}</h5>
                <div className="star ">
                  <i className="i fas fa-star"></i>
                  <span> {product.rating}</span>
                </div>
                <h5 className="text-teal-700">&#8377; {product.price}</h5>
                <h5 className="text-gray-700">
                  Quantity: {product.quantity}
                </h5>{" "}
                {/* ✅ Display quantity */}
                <div className="mt-2 space-x-3">
                  <button
                    onClick={() => (
                      setProductId(product._id), setIsEditProductOpen(true)
                    )}
                    className="border px-3 py-1 rounded bg-[#121b30] hover:bg-[#0f142a] cursor-pointer text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="border px-3 py-1 rounded bg-red-500 hover:bg-red-600 cursor-pointer text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {product._id === productId && isEditProductOpen && (
                <ProductForm
                  setIsAddProductOpen={setIsAddProductOpen}
                  handleGetProducts={handleGetProducts}
                  setIsEditProductOpen={setIsEditProductOpen}
                  product={product}
                />
              )}
            </div>
            // </div>
          ))}
        </div>
        )}

{isOrderOpen && (
          <div className="mx-20 my-10">
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
            {orders.length === 0 ? (
              <p className="text-center text-gray-500">No orders found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border p-4 rounded-lg shadow-md bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Order ID: {order._id}</h3>
                      <span
                        className={`px-3 py-1 text-sm rounded-lg ${
                          order.status === "pending"
                            ? "bg-yellow-300"
                            : "bg-green-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-2">
                      <strong>Total:</strong> ₹{order.totalAmount}
                    </p>

                    <h4 className="text-md font-semibold mt-3">Items:</h4>
                    <ul className="text-sm space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="border-b py-1">
                          <p>
                            🔹 <strong>Product:</strong> {item.title}
                          </p>
                          <p>
                            📦 <strong>Qty:</strong> {item.quantity} | 💰{" "}
                            <strong>₹{item.price}</strong>
                          </p>
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-md font-semibold mt-3">Shipping:</h4>
                    <p className="text-sm">
                      {order.address.address}, {order.address.city},{" "}
                      {order.address.pincode}
                    </p>
                    <p className="text-sm">📞 {order.address.phone}</p>
                    {order.address.notes && (
                      <p className="text-sm">📝 {order.address.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isAddProductOpen && (
          <ProductForm
            setIsAddProductOpen={setIsAddProductOpen}
            handleGetProducts={handleGetProducts}
          />
        )}
      </div>
    </>
  );
};

export default Product;
