import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/Slice/CartSlice";
import axios from "axios";

const Sproduct = () => {
  const [ourProduct, setOurProduct] = useState({});
  const [quantity, setQuantity] = useState(1); // ✅ State for quantity
  const { id } = useParams();
  const dispatch = useDispatch();

  const getSingleProduct = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_KEY}/product/singleproduct/${id}`
      );
      setOurProduct(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (quantity < 1) {
      return alert("Quantity must be at least 1.");
    }

    dispatch(addToCart({ ...ourProduct, quantity })); // ✅ Include quantity
  };

  return (
    <>
      <section id="prodetails" className="section-p1">
        <div className="single-pro-image">
          <img src={ourProduct.image} width="100%" alt={ourProduct.title} />
        </div>

        <div className="single-pro-details">
          <h6>{ourProduct.brand}</h6>
          <h4>{ourProduct.title}</h4>
          <h2> &#8377; {ourProduct.price}</h2>
          <select>
            <option>Select Size</option>
            <option>XL</option>
            <option>XXL</option>
            <option>Small</option>
            <option>Large</option>
          </select>

          {/* ✅ Quantity Input */}
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            className="border p-1 rounded"
          />

          {/* ✅ Updated Add to Cart Button */}
          <button className="normal" onClick={handleAddToCart}>
            Add To Cart
          </button>

          <h4>Product Details</h4>
          <span>{ourProduct.description}</span>
        </div>
      </section>
    </>
  );
};

export default Sproduct;
