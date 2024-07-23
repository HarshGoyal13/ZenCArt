// src/pages/ConfirmEmail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';

const baseurl = process.env.REACT_APP_BASE_URL;

const ConfirmEmail = () => {
  const { token } = useParams(); // Extract token from URL params
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.get(`${baseurl}/auth/confirm/${token}`);
        if (response.data.success) {
          toast.success(response.data.message);
          navigate('/login'); // Redirect to login after confirmation
        } else {
          toast.error(response.data.message);
          setError(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <Layout title="Confirm Your Email">
      <section className="px-5 xl:px-0">
        <div className="max-w-[1170px] mx-auto text-center py-20">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <p>{error ? error : 'Your email has been confirmed successfully!'}</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ConfirmEmail;
