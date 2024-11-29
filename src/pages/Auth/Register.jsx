import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import signupImg from '../../assets/signup.avif'; // Replace with your actual image import
import toast from "react-hot-toast";
import axios from 'axios';
import { HashLoader } from 'react-spinners';

const baseurl = process.env.REACT_APP_BASE_URL;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "",
  });

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${baseurl}/auth/register`, formData);

      if (res && res.data.success) {
        toast.success("Registration successful. Please check your email to confirm your account.", {
          autoClose: 3000, // Display for 5 seconds
        });
      
        setTimeout(() => {
          navigate("/login"); // Redirect after toast is shown
        }, 3000);
      } else {
        toast.error(res.data.message, {
          autoClose: 5000, // Display for 5 seconds
        });
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        role: "",
      });

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Register - ZenCart"}>
      <section className='px-5 xl:px-0'>
        <div className='max-w-[1170px] mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            <div className='hidden lg:block rounded-l-lg'>
              <figure className='rounded-l-lg'>
                <img src={signupImg} alt="" className='ml-[100px] mt-3 w-[500px] h-[600px] rounded-l-lg' />
              </figure>
            </div>

            <div className='rounded-l-lg lg:pl-16 py-10'>
              <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10'>
                Create An <span className='text-pink-800'>Account</span>
              </h3>
              <form onSubmit={handleSubmit}>

                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    value={formData.name}
                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                    required
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-5">
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    name="email"
                    value={formData.email}
                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                    required
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-5">
                  <input
                    type="number"
                    placeholder="Enter Your Phone Number"
                    name="phone"
                    value={formData.phone}
                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                    required
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="Enter Your Address"
                    name="address"
                    value={formData.address}
                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                    required
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-5">
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                    required
                    onChange={handleInputChange}
                  />
                </div>

                <div className='mb-5 flex items-center justify-between'>
                  <label className='text-headingColor font-bold text-[16px] leading-7'>
                    Are You A:
                    <select
                      name='role'
                      value={formData.role}
                      onChange={handleInputChange}
                      className='text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none'
                    >
                      <option value="">Select</option>
                      <option value="Client">Client</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </label>
                </div>

                <div className="mt-7">
                  <button
                    type="submit"
                    className="w-full bg-pink-800 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">
                    {loading ? <HashLoader size={25} color='#fff' /> : "Register"}
                  </button>
                </div>

                <p className="mt-5 text-textColor text-center">
                  Already have an account? 
                  <Link to='/login' className='text-primaryColor font-medium ml-1'>
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Register;
