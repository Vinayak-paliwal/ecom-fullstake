import React, { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Address = ({ setSelectAddress, setAddressInfo }) => {
  const [address, setAddress] = useState([]);
  const [activeAddress, setActiveAddress] = useState({});
  const [formdata, setFormdata] = useState({
    address: "",
    city: "",
    pincode: "",
    phone: "",
    notes: "",
  });

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formdata.address ||
      !formdata.city ||
      !formdata.pincode ||
      !formdata.phone
    ) {
      toast.error("Please fill all the required fields.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/address/setAddress`,
        { ...formdata, userId }
      );
      if (response.status === 200) {
        toast.success("Address added successfully!");
        setFormdata({
          address: "",
          city: "",
          pincode: "",
          phone: "",
          notes: "",
        });
        getAddress();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Please try again.");
    }
  };

  const getAddress = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_KEY}/address/getAddress/${userId}`
      );
      setAddress(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Please try again.");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_KEY}/address/delete/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Address deleted successfully!");
        getAddress();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address.");
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <div className="md:w-[45%]">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-x-1.5">
        {address.map((add) => (
          <div
            onClick={() => (setAddressInfo(add), setActiveAddress(add._id))}
            key={add._id}
            className={`${
              activeAddress === add._id
                ? "border-4 rounded-lg border-gray-900"
                : ""
            } mb-4 w-[180px]`}
          >
            <Card>
              <h4 className="my-1">
                <strong className="text-black">Address:</strong> {add.address}
              </h4>
              <h4 className="my-1">
                <strong className="text-black">City:</strong> {add.city}
              </h4>
              <h4 className="my-1">
                <strong className="text-black">Pincode:</strong> {add.pincode}
              </h4>
              <h4 className="my-1">
                <strong className="text-black">Phone:</strong> {add.phone}
              </h4>
              <h4 className="my-1">
                <strong className="text-black">Notes:</strong> {add.notes}
              </h4>

              <div className="space-x-1.5">
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click
                    handleDeleteAddress(add._id);
                  }}
                  className="py-1 px-2 my- bg-red-500 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>
      <Card className="min-w-full rounded-none">
        <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium mb-4">
            Address *
            <Input
              type="text"
              placeholder="Enter your Address"
              value={formdata.address}
              onChange={(e) =>
                setFormdata({ ...formdata, address: e.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium mb-4">
            City *
            <Input
              type="text"
              placeholder="Enter your City"
              value={formdata.city}
              onChange={(e) =>
                setFormdata({ ...formdata, city: e.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium mb-4">
            Pincode *
            <Input
              type="text"
              placeholder="Enter your Pincode"
              value={formdata.pincode}
              onChange={(e) =>
                setFormdata({ ...formdata, pincode: e.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium mb-4">
            Phone *
            <Input
              type="text"
              placeholder="Enter your Phone"
              value={formdata.phone}
              onChange={(e) =>
                setFormdata({ ...formdata, phone: e.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <Input
            type="textarea"
            placeholder="Enter any additional notes"
            value={formdata.notes}
            onChange={(e) =>
              setFormdata({ ...formdata, notes: e.target.value })
            }
          />
          <Button type="submit" className="w-full">
            Add
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Address;
