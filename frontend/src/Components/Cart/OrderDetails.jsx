import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_KEY}/order/${orderId}`);
        setOrders(response.data); // Expecting an array
      } catch (error) {
        toast.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <p className="text-center">Loading order details...</p>;
  }

  if (!orders || orders.length === 0) {
    return <p className="text-center text-red-500">No orders found</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Order Details</h2>

      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded-lg shadow-md">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>

          <h3 className="text-lg font-semibold mt-4">Items</h3>
          {order.items && order.items.length > 0 ? (
            <ul className="list-disc ml-6">
              {order.items.map((item, index) => (
                <li key={index} className="mb-2">
                  <p><strong>Product ID:</strong> {item.productId}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> ₹{item.price}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No items found in this order.</p>
          )}

          <h3 className="text-lg font-semibold mt-4">Shipping Address</h3>
          {order.address ? (
            <>
              <p><strong>Address:</strong> {order.address.address}, {order.address.city}, {order.address.pincode}</p>
              <p><strong>Phone:</strong> {order.address.phone}</p>
              {order.address.notes && <p><strong>Notes:</strong> {order.address.notes}</p>}
            </>
          ) : (
            <p>No shipping address available.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
