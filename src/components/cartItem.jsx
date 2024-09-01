import React, { useState, useEffect, useContext } from 'react'
import { cartContext } from '../pages/cart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '../App';


const CartItem = ({ image, productName, price, cartId, index }) => {

  const Navigate = useNavigate()

  const { cartUpdate, setCartUpdate, setPriceArr, remainPrice } = useContext(cartContext)
  const [count, setCount] = useState(1);
  const [maxStock, setMaxStock] = useState(0)
  const item = localStorage.getItem("cart") != null ?
    JSON.parse(localStorage.getItem("cart")).find(obj => obj._id == cartId) : null
  const [sizeArr,setSizeArr] = useState([])

  useEffect(() => {
    // setMaxStock(JSON.parse(item.stock)["XS"])
    axios.get(`${server}/products/${cartId}`,{
      withCredentials:true
    }).then(res=>{
      const stockArr = Object.keys(JSON.parse(res.data.singleProduct.stock))
      setSizeArr(stockArr)
    })
  }, [])

  useEffect(() => {
    setPriceArr(prev => {
      let arr = [...prev]
      arr[index] = count * price
      return arr
    })
  }, [count, remainPrice])

  const decreaseCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const increaseCount = () => {
    if (count < maxStock) {
      setCount(count + 1);
    }
  };

  const removeCartItem = () => {
    let itemArray = JSON.parse(localStorage.getItem("cart")).filter(obj => obj._id !== cartId)
    if (itemArray.length == 0) {
      localStorage.clear()
    } else {
      localStorage.setItem("cart", JSON.stringify(itemArray))
    }
    setCartUpdate(!cartUpdate)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <img className="h-20 w-20 dark:hidden" src={image} alt="product image" onClick={() => Navigate(`/productDetails/${cartId}`)} />
        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center">
            <button type="button" id="decrement-button" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" onClick={decreaseCount}>
              -
            </button>
            <div className='ml-2 mr-2'>
              {count}
            </div>
            <button type="button" id="increment-button" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" onClick={increaseCount}>
              +
            </button>
          </div>
          <select className=' ml-7 border rounded-lg' defaultValue={item.size}  onChange={e => {
            setMaxStock(JSON.parse(item.stock)[e.target.value])
            setCount(1)
          }} >
            {
              sizeArr.map((size, index) => {
                if (item.size == 0) {
                  return;
                }
                return <option value={size} key={index}>{size}</option>
              })
            }
          </select>
          <div className="text-end md:order-4 md:w-24">
            <p className="text-base font-bold text-gray-900 dark:text-white">₹{count * price}</p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <p onClick={()=>Navigate(`/productDetails/${cartId}`)} className="text-base font-medium text-gray-900 hover:underline dark:text-white">{productName}</p>
          <div className="flex items-center gap-4">
            <button type="button" className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500" onClick={removeCartItem}>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem