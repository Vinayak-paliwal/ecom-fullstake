import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/img/new.jpg";
// import logo from "../../assets/img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  clearToken,
  fetchCartItems,
  setToken,
} from "../../Redux/Slice/CartSlice";
import useGetUserId from "../../CustomHooks/useGetUserId";
import { getUser } from "../../Redux/Slice/GetUserSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.cart.token);
  const { userId } = useGetUserId();

  const cart = useSelector((state) => state.cart?.cart || []);

  // ✅ `useState` ki jagah Redux se directly length use kar rahe hain
  const [cartCount, setCartCount] = useState(cart.length);

  useEffect(() => {
    dispatch(fetchCartItems()); // ✅ Cart data fetch on mount
  }, [dispatch]);

  useEffect(() => {
    console.log("Updated cart:", cart); // ✅ Debugging: Check Redux cart data
    setCartCount(cart.length); // ✅ Ensure UI updates with latest cart length
  }, [cart]);

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId));
    }
  }, [dispatch, userId]);

  const userInfo = useSelector((state) => state.userInfo);
  const [theme, setTheme] = useState("lightMode");
  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const [isLogin, setIsLogin] = useState(token);
  const location = useLocation();

  const handleTheme = () => {
    theme === "lightMode" ? setTheme("darkMode") : setTheme("lightMode");
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleNavbar = () => {
    setIsNavbarActive(!isNavbarActive);
  };

  const handleNavbarClose = () => {
    if (window.innerWidth < 799) setIsNavbarActive(!isNavbarActive);
  };

  const handleLogout = () => {
    dispatch(clearToken());
    setIsLogin(null);
  };

  // Set login state when token changes
  useEffect(() => {
    setIsLogin(token);
    if(userInfo?.user?.role === "admin"){
      localStorage.setItem("isAdmin", "true");
    }
  }, [token]);

  return (
    <section id="header">
      <Link to={"/"}>
        <img className="w-12 h-12" src={logo} alt="Logo" />
      </Link>

      <div>
        <ul id="navbar" className={isNavbarActive ? "active" : ""}>
          <li>
            <Link
              onClick={handleNavbarClose}
              className={`${
                location.pathname === "/" ? "active" : ""
              } nav-link`}
              to={"/"}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              onClick={handleNavbarClose}
              className={`${
                location.pathname === "/shop/" ? "active" : ""
              } nav-link`}
              to={"/shop/"}
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              onClick={handleNavbarClose}
              className={`${
                location.pathname === "/Blog/" ? "active" : ""
              } nav-link`}
              to={"/Blog/"}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              onClick={handleNavbarClose}
              className={`${
                location.pathname === "/about/" ? "active" : ""
              } nav-link`}
              to={"/about/"}
            >
              About
            </Link>
          </li>

          <li>
            <Link
              onClick={handleNavbarClose}
              className={`${
                location.pathname === "/contact/" ? "active" : ""
              } nav-link`}
              to={"/contact/"}
            >
              Contact
            </Link>
          </li>

          {/* Show Dashboard link based on role */}
          {userInfo?.user?.role === "seller" && !userInfo?.user?.isBlocked && (
            <li>
              <Link
                onClick={handleNavbarClose}
                className={`${
                  location.pathname === "/sellerDashBoard" ? "active" : ""
                } nav-link`}
                to={"/sellerDashBoard"}
              >
                Seller Dashboard
              </Link>
            </li>
          )}

          {userInfo?.user?.role === "admin" && (
            <li>
              <Link
                onClick={handleNavbarClose}
                className={`${
                  location.pathname === "/admin" ? "active" : ""
                } nav-link`}
                to={"/admin"}
              >
                Admin Dashboard
              </Link>
            </li>
          )}

          {/* Cart and Logout */}
          <li className="relative lg-bag ">
            <Link
              onClick={handleNavbarClose}
              className={`relative ${
                location.pathname === "/cart/" ? "text-green-600  " : ""
              } nav-link`}
              to={"/cart/"}
            >
              {/* ✅ Cart Count (Only show if cart has items) */}
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-2 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                  {cartCount}
                </span>
              )}
              <i className={`fa-regular fa-cart-shopping relative ${
                location.pathname === "/cart/" ? "active  " : ""
              } nav-link`} ></i>{" "}
            </Link>
          </li>

          <a
              onClick={handleNavbarClose}
              href="#"
              id="close"
              className={isNavbarActive ? "" : "active"}
            >
              <i className="fa-solid fa-xmark"></i>
            </a>
            
          {/* Theme switch and logout */}
          <li>
            <Link className="nav-link theme" onClick={handleTheme}>
              {theme === "lightMode" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-moon"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-sun-moon"
                >
                  <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.9 4.9 1.4 1.4" />
                  <path d="m17.7 17.7 1.4 1.4" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.3 17.7-1.4 1.4" />
                  <path d="m19.1 4.9-1.4 1.4" />
                </svg>
              )}
            </Link>
          </li>

          {/* Login/Logout */}
          {isLogin ? (
            <li style={{ padding: "0px" }}>
              <Link
                className="login-btn signup-btn"
                to={"/"}
                onClick={handleLogout}
              >
                Logout
              </Link> 
            </li>
          ) : (
            <>
              <li>
                <Link className="login-btn" to={"/login"}>
                  Login
                </Link>
              </li>
              <li style={{ padding: "0px" }}>
                <Link className="login-btn signup-btn" to={"/signup"}>
                  SignUp
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div id="mobile">
          <Link  onClick={handleTheme}>
          {theme === "lightMode" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-moon"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-sun-moon text-white"
                >
                  <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.9 4.9 1.4 1.4" />
                  <path d="m17.7 17.7 1.4 1.4" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.3 17.7-1.4 1.4" />
                  <path d="m19.1 4.9-1.4 1.4" />
                </svg>
              )}
          </Link>
          <div onClick={handleNavbar}>
            <i id="bar" className="fas fa-outdent"></i>
          </div>
        </div>
    </section>
  );
};

export default Header;
