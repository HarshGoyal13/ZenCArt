import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  // Context
  const [auth, setAuth] = useAuth();
  const token = auth?.token;

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Get user data
  useEffect(() => {
    if (auth?.user) {
      const { email, name, phone, address } = auth.user;
      setName(name || "");
      setPhone(phone || "");
      setEmail(email || "");
      setAddress(address || "");
    }
  }, [auth?.user]);

  // Form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("http://localhost:8080/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      }, {
        headers: {
          Authorization: token
        }
      });

      // Log the response data for debugging
      console.log("API Response:", data);

      if (data?.error) {
        toast.error(data.error);
      } else {
        setAuth({ ...auth, user: data.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log("API Error:", error.response ? error.response.data : error.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Your Profile">
      <div className="max-w-[1150px] mx-auto flex flex-col items-center">
      <div className="container mx-auto p-8 bg-gray-50 min-h-screen rounded-lg shadow-2xl">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/4 p-4">
            <UserMenu />
          </div>
          <div className="w-full md:w-3/4 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl border border-gray-200 transform transition duration-300 hover:shadow-3xl hover:-translate-y-1">
              <h4 className="text-3xl font-bold mb-6 text-gray-800">USER PROFILE</h4>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative mb-5">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out hover:shadow-lg"
                    id="name"
                    placeholder="Enter Your Name"
                    autoFocus
                  />
                </div>
                <div className="relative mb-5">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-md bg-gray-100 cursor-not-allowed"
                    id="email"
                    placeholder="Enter Your Email"
                    disabled
                  />
                </div>
                <div className="relative mb-5">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out hover:shadow-lg"
                    id="password"
                    placeholder="Enter Your Password"
                  />
                </div>
                <div className="relative mb-5">
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out hover:shadow-lg"
                    id="phone"
                    placeholder="Enter Your Phone"
                  />
                </div>
                <div className="relative mb-5">
                  <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out hover:shadow-lg"
                    id="address"
                    placeholder="Enter Your Address"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-600 to-pink-900 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-rose-600 hover:to-rose-900 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Profile;
