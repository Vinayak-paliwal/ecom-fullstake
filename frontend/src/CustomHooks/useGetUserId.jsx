import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const useGetUserId = () => {
  const [userId, setUserId] = useState(null);
  // const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Invalid token", error);
        setUserId(null);
      }
    }
  }, []);

  // useEffect(() => {
  //   const getUser = async () => {
  //     if (userId) {
  //       try {
  //         const response = await axios.get(
  //           `${import.meta.env.VITE_API_KEY}/auth/${userId}`
  //         );
  //         setUser(response.data);
  //         console.log("user", response.data);
          
  //       } catch (error) {
  //         console.error("Invalid token || user not found", error);
  //           setUser({});
  //       }
  //     }
  //   };
  //   getUser();
  // }, [userId]);

  return { userId };
};

export default useGetUserId;
