import React, { useEffect, useState, createContext } from 'react'
import CartItem from '../components/cartItem'
import { photoUrl } from './home'
import axios from 'axios'
import { server } from '../App'

export const cartContext = createContext()

const cart = () => {

  const [display,setDisplay] = useState(false)
  const [remainPrice,setRemainPrice] = useState(false)
  const [price, setPrice] = useState(0);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [remainDiscount,setRemainDiscount] = useState(false)
  const [couponMessageColor, setCouponMessageColor] = useState('');
  const [cartState, setCartState] = useState(localStorage.getItem("cart") !== null ?
    JSON.parse(localStorage.getItem("cart")) : null)
  const [cartUpdate, setCartUpdate] = useState(false)
  const [check, setCheck] = useState(localStorage.getItem("cart") !== null)
  const [priceArr, setPriceArr] = useState(localStorage.getItem("cart") !== null ?
    JSON.parse(localStorage.getItem("cart")).filter(obj => obj.price) : [])

    useEffect(()=>{
      let price = []
      localStorage.getItem("cart") !== null ?
      JSON.parse(localStorage.getItem("cart")).filter(obj => price.push(obj.price)) : null
      setRemainPrice(!remainPrice)
      setCheck(localStorage.getItem("cart") !== null)
      setCartState(localStorage.getItem("cart") !== null ?
      JSON.parse(localStorage.getItem("cart")) : null)
      setPriceArr(price)
    },[cartUpdate])

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart !== null) {
      const totalPrice = priceArr.reduce((sum, item) => sum + item, 0);
      setPrice(totalPrice);
    } else {
      setPrice(0)
    }
    setRemainDiscount(!remainDiscount)
  }, [priceArr]);

  useEffect(()=>{
    couponHandler()
  },[remainDiscount])

  async function couponHandler (){
    try {
      const {data} = await axios.post(`${server}/coupons/verify`,{
        coupon
      },
    {
      headers:{
        "Content-Type":"application/json"
      },
      withCredentials:true
    })
    setCouponMessageColor('green')
    setCouponMessage(`Valid Coupon : ${data.discount}% OFF`)
    setDiscount((price*data.discount)/100)
    } catch (err) {
      setDiscount(0)
      setCouponMessageColor('red')
      setCouponMessage(err.response.data.message)
    }
  }
  
  return (
    <cartContext.Provider value={{ cartUpdate, setCartUpdate, setPriceArr, priceArr,remainPrice }}>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Shopping Cart</h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">

                {
                  check ?
                    (cartState.map((item, index) => {
                      let imgLoc = String(item.photo).split('\\').pop()
                      return <CartItem image={`${photoUrl}/uploads/${imgLoc}`} productName={item.name} price={item.price} cartId={item._id} index={index} key={item._id} />
                    }))
                    :
                    <div className=' text-3xl text-red-700'>No items Added</div>
                }
              </div>
            </div>
            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Original Price</dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">₹{price}</dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Discount</dt>
                      <dd className="text-base font-medium text-green-600">-₹{discount}</dd>
                    </dl>

                  </div>
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">₹{price - discount}</dd>
                  </dl>
                </div>

                <button href="#" className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-700 text-white">Proceed to Checkout</button>

              </div>

              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Coupon Code </label>
                    <input type="text" id="voucher" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="" onChange={e=>setCoupon(e.target.value.toUpperCase())} value={coupon} required />
                  </div>
                  {<p style={{color:couponMessageColor,display:display?"block":"none"}}>{couponMessage}</p>}
                  <button type="submit" className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 bg-blue-700 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={()=>{
                    setRemainDiscount(!remainDiscount)
                    setDisplay(true)
                  }}>Apply Code</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </cartContext.Provider>
  )
}

export default cart