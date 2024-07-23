import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
const baseurl = process.env.REACT_APP_BASE_URL;

const CreateProduct = () => {
  const [auth] = useAuth();
  const token = auth?.token;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategories();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('category', category);
    formData.append('photo', photo);
    setLoading(true)
    try {
  
      const { data } = await axios.post(`${baseurl}/product/create-product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
      });

      if (data.success) {
        toast.success('Product created successfully');
        navigate('/dashboard/admin/products');
        resetForm();
        setLoading(false)
      } else {
        toast.error(data.message || 'Failed to create product');
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
      setLoading(false)
      toast.error('Something went wrong in creating product');
    }
  };

  const resetForm = () => {
    setProductName('');
    setDescription('');
    setPrice('');
    setQuantity('');
    setCategory('');
    setPhoto(null);
  };

  return (
    <Layout title="Create Product - ZenCart">
      <div className="max-w-[1150px] mx-auto flex flex-col items-center">
      <div className="container mx-auto p-4 font-hedder">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-4">
            <AdminMenu />
          </div>
          <div className="mt-4 w-full md:w-3/4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h1 className="text-3xl font-bold mb-6 text-pink-800">Create Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                  Image
                </label>
                <div className="relative border border-gray-300 rounded-lg overflow-hidden flex items-center">
                  <input
                    type="file"
                    id="photo"
                    name='photo'
                    onChange={(e) => setPhoto(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <button
                    type="button"
                    className="py-2 px-4 bg-sky-800 text-white font-bold rounded-lg hover:bg-black transition duration-300"
                  >
                    {photo ? photo.name : "Upload Photo"}
                  </button>
                </div>
              </div>

              <div className="text-center">
                {photo && (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product-photo"
                      className="h-[200px] object-cover rounded-lg shadow-md border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
              
              <button
                type="submit"
                className="w-full py-3 bg-rose-300 text-black font-hedder font-black rounded-lg shadow-md hover:bg-rose-600 transition duration-300 relative flex items-center justify-center"
                style={{ minWidth: '200px' }} // Adjust the minWidth as per your design
              >
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <HashLoader size={25} color="#fff" />
                  </div>
                ) : (
                  "Create Product"
                )}
              </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full py-3 bg-gray-300 text-black font-hedder font-black rounded-lg shadow-md hover:bg-gray-400 transition duration-300 ml-2"
                >
                  Reset
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

export default CreateProduct;
