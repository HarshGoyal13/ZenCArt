import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";

const baseurl = process.env.REACT_APP_BASE_URL;

const Products = () => {
  const [auth] = useAuth();
  const [products, setProducts] = useState([]);
  const token = auth?.token;

  // Function to fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/product/Admin-product`, {
        headers: {
          Authorization: token,
        },
      });
      setProducts(data.products);
      console.log("Fetched Products:", data.products); // Logging fetched products
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // Lifecycle method to fetch products on component mount
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="max-w-[1150px] mx-auto flex flex-col items-center">
      <div className="container mx-auto p-4 font-hedder">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-4 md:mt-[70px]">
            <AdminMenu />
          </div>
          <div className="w-full md:w-3/4 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">All Products List</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
              {products?.map((p) => (
                <Link
                  key={p._id}
                  to={`/dashboard/admin/product/${p.slug}`}
                  className="product-link"
                >
                  <div className="bg-white h-[450px] shadow-md rounded-lg overflow-hidden">
                    <img
                      src={`${baseurl}/product/product-photo/${p._id}`}
                      onError={(e) => {
                        e.target.onerror = null
                      }}
                      className="w-full h-[300px] object-cover"
                      alt={p.name}
                    />
                    <div className="p-4">
                      <h5 className="font-bold text-xl mb-2">{p.name}</h5>
                      <p className="text-gray-700 text-base">{p.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">Price: ${p.price}</span>
                        <span className="text-sm text-gray-500">{p.quantity > 0 ? `${p.quantity} in stock` : "Out of stock"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Products;
