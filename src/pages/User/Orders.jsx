import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const baseurl = process.env.REACT_APP_BASE_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const token = auth?.token;

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/auth/orders`, {
        headers: {
          Authorization:token, // Added 'Bearer ' prefix
        },
      });
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>
      <div className="max-w-[1150px] mx-auto flex flex-col items-center">
      <div className="container mx-auto p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/4 md:mt-[45px] mb-6 lg:mb-0">
            <UserMenu />
          </div>
          <div className="lg:w-3/4 md:ml-3 flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6">All Orders</h1>
            {orders?.length ? (
              orders.map((o, i) => (
                <div key={i} className="border border-gray-200 rounded-lg shadow-lg mb-6 p-4 bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-gray-700">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-4 py-2 text-left font-medium">#</th>
                          <th className="px-4 py-2 text-left font-medium">Status</th>
                          <th className="px-4 py-2 text-left font-medium">Buyer</th>
                          <th className="px-4 py-2 text-left font-medium">Date</th>
                          <th className="px-4 py-2 text-left font-medium">Payment</th>
                          <th className="px-4 py-2 text-left font-medium">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2">{i + 1}</td>
                          <td className="px-4 py-2">{o?.status}</td>
                          <td className="px-4 py-2">{o?.buyer?.name}</td>
                          <td className="px-4 py-2">{moment(o?.createdAt).fromNow()}</td>
                          <td className="px-4 py-2">{o?.payment.success ? "Success" : "Failed"}</td>
                          <td className="px-4 py-2">{o?.products?.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="space-y-4 mt-4">
                    {o?.products?.map((p, i) => (
                      <div key={i} className="flex flex-col md:flex-row mb-4 p-4 border border-gray-200 rounded-lg shadow-md bg-gray-50">
                        <div className="md:w-1/3 mb-4 md:mb-0">
                          <img
                            src={`${baseurl}/product/product-photo/${p._id}`}
                            className="w-full h-32 object-cover rounded-lg"
                            alt={p.name}
                          />
                        </div>
                        <div className="md:w-2/3 md:pl-4">
                          <p className="text-lg font-semibold mb-1">{p.name}</p>
                          <p className="text-gray-600 mb-2">{p.description.substring(0, 50)}{p.description.length > 50 ? '...' : ''}</p>
                          <p className="text-blue-600 font-medium">Price: ${p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No orders found</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Orders;
