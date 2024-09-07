import React, { lazy, Suspense, useEffect, useState, createContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Loader from './components/loader'
import Header from './components/header';
import ProductDetails from './pages/productDetails';

const Home = lazy(() => import('./pages/home'));
const Search = lazy(() => import('./pages/search'));
const Cart = lazy(() => import('./pages/cart'));
const Orders = lazy(() => import('./pages/orders'));
const Login = lazy(() => import('./pages/login'));
const Profile = lazy(() => import('./pages/profile'));
const Register = lazy(() => import('./pages/register'));
const AdminDashboard = lazy(() => import('./pages/admin/dashboard'));
const OrderDetails = lazy(() => import('./pages/admin/components/orderDetails'));
const UserOrderDetails = lazy(() => import('./pages/orderDetails'));
const PageNotFound = lazy(() => import('./pages/pageNotFound'));

export const server = "http://localhost:3000/api/v1"

export const Context = createContext(null)
export const RouteContext = createContext(null)

const App = () => {
  const [authRedirect,setAuthRedirect] = useState(true)
  
  useEffect(()=>{
      const appState = () => {
        if (!(window.location.pathname.endsWith('/login')||(window.location.pathname.endsWith('/register')))) {
          setAuthRedirect(false)
        }
      }
      appState()
      window.addEventListener('popstate',appState)
      return () => {
        window.removeEventListener('popstate', appState);
      };
  },[])

  return (
      <Context.Provider value={{setAuthRedirect}}>
        {authRedirect?<Auth/>:<Main/>}
      </Context.Provider>
  )
}

const Auth = () => {
  return(
    <Router>
    <Suspense fallback={<Loader />} >
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
      </Routes>
    </Suspense>
  </Router>
  )
}

const Main = () => {
  const [userRoute,setUserRoute] = useState(false)
  const [adminRoute,setAdminRoute] = useState(false)
  
  return(
    <RouteContext.Provider value={{setUserRoute,setAdminRoute}}>
    <Router>
    <Header/>
    <br />
    <br />
    <br />
    <Suspense fallback={<Loader />} >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        {userRoute && <Route path="/orders" element={<Orders />} />}
        {userRoute && <Route path="/profile" element={<Profile />} />}
        {userRoute && <Route path="/order/:id" element={<UserOrderDetails />} />}
        {adminRoute && <Route path="/admin-dashboard" element={<AdminDashboard />} />}
        {adminRoute && <Route path="/admin-dashboard/order-details/:id" element={<OrderDetails />} />}
        <Route path='*' element={<PageNotFound />} />
        <Route path="/productdetails/:id" element={<ProductDetails />} />
      </Routes>
    </Suspense>
  </Router>
    </RouteContext.Provider> 
  )
}

export default App