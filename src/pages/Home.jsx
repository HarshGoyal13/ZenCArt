import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import toast from "react-hot-toast";
import { Prices } from "../data/Price";
import { HashLoader } from "react-spinners";
import Carousel from "../components/Crousel";

const baseurl = process.env.REACT_APP_BASE_URL;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/product/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/category/All-category`);
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while getting categories");
    }
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseurl}/product/product-list/${page}`);
      setLoading(false);
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while getting products");
    }
  };

  const getFilterProducts = async () => {
    try {
      const { data } = await axios.post(`${baseurl}/product/product-filters`, { checked, radio });
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error filtering products:", error);
      toast.error("Failed to filter products");
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseurl}/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleCategoryChange = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter(c => c !== id);
    setChecked(updatedChecked);
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  useEffect(() => {
    if (checked.length || radio.length) {
      getFilterProducts();
    } else {
      getAllProducts();
    }
  }, [checked, radio]);

  return (
    <Layout title={"All Products - Best offers"}>
      <div className="w-full">
        <Carousel />
      </div>
      <div className="max-w-[1150px] mx-auto flex flex-col items-center">
  
        <div className="container mx-auto flex flex-col md:flex-row gap-6 mt-3 px-4" id="container">
          <div className="p-6 bg-white shadow-lg rounded-lg space-y-6 w-full md:w-80 border md:mt-[70px] border-gray-200 h-[850px]">
            <h4 className="text-center text-2xl font-semibold mb-4 text-pink-800">Filter By Category</h4>
            <div className="flex flex-col space-y-1">
              {categories.map((c) => (
                <label key={c._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-pink-800 border-gray-300 rounded"
                    checked={checked.includes(c._id)}
                    onChange={(e) => handleCategoryChange(e.target.checked, c._id)}
                  />
                  <span className="text-lg font-medium text-gray-700">{c.name}</span>
                </label>
              ))}
            </div>
            <h4 className="text-center text-2xl font-semibold mb-4 text-pink-800">Filter By Price</h4>
            <div className="flex flex-col space-y-1">
              {Prices.map((p) => (
                <label key={p._id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="price"
                    className="form-radio h-5 w-5 text-pink-600 border-gray-300 rounded"
                    value={p.array}
                    checked={radio && radio[0] === p.array[0] && radio[1] === p.array[1]}
                    onChange={() => setRadio(p.array)}
                  />
                  <span className="text-lg font-medium text-gray-700">{p.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-red-700 transition duration-300 flex items-center"
              >
                <AiOutlineReload className="mr-2" /> RESET FILTERS
              </button>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-center text-4xl font-bold mb-6 text-pink-800">All Products</h1>
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    baseurl={baseurl}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-8">
              {
                products && products.length < total && (
                  <button
                    className="bg-pink-800 text-white py-2 px-6 rounded-full shadow-lg hover:bg-pink-900 transition duration-300 flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  >
                    {loading ? <HashLoader size={25} color="#fff" /> : "Load More"}
                  </button>
                )
              }
            </div>
            <div className="text-center mt-4 text-gray-600">Total Products: {total}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
