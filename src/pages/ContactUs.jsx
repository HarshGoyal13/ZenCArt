import { useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";

const baseurl = process.env.REACT_APP_BASE_URL;

const Contact = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true)
    try {
      const { data } = await axios.post(`${baseurl}/contact`, formData);
      if (data.success) {
        toast.success(data.message);
        setLoading(false)
        setFormData({ email: '', subject: '', message: '' });
      } else {
        toast.error(data.message);
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
      setLoading(false)
      toast.error('Failed to send message');
    }
  };

  return (
    <Layout title={"Contact Us - ZenCart"}>
      <div className='px-4 mx-auto max-w-screen-md mt-3'>
        <h2 className='heading text-center text-pink-800'>
          Contact Us
        </h2>
        <p className='mb-8 lg:mb-16 font-light text-center text__para'>
          Got a technical issue? Want to send feedback about a beta feature? Let us know!
        </p>
        <form action="#" className='space-y-8' onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className='form__label'>
              Your Email
            </label>
            <input 
              type="email"
              id='email'
              name="email"
              onChange={handleInputChange}
              placeholder='example@gmail.com'
              value={formData.email}
              className='form__input mt-1' />
          </div>
          <div>
            <label htmlFor="subject" className='form__label'>
              Subject
            </label>
            <input 
              type="text"
              id='subject'
              name="subject"
              onChange={handleInputChange}
              placeholder='Let us know how we can help you'
              value={formData.subject}
              className='form__input mt-1' />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className='form__label'>
              Your Message
            </label>
            <textarea
              rows={5}
              name="message"
              id='message'
              placeholder='Leave a comment . . .'
              value={formData.message}
              onChange={handleInputChange}
              className='form__input-1 mt-1' />
          </div>
          <button
            type="submit"
            className="btn rounded sm:w-fit hover:bg-rose-900 transition-colors duration-300"
          >
            {loading ? <HashLoader size={25} color="#fff"/> : "Submit"}
          </button>
        </form>
      </div>

    </Layout>
  );
};

export default Contact;
