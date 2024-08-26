import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlusCircle, FaCheckCircle } from "react-icons/fa";
import { server } from '../App';
import { Link } from 'react-router-dom';

const ProductCard = ({ image, itemName, price, productId }) => {

  let arr = []
  const [updateIcon, setUpdateIcon] = useState(localStorage.getItem("cart") !== null ? JSON.parse(localStorage.getItem("cart")).some(obj => obj._id == productId) : null)

  const addToCartHandler= () => {
    axios.get(`${server}/products/${productId}`, {
      withCredentials: true
    }).then(res => {
      if (localStorage.getItem("cart") == null) {
        arr.push(res.data.singleProduct)
        localStorage.setItem("cart", JSON.stringify(arr))
      } else {
        arr = JSON.parse(localStorage.getItem("cart"))
        arr.push(res.data.singleProduct)
        localStorage.setItem("cart", JSON.stringify(arr))
      }
      setUpdateIcon(JSON.parse(localStorage.getItem("cart")).some(obj => obj._id == productId))
      toast.success("Product Added to Cart",{position:"bottom-center"})
    }).catch(err => console.log(err));
  }
  return (
    <div className="w-60 rounded overflow-hidden shadow-lg m-4">
      <Link to={`/productDetails/${productId}`} className=' cursor-pointer'>
      <div className='w-full bg-gray-600 h-40' style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      </div></Link>
      <div className="px-6 py-4 bg-gray-600 flex justify-between items-center">
        <div>
          <div className="font-bold text-xl mb-2 text-white">{itemName}</div>
          <p className="text-white text-base">₹{price}</p>
        </div>
        {localStorage.getItem("cart") !== null ? (
          updateIcon ?
            <FaCheckCircle className='text-white' /> :
            <FaPlusCircle className='text-white cursor-pointer' onClick={addToCartHandler} />
        ) : <FaPlusCircle className='text-white cursor-pointer' onClick={addToCartHandler} />}
      </div>
    </div>
  );
};

export default ProductCard;