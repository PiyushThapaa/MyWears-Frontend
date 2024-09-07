import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { server } from '../App';
import toast from 'react-hot-toast';
import { photoUrl } from './home';
import { useNavigate } from 'react-router-dom';

const OrderDetails = () => {

    const Navigate = useNavigate();

    const order = window.location.pathname.split('/').pop()

    const [orderInfo, setOrderInfo] = useState({})

    const [streetAddress, setStreetAddress] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [zipcode, setZipcode] = useState(0)

    useEffect(()=>{
        axios.get(`${server}/orders/${order}`, {
            withCredentials: true
          })
            .then(res => {
              setOrderInfo(res.data.order)
            })
            .catch(err => {
              console.log(err)
              Navigate('*')
            })

        axios.get(`${server}/users/me`,{
            withCredentials:true
        }).then(res=>{
            let path = res.data.user
            setStreetAddress(path.streetAddress)
            setState(path.state)
            setCity(path.city)
            setZipcode(path.zipcode)
        }).catch(err=>{
            toast.error(err.response.data.message)
            console.log(err)
        })
    },[])
    
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <span className="text-gray-600">Order ID:</span>
          <span className="font-semibold text-lg">{orderInfo._id}</span>
        </div>
        <span
          className={`${
            orderInfo.status === 'Delivered'
              ? 'bg-green-200 text-green-800'
              : (orderInfo.status === 'Shipped'?
              'bg-yellow-200 text-yellow-800'
              : 'bg-red-200 text-red-800')
          } px-3 py-1 rounded-full text-sm`}
        >
          {orderInfo.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mb-4">
        <div>
          <img
            src={`${photoUrl}/${orderInfo.photo}`}
            alt={orderInfo.name}
            onClick={()=>Navigate(`/productdetails/${orderInfo.productId}`)}
            className="w-32 h-32 object-cover rounded-lg cursor-pointer"
          />
        </div>
        <div className="sm:col-span-2">
          <h3 className="text-lg font-semibold">{orderInfo.name}</h3>
          <p className="text-gray-600">Size: {orderInfo.size}</p>
          <p className="text-gray-600">Quantity: {orderInfo.quantity}</p>
          <p className="text-gray-600">Discount: ₹{orderInfo.discount}</p>
          <p className="text-gray-600">Total Amount: ₹{orderInfo.amount}</p>
          <p className="text-gray-600">Mode of Payment: Cash/Offline</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-gray-600">Your Address:</h4>
        <p className="text-gray-800">{streetAddress}, {state}, {city} - {zipcode}, India </p>
      </div>
    </div>
  );
};

export default OrderDetails;
