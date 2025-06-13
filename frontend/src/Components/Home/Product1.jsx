import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { addToCart } from "../../Redux/Slice/CartSlice";
import { useDispatch } from "react-redux";

const Product1 = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [ratingVal, setRatingVal] = useState(0);
  const [product, setProduct] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const getAllProduct = async () => {
    try {
      console.log("getallproduct");

      const response = await axios.get(
        `${import.meta.env.VITE_API_KEY}/product/`
      );

      console.log("response", response.data);
      setSearchResults(response.data);
      setProduct(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const handleSearch = () => {
    const filtered = product.filter((item) => {
      return (
        item.title?.toLowerCase().includes(search?.toLowerCase() || "") ||
        item.description?.toLowerCase().includes(search?.toLowerCase() || "") ||
        item.category?.toLowerCase().includes(search?.toLowerCase() || "")
      );
    });
    setSearchResults(filtered);
  };

  const sorttest = () => {
    const ratingValue = ratingVal;
    const filterByRating = searchResults.filter(
      (item) => item.rating >= ratingValue
    );

    if (sort === "a") {
      return [...filterByRating].sort((a, b) => a.price - b.price);
    }
    if (sort === "b") {
      return [...filterByRating].sort((a, b) => b.price - a.price);
    }

    return filterByRating;
  };

  return (
    <>
      <section id="product1" className="section-p1">
        <h2>Featured Products</h2>
        <p>Summer Collection New Morden Design</p>

        <div className="filter">
          <input
            type="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Items"
          />
          <button className="login-btn" onClick={handleSearch}>
            Search
          </button>
          <button className="login-btn" onClick={() => setSort("a")}>
            Low to high
          </button>
          <button className="login-btn" onClick={() => setSort("b")}>
            High to low
          </button>
          <label htmlFor="Rating">Rating:</label>
          <select
            name="Rating"
            id="Rating"
            onChange={(e) => setRatingVal(e.target.value)}
          >
            <option value="1">1 and above</option>
            <option value="2">2 and above</option>
            <option value="3">3 and above</option>
            <option value="4">4 and above</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="pro-container">
          {sorttest().map((item) => (
            <Link
              onClick={() => console.log("item", item)}
              className="pro"
              to={`/sproduct/${item._id}`}
              style={{ textDecoration: "none" }}
              key={item._id}
            >
              <img className="h-[250px]" src={item.image} alt="" />
              <div className="des">
                <span>{item.brand}</span>
                <h5>{item.title}</h5>
                <div className="star">
                  <i className="fas fa-star"></i>
                  <span> {item.rating}</span>
                </div>
                <h4>&#8377; {item.price}</h4>
                {/* ✅ Fixed: Add only one item when clicking the cart icon */}
              </div>
              {/* <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // Prevents navigation
                  dispatch(addToCart({ ...item, quantity: 1 })); // ✅ Always adds only 1
                }}
                className="cart-btn"
              >
                <i className="fa-solid fa-cart-shopping"></i>
              </button> */}
              <Link
                href="#"
                onClick={(e) => {
                  // e.preventDefault();
                  e.stopPropagation(); // Prevent the link from triggering navigation
                  dispatch(addToCart({ ...item, quantity: 1 }));
                }}
              >
                <i className="fa-solid fa-cart-shopping"></i>
              </Link>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Product1;
