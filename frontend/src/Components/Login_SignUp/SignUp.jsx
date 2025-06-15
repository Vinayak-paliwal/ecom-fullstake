import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../../App.css";

function SignUp() {
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    password: "",
    conformPassword: "",
    role: "buyer",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userDetail.password !== userDetail.conformPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_KEY}/auth/signup`, // ✅ Correct backend URL
        userDetail
      );

      if (res.status === 200) {
        toast.success("Signup Successful! Please login");
        setUserDetail({
          name: "",
          email: "",
          password: "",
          conformPassword: "",
          role: "buyer",
        });
        navigate("/login");
      }
    } catch (err) {
      console.log("Signup error:", err);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="login">
      <div className="auth-container">
        <h2 style={{ textAlign: "center" }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              placeholder="Enter name"
              required
              value={userDetail.name}
              onChange={(e) =>
                setUserDetail({ ...userDetail, name: e.target.value })
              }
            />
          </label>
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
          <label>
            Confirm Password:
            <input
              type="password"
              placeholder="Confirm password"
              required
              value={userDetail.conformPassword}
              onChange={(e) =>
                setUserDetail({
                  ...userDetail,
                  conformPassword: e.target.value,
                })
              }
            />
          </label>
          <label>
            Select Role:
            <select
              value={userDetail.role}
              onChange={(e) =>
                setUserDetail({ ...userDetail, role: e.target.value })
              }
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </label>
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
