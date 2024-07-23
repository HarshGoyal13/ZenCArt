import React, { useEffect, useState } from 'react';
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing icons

const baseurl = process.env.REACT_APP_BASE_URL;

const CreateCategory = () => {
  const [auth] = useAuth();
  const token = auth?.token;


  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/category/All-category`);
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${baseurl}/category/create-category`, { name: categoryName }, {
        headers: {
          Authorization: token,
        }
      });
      if (data?.success) {
        toast.success(`${categoryName} created successfully`);
        setCategoryName("");
        getAllCategory();

        

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in creating category");
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${baseurl}/category/delete-category/${id}`, {
        headers: {
          Authorization: token,
        }
      });
      if (data.success) {
        toast.success("Category deleted successfully");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in deleting category");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${baseurl}/category/edit-category/${selectedCategory._id}`, { name: categoryName }, {
        headers: {
          Authorization: token,
        }
      });
      console.log("Update response:", data); // Debugging line
      if (data.success) {
        toast.success(`${categoryName} updated successfully`);
        setCategoryName("");
        setSelectedCategory(null);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in updating category");
    }
  };

  return (
    <Layout title={"Create Category - ZenCart"}>
    <div className="max-w-[1150px] mx-auto flex flex-col items-center">
      <div className='container mx-auto p-4 font-hedder'>
        <div className='flex flex-col md:flex-row'>
          <div className='w-full md:w-1/4 mb-4 md:mb-0 md:mr-4'>
            <AdminMenu />
          </div>
          <div className='mt-4 w-full md:w-3/4 p-6 bg-white rounded-lg shadow-md border border-gray-200'>
            <h1 className='text-3xl font-bold mb-6 text-pink-800'>
              {selectedCategory ? 'Edit Category' : 'Create Category'}
            </h1>
            <form className='space-y-6' onSubmit={selectedCategory ? handleUpdate : handleCreateCategory}>
              <div>
                <label htmlFor='categoryName' className='block text-gray-700 font-medium mb-2'>
                  Category Name
                </label>
                <input
                  type='text'
                  id='categoryName'
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className='w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300'
                  placeholder='Enter category name'
                  required
                />
              </div>
              <button
                type='submit'
                className='px-4 py-2 bg-cherry-red text-zinc-900 font-hedder font-black rounded-lg shadow-md hover:bg-rose-600 transition duration-300'
              >
                {selectedCategory ? 'Update' : 'Create'}
              </button>
            </form>
            <div className='mt-8'>
              <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Categories</h2>
              <div className='overflow-x-auto'>
                <table className='min-w-full bg-white border rounded-lg shadow-md'>
                  <thead className='bg-gray-200'>
                    <tr>
                      <th className='py-2 px-4 text-left text-gray-700 font-semibold'>Name</th>
                      <th className='py-2 px-4 text-left text-gray-700 font-semibold'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id} className='border-t hover:bg-gray-100 transition duration-300'>
                        <td className='py-3 px-4 whitespace-nowrap'>{category.name}</td>
                        <td className='py-3 px-4 flex items-center space-x-2'>
                          <button
                            className='text-blue-500 hover:text-blue-700 transition duration-300'
                            onClick={() => {
                              setSelectedCategory(category);
                              setCategoryName(category.name);
                            }}
                          >
                            <FaEdit size={20} />
                          </button>
                          <button
                            className='text-red-500 hover:text-red-700 transition duration-300'
                            onClick={() => handleDelete(category._id)}
                          >
                            <FaTrashAlt size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
