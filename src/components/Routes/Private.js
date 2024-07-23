import {useState, useEffect} from "react"
import {useAuth} from "../../context/auth"
import { Outlet } from "react-router-dom"
import axios from "axios"
import Spinner from "../Spinner"
const baseurl = process.env.REACT_APP_BASE_URL

export default function PrivateRoute(){
    const [ok, setOk] = useState()
    const [auth, setAuth] = useAuth()

    useEffect(()=>{
        const authCheck = async()=>{
            const res = await axios.get(`${baseurl}/auth/user-auth`, {
                headers: {
                    "Authorization": auth?.token
                }
            }
        )
        if(res.data.ok){
            setOk(true)
        }
        else{
            setOk(false)
        }
        }
        if(auth?.token) authCheck()
    }, [auth?.token])

    return ok ? <Outlet/> :  <Spinner/>
}