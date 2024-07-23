import { ClimbingBoxLoader } from "react-spinners"

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom"

const Spinner = ({path = "login"}) => {

    const [count, setCount] = useState(3)

    const navigate = useNavigate()
    const location  = useLocation()

    useEffect(()=>{
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue)
        },1000)
        count === 0 && navigate(`/${path}`, {
            state: location.pathname
        })
        return () => clearInterval(interval)

    }, [count, navigate, location, path])

  return (
    <div className="flex flex-col justify-center items-center h-screen">
         <ClimbingBoxLoader color="#CC313D" />
         <h1 className="font-black font-hedder text-lg">Redirecting To you in {count} seconds...</h1>
    </div>
  )
}

export default Spinner