import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/MyWear Logo.png'
import { Context, RouteContext, server } from '../App'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';

const Header = () => {
  const {setAuthRedirect} = useContext(Context)
  const {setUserRoute,setAdminRoute} = useContext(RouteContext)
  const Navigate = useNavigate()
  const [user, setUser] = useState(false)
  const [admin, setAdmin] = useState(false)

  useEffect(()=>{
    handleAuth()
  },[])

  const handleAuth = async() => {
    try {
      const {data} = await axios.get(`${server}/users/me`,{
        withCredentials:true
      })
      if (data.success == true) {
        setUser(true)
        setUserRoute(true)
      }
      if (data.user.role == "admin"){
        setAdmin(true)
        setAdminRoute(true)
      } else{
        setAdmin(false)
        setAdminRoute(false)
      }
    } catch (err) {
      setUser(false)
      setAdmin(false)
      setUserRoute(false)
      setAdminRoute(false)
    }
  }

  async function authHandler(e) {
    if (e == "Login") {
      setAuthRedirect(true)
      Navigate('/login')
      } else {
        confirmAlert({
          title: 'Logout Confirmation',
          message: 'Are you sure you want to logout?',
          buttons: [
            {
              label: 'Yes',
              onClick: async() => {
                try {
                  const {data} = await axios.get(`${server}/users/logout`,{
                    withCredentials:true
                  })
                  setUser(false)
                  setAdmin(false)
                  toast.success(data.message)
                  Navigate('/')
                } catch (err) {
                  toast.error(`${err.message} or Server is down for 30 secs...`)
                }
              }
            },
            {
              label: 'No'
            }
          ]
        });
    }
  }

  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <Toaster/>
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
          <img src={logo} alt="MyWear Logo" className="w-10 h-10 text-white rounded-full" />
          <span className="ml-3 text-xl">MyWears</span>
        </a>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link to={"/"} className="mr-5 hover:text-white">Home</Link>
          <Link to={"/search"} className="mr-5 hover:text-white">Search</Link>
          <Link to={"/cart"} className="mr-5 hover:text-white">Cart</Link>
          {user && <Link to={"/orders"} className="mr-5 hover:text-white">Orders</Link>}
          {user && <Link to={"/profile"} className="mr-5 hover:text-white">Profile</Link>}
          {admin && <Link to={"/admin-dashboard"} className="mr-5 hover:text-white">Dashboard</Link>}
        </nav>
        <input type='submit' className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0 cursor-pointer" onClick={(e) => authHandler(e.target.value)} value={user ? "Logout" : "Login"} />
      </div>
    </header>
  )
}

export default Header