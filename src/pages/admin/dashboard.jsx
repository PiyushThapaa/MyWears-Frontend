import React, { lazy, useState, createContext } from 'react'
import { TiThMenu } from "react-icons/ti";

const SideBar = lazy(()=>import('./components/sidebar'))
const Orders = lazy(()=>import('./components/order'))
const Coupons = lazy(()=>import('./components/coupon'))
const Customers = lazy(()=>import('./components/customers'))
const Products = lazy(()=>import('./components/product'))

export const AdminContext = createContext()

const dashboard = () => {

  const [products, setProducts] = useState(false)
  const [orders, setOrders] = useState(true)
  const [coupons, setCoupons] = useState(false)
  const [customers, setCustomers] = useState(false)

  const [sidebarVisibility, setSidebarVisibility] = useState(false)

  return (
    <AdminContext.Provider value={{setProducts,setOrders,setCoupons,setCustomers,setSidebarVisibility}}>
      <div className='flex duration-1000'>
      <div className={`${sidebarVisibility?"block":"hidden"} absolute cus1:fixed cus1:block`}><SideBar /></div>
      <div className='cus1:ml-60 flex flex-col mt-3'>
        <TiThMenu className='cus1:hidden z-10 ' onClick={()=>setSidebarVisibility(prev=>!prev)} size={23} />
      <div onClick={()=>setSidebarVisibility(false)}>
      {products && <Products />}
      {orders && <Orders />}
      {coupons && <Coupons />}
      {customers && <Customers />}
      </div>
      </div>
    </div>
    </AdminContext.Provider>
  )
}

export default dashboard