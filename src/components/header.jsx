import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/MyWear Logo.png'
import { Context, RouteContext, server } from '../App'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';

const Header = () => {
  const { setAuthRedirect } = useContext(Context)
  const { setUserRoute, setAdminRoute } = useContext(RouteContext)
  const Navigate = useNavigate()
  const [user, setUser] = useState(false)
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    handleAuth()
  }, [])

  const handleAuth = async () => {
    try {
      const { data } = await axios.get(`${server}/users/me`, {
        withCredentials: true
      })
      if (data.success == true) {
        setUser(true)
        setUserRoute(true)
      }
      if (data.user.role == "admin") {
        setAdmin(true)
        setAdminRoute(true)
      } else {
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
            onClick: async () => {
              try {
                const { data } = await axios.get(`${server}/users/logout`, {
                  withCredentials: true
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

  const [navbar, setNavbar] = useState(false)

  return (
    <nav className="w-full text-gray-400 bg-gray-900 shadow">
      <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div>
          <div className="flex items-center justify-between md:py-5 md:block">
            <a className="flex title-font font-medium items-center text-white mt-4 md:mt-0 mb-4 md:mb-0">
              <img src={logo} alt="MyWear Logo" className="w-10 h-10 text-white rounded-full" />
              <span className="ml-3 text-xl">MyWears</span>
            </a>
            <div className="md:hidden">
              <button
                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? "block" : "hidden"
              }`}
          >
            <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              <li>
              <Link to={"/"} className="mr-3 hover:text-white">Home</Link>
              </li>
              <li>
              <Link to={"/search"} className="mr-3 hover:text-white">Search</Link>
              </li>
              <li>
              <Link to={"/cart"} className="mr-3 hover:text-white">Cart</Link>
              </li>
              <li>{user && <Link to={"/orders"} className="mr-3 hover:text-white">Orders</Link>}</li>
              <li>{user && <Link to={"/profile"} className="mr-3 hover:text-white">Profile</Link>}</li>
              <li>{admin && <Link to={"/admin-dashboard"} className="mr-3 hover:text-white">Dashboard</Link>}</li>
            </ul>
          </div>
        </div>
        <div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? "block" : "hidden"
              }`}
          >
           <input type='submit' className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0 cursor-pointer" onClick={(e) => authHandler(e.target.value)} value={user ? "Logout" : "Login"} /> 
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header