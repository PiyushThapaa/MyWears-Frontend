import React, { lazy, useState, createContext } from 'react'

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

  return (
    <AdminContext.Provider value={{setProducts,setOrders,setCoupons,setCustomers}}>
      <div className='flex'>
      <SideBar />
      <div className='ml-8 flex justify-center mt-3'>
      {products && <Products />}
      {orders && <Orders />}
      {coupons && <Coupons />}
      {customers && <Customers />}
      </div>
    </div>
    </AdminContext.Provider>
  )
}

export default dashboard