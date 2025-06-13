import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCartAPI, fetchCartItems, removeFromCart } from "../../Redux/Slice/CartSlice";
import Address from "./Address";
import toast from "react-hot-toast";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Button from "../UI/Button";

const Cart_main = () => {
  const cart = useSelector((state) => state.cart?.cart || []);
  const dispatch = useDispatch();
  const [subTotal, setSubTotal] = useState(0);
  const [selectAddress, setSelectAddress] = useState("");
  const [addressInfo, setAddressInfo] = useState({});
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const userId = jwtDecode(localStorage.getItem("token")).id;

  useEffect(() => {
    dispatch(fetchCartItems());

  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(cart)) {
      let total = cart.reduce(
        (acc, item) => acc + item.price * (item.quantity || 1),
        0
      );
      setSubTotal(total);
    } else {
      setSubTotal(0);
    }
  }, [cart]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_KEY}/order/${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const placeOrder = async () => {
    if (!addressInfo || Object.keys(addressInfo).length === 0) {
      toast.error("Please select an address.");
      return;
    }


    const orderData = {
      buyerId: userId,
      items: cart?.map((item) => ({
        productId: item.productId,
        title: item.productName,
        quantity: item.quantity || 1,
        price: item.price,
      })),
      totalAmount: subTotal,
      address: addressInfo,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/order/create`,
        orderData
      );
      if (response.status === 201) {
        toast.success("Order placed successfully!");
        dispatch(clearCartAPI(userId));
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  console.log("cart", cart);
  
  return (
    <>
      <section id="cart" className="section-p1">
        {cart?.length > 0 && (
          <table width="100%">
            <thead>
              <tr>
                <td>IMAGES</td>
                <td>PRODUCTS</td>
                <td>PRICE</td>
                <td>QUANTITY</td>
                <td>SUBTOTAL</td>
                <td>REMOVE</td>
              </tr>
            </thead>
            <tbody>
              {cart?.map((item) => (
                <tr key={item._id}>
                  <td>
                    <Link to={`/sproduct/${item.productId._id}`}>
                      <img src={item.productImage} alt="Product" />
                    </Link>
                  </td>
                  <td>{item.productName}</td>
                  <td> &#8377; {item.price}</td>
                  <td>
                    <input type="number" value={item.quantity || 1} readOnly />
                  </td>
                  <td>&#8377; {item.price * (item.quantity || 1)}</td>
                  <td>
                    <button
                      className="normal"
                      onClick={() => dispatch(removeFromCart(item._id))}
                    >
                      <i className="fa-solid fa-trash fa-beat text-red-500"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {cart.length > 0 ? (
        <section id="cart-add" className="section-p1">
          <Address
            setAddressInfo={setAddressInfo}
            setSelectAddress={setSelectAddress}
          />
          <div id="sub-total" className="h-fit">
            <h3>Cart Totals</h3>
            <table>
              <tbody>
                <tr>
                  <td>Cart Subtotal</td>
                  <td>&#8377; {subTotal}</td>
                </tr>
                <tr>
                  <td>Shipping</td>
                  <td>Free</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>&#8377; {subTotal}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <button className="normal" onClick={placeOrder}>
              Confirm Order
            </button>
          </div>
        </section>
      ) : (
        <h2 className="text-center mb-20">Cart is Empty</h2>
      )}

      {orders.length > 0 && (
        <div className=" text-center m-6">
          <Button
            onClick={() => setShowOrders(!showOrders)}
          >
            {showOrders ? "Hide Orders" : "Your Orders"}
          </Button>
        </div>
      )}

      {showOrders && (
        <section id="orders" className="section-p1 mt-6">
          <h2 className="text-xl font-bold mb-4">Your Orders</h2>
          {loadingOrders ? (
            <p className="text-center">Loading orders...</p>
          ) : orders.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => (
                <div key={order._id} className="p-4 rounded-lg shadow-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Order ID: {order._id}</h3>
                    <span className={`px-3 py-1 text-sm rounded-lg ${
                      order.status === "pending" ? "bg-yellow-300" : "bg-green-400"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="mt-2"><strong>Total:</strong> ₹{order.totalAmount}</h3>

                  <h3 className="text-md font-semibold ">Items:</h3>
                  <ul className="text-sm space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className=" py-1">
                        <h3>🔹 <strong>Product Title: </strong> {item.title}</h3>
                        <h3>📦 <strong>Qty:</strong> {item.quantity} | 💰 <strong>₹{item.price}</strong></h3>
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-md font-semibold mt-3">Shipping:</h4>
                  <p className="text-sm">
                    {order.address.address}, {order.address.city}, {order.address.pincode}
                  </p>
                  <p className="text-sm">📞 {order.address.phone}</p>
                  {order.address.notes && <p className="text-sm">📝 {order.address.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-red-500">No orders found.</p>
          )}
        </section>
      )}
    </>
  );
};

export default Cart_main;
