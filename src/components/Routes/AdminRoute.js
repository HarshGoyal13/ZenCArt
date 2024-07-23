import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

const baseurl = process.env.REACT_APP_BASE_URL;

export default function AdminRoute() {
  const [ok, setOk] = useState();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    const authCheck = async () => {
        try{
            const res = await axios.get(`${baseurl}/auth/admin-auth`, {
                headers: {
                  Authorization: auth?.token,
                },
              });
              if (res.data.ok) {
                setOk(true);
              } else {
                setOk(false);
              }
        }catch(error){
            setOk(false);
        if (error.response && error.response.status === 401) {
          navigate('/');
        }
        }
    
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path="" />;
}
