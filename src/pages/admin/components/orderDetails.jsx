import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { server } from '../../../App'
import { photoUrl } from '../../home'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

const orderDetails = () => {
  const orderId = window.location.pathname.split('/').pop()

  const [userid, setUserid] = useState('')
  const [updateShippingInfo,setUpdateShippingInfo] = useState(false)
  const [updateStatus,setUpdateStatus] = useState(false)
  const [disabled,setDisabled] = useState(false)
  const [color, setColor] = useState('black')

  const [orderInfo, setOrderInfo] = useState({})
  const [ShippingInfo, setShippingInfo] = useState({})

  useEffect(() => {
    axios.get(`${server}/orders/${orderId}`, {
      withCredentials: true
    })
      .then(res => {
        setOrderInfo(res.data.order)
        setUserid(res.data.order.user)
        setUpdateShippingInfo(!updateShippingInfo)
      })
      .catch(err => console.log(err.response.data.message))
  }, [updateStatus])

  useEffect(() => {
    axios.get(`${server}/users/${userid}`, {
      withCredentials: true
    }).then(res => setShippingInfo(res.data.user))
      .catch(err => console.log(err.response.data.message))
  }, [updateShippingInfo])

  function updateOrderStatus (){
    setDisabled(true)
    axios.put(`${server}/orders/${orderId}`,{},{
      withCredentials:true
    }).then(res=>toast.success(res.data.message))
    .catch(err=>{
      console.log(err)
      toast.error(err.response.data.message)
    })
    .finally(()=>{
      setUpdateStatus(!updateStatus)
      setDisabled(false)
    })
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Order Info</h3>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Product Name:</strong> {orderInfo.name}</p>
          <img
            src={`${photoUrl}/${orderInfo.photo}`}
            alt='Shirt'
            className="w-32 h-32 object-cover my-4 border rounded-md"
          />
          <p><strong>Size:</strong> {orderInfo.size}</p>
          <p><strong>Quantity:</strong> {orderInfo.quantity}</p>
          <p><strong>Price:</strong> ₹{orderInfo.amount}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Shipping Info</h3>
          <p><strong>Customer Name:</strong> {ShippingInfo.name}</p>
          <p><strong>Customer Email:</strong> {ShippingInfo.email}</p>
          <p><strong>Address:</strong> {ShippingInfo.streetAddress}, {ShippingInfo.state} {ShippingInfo.city} - {ShippingInfo.zipcode}, India</p>
          <p><strong>Mode of Payment:</strong> Offline</p>

          <div className="mt-4">
            <h3 className="font-semibold text-lg mb-2">Update Order Status</h3>
            {orderInfo.status != "Delivered" && <button className='border hover:border-black hover:bg-white hover:text-black p-2 rounded-lg bg-black text-white mr-3' onClick={updateOrderStatus}>Update Button</button>}
            <b>Status</b>:- <span className={`${orderInfo.status === 'Delivered'
                          ? 'text-green-500'
                          : orderInfo.status === 'Shipped'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`} onMouseOver={()=>setColor('white')} onMouseOut={()=>setColor('black')} disabled={disabled}>{disabled?<ClipLoader size={14} className='ml-4 mr-4' color={color}/>:`${orderInfo.status}`}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default orderDetails