import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken } from "../../Redux/Slice/CartSlice";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../../Redux/Slice/GetUserSlice";
import "../../App.css";

function Login() {
  const [userDetail, setUserDetail] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { email, password } = userDetail; // ✅ Fixed here
      const res = await axios.post(
        `${import.meta.env.VITE_API_KEY}/auth/login`,
        { email, password }
      );

      if (res.status === 200) {
        toast.success("Login Successful!");
        const token = res.data.token;
        dispatch(setToken(token));
        const decoded = jwtDecode(token);
        dispatch(getUser(decoded.id));
        navigate("/");
      }
    } catch (err) {
      console.log("Login error:", err);
      if (err.response?.status === 403) {
        toast.error(err.response.data.message || "Your account is blocked");
      } else {
        toast.error(err.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="login">
      <div className="auth-container">
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              placeholder="Enter email"
              required
              value={userDetail.email}
              onChange={(e) =>
                setUserDetail({ ...userDetail, email: e.target.value })
              }
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              placeholder="Enter password"
              required
              value={userDetail.password}
              onChange={(e) =>
                setUserDetail({ ...userDetail, password: e.target.value })
              }
            />
          </label>
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
