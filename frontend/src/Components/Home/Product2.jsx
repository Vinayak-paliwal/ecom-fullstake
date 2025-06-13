import React, { useEffect, useState } from "react";
import product1 from "./Item1";
import { Link } from "react-router-dom";

const Product1 = () => {
  const [featurPro, setFeturePro] = useState([]);

  const FirstPro = product1.filter((item) => {
    return item.category == "New Arrivals";
  });

  useEffect(() => {
    setFeturePro(FirstPro);
    // console.log(FirstPro);
  }, []);
  return (
    <>
      <section id="product1" className="section-p1">
        <h2>New Arrivals</h2>
        <p>Summer Collection New Morden Design</p>
        <div className="pro-container">
          {FirstPro.map((item) => (
            <Link
              className="pro"
              to={`/sproduct/${item.id}`}
              style={{ textDecoration: "none" }}
            >
              <img src={item.image} alt="" />
              <div className="des">
                <span>{item.brand}</span>
                <h5>{item.title}</h5>
                <div className="star">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <h4>{item.price}</h4>
              </div>
              <a href="#">
                <i className="fa-solid fa-cart-shopping"></i>
              </a>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Product1;
