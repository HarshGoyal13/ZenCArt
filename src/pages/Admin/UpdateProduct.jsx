import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import mongoose from 'mongoose';
const baseurl = process.env.REACT_APP_BASE_URL;

const UpdateProduct = () => {
  const [auth] = useAuth();
  const token = auth?.token;

  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    getAllCategories();
    getSingleProduct();
  }, []);

  const deleteProduct = async () => {
    try {
      await axios.delete(`${baseurl}/product/delete-product/${id}`, {
        headers: {
          Authorization: token
        }
      });
      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting Product");
    }
  };

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/product/single-product/${params.slug}`);
      setProductName(data.product.name);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setCategory(data.product.category._id);
      setId(data.product._id);
    } catch (error) {
      console.error(error);
      toast.error("Error in fetching Single Product");
    }
  };

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/category/All-category`);
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        toast.error("Invalid category format");
        return;
      }

      setLoading(true);

      const productData = new FormData();
      productData.append("name", productName);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      if (photo) {
        productData.append("photo", photo);
      }
      productData.append("category", category);

      const { data } = await axios.put(
        `${baseurl}/product/update-product/${id}`,
        productData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Update Product - ZenCart">
      <div className="max-w-[1150px] mx-auto flex flex-col items-center">
      <div className="container mx-auto p-4 font-hedder">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-4">
            <AdminMenu />
          </div>
          <div className="mt-4 w-full md:w-3/4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h1 className="text-3xl font-bold mb-6 text-pink-800">Update Product</h1>
            <form className="space-y-6" onSubmit={handleUpdate}>
              <div>
                <label htmlFor="productName" className="block text-gray-700 font-medium mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  placeholder="Enter product description"
                  rows="5"
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="w-full md:w-1/2">
                  <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="Enter product price"
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="Enter product quantity"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-white"
                  required
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="photo" className="block text-gray-700 font-medium mb-2">
                  Image
                </label>
                <div className="relative border border-gray-300 rounded-lg overflow-hidden flex items-center">
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="py-2 px-4 bg-sky-800 text-white font-bold rounded-lg hover:bg-black transition duration-300"
                  >
                    {photo ? photo.contentType : "Upload Photo"}
                  </button>
                </div>
              </div>

              <div className="text-center">
                {photo ? (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product-photo"
                      className="h-[200px] object-cover rounded-lg shadow-md border border-gray-300"
                    />
                  </div>
                ) : (
                  <div className="mt-4">
                    <img
                      src={`${baseurl}/product/product-photo/${id}`}
                      alt="product-photo"
                      className="h-[200px] object-cover rounded-lg shadow-md border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-rose-300 text-black font-hedder font-black rounded-lg shadow-md hover:bg-rose-600 transition duration-300 relative flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <HashLoader size={24} color={"#fff"} />
                  ) : (
                    'Update Product'
                  )}
                </button>
                <button
                  type="button"
                  onClick={deleteProduct}
                  className="w-full py-3 bg-gray-300 text-black font-hedder font-black rounded-lg shadow-md hover:bg-gray-400 transition duration-300 ml-2"
                >
                  Delete Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
