import React, { useState } from 'react'
import Layout from "../../components/Layout/Layout"
import {Link, useLocation, useNavigate} from "react-router-dom"
import toast from 'react-hot-toast'
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import {useAuth} from "../../context/auth"

const baseurl = process.env.REACT_APP_BASE_URL;

const Login = () => {

  const [auth, setAuth] = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email:"",
        password:""
    })

    const handleInputChange = e => {
        setFormData({...formData,[e.target.name]: e.target.value});
    }


    const handelSubmit = async(e)=>{

        e.preventDefault();
        setLoading(true)
        try{
            const res = await axios.post(`${baseurl}/auth/login`, formData)

            if(res && res.data.message){
              toast.success(res.data && res.data.message);
              setAuth({
                ...auth,
                user:res.data.user,
                token:res.data.token
              })
            localStorage.setItem('auth', JSON.stringify(res.data))
            console.log(res)
            navigate(location.state || '/')
            setLoading(false)
            setFormData({name:"", password:""})
            }
            
           
            }catch(error){
              console.log(error);
              setLoading(false)
              toast.error("Something went wrong");
            }
    }



  return (
    <Layout title='Login - ZenCart'>
    <section className="px-5 lg:px-0 mt-[30px]">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Hello! <span className="text-pink-800">Welcome</span> Back
        </h3>
        <form className="py-4 md:py-0" onSubmit={handelSubmit}>
          <div className="mb-5">
            <input type="email"
            placeholder="Enter Your Email"
            name="email"
            value={formData.email} 
            onChange={handleInputChange}
            className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
          </div>
          <div className="mb-5">
            <input type="password"
            placeholder="Password Here"
            name="password"
            value={formData.password} 
            onChange={handleInputChange}
            className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
          </div>
          <div className="mt-7">
            <button
              type="submit"
              className="w-full bg-pink-800 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">
              {loading ? <HashLoader size={25} color='#fff' /> : "Login"}
            </button>
          </div>
          <p className="mt-5 text-textColor text-center">
            Don&apos;t have an account? 
              <Link to='/register' className='text-primaryColor font-medium ml-1'>
                 Register
              </Link>
          </p>
        </form>
      </div>
    </section>
    </Layout>
  )
}

export default Login