import React, { useState, useEffect, useContext } from 'react'
import { cartContext } from '../pages/cart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '../App';
import toast from 'react-hot-toast';


const CartItem = ({ image, productName, price, cartId, index }) => {

  const Navigate = useNavigate()

  const { cartUpdate, setCartUpdate, setPriceArr, remainPrice, setDisplayOrderButton } = useContext(cartContext)
  const [sizeArr,setSizeArr] = useState([])
  const [updateOption,setUpdateOption] = useState(false)
  const [updateCart,setUpdateCart] = useState({})

  useEffect(()=>{
    setUpdateCart(JSON.parse(localStorage.getItem('cart'))[index])
  },[updateOption])

  useEffect(() => {
    axios.get(`${server}/products/${cartId}`,{
      withCredentials:true
    }).then(res=>{
      const stockArr = Object.entries(JSON.parse(res.data.singleProduct.stock))
      setSizeArr(stockArr)
    }).catch(err=>{
      removeCartItem()
      toast.error(err.response.data.message)
      console.log(err)
    })
  }, [])

  useEffect(() => {
    setPriceArr(prev => {
      let arr = [...prev]
      arr[index] = JSON.parse(localStorage.getItem('cart'))[index].quantity * price
      return arr
    })
  }, [updateCart.quantity, remainPrice])

  const decreaseCount = () => {
    if (JSON.parse(localStorage.getItem('cart'))[index].quantity > 1) {
      let cart = JSON.parse(localStorage.getItem("cart"))
            cart = cart.map(item=>{
              if(item._id == cartId){
                  return {
                    ...item,
                  quantity : JSON.parse(localStorage.getItem('cart'))[index].quantity - 1
                  }
              }
              return item;
            })
            localStorage.setItem('cart',JSON.stringify(cart))
    }
    setUpdateOption(prev=>!prev)
  };

  const increaseCount = () => {
    if (JSON.parse(localStorage.getItem('cart'))[index].quantity  < JSON.parse(localStorage.getItem('cart'))[index].maxQuantity) {
      let cart = JSON.parse(localStorage.getItem("cart"))
            cart = cart.map(item=>{
              if(item._id == cartId){
                  return {
                    ...item,
                  quantity : JSON.parse(localStorage.getItem('cart'))[index].quantity + 1
                  }
              }
              return item;
            })
            localStorage.setItem('cart',JSON.stringify(cart))
    }
    setUpdateOption(prev=>!prev)
  };

  const removeCartItem = () => {
    let itemArray = JSON.parse(localStorage.getItem("cart")).filter(obj => obj._id !== cartId)
    if (itemArray.length == 0) {
      localStorage.clear()
      setDisplayOrderButton(false)
    } else {
      localStorage.setItem("cart", JSON.stringify(itemArray))
    }
    setCartUpdate(!cartUpdate)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <img className="h-20 w-20 dark:hidden cursor-pointer" src={image} alt="product image" onClick={() => Navigate(`/productDetails/${cartId}`)} />
        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center">
            <button type="button" id="decrement-button" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" onClick={decreaseCount}>
              -
            </button>
            <div className='ml-2 mr-2'>
              {updateCart.quantity}
            </div>
            <button type="button" id="increment-button" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" onClick={increaseCount}>
              +
            </button>
          </div>
          <select className=' ml-7 border rounded-lg' value={updateCart.size}  onChange={e => {
            setUpdateOption(prev=>!prev)
            let cart = JSON.parse(localStorage.getItem("cart"))
            cart = cart.map(item=>{
              if(item._id == cartId){
                  return {
                    ...item,
                  size : e.target.value,
                  maxQuantity : sizeArr.find(item=>item[0] == e.target.value)[1],
                  quantity:1
                  }
              }
              return item;
            })
            localStorage.setItem('cart',JSON.stringify(cart))
          }} >
            {
              sizeArr.map(([size,quantity], index) => {
                if (quantity == 0) {
                  return;
                }
                return <option value={size} key={index}>{size}</option>
              })
            }
          </select>
          <div className="text-end md:order-4 md:w-24">
            <p className="text-base font-bold text-gray-900 dark:text-white">₹{updateCart.quantity * price}</p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <p onClick={()=>Navigate(`/productDetails/${cartId}`)} className="text-base font-medium text-gray-900 hover:underline dark:text-white cursor-pointer">{productName}</p>
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