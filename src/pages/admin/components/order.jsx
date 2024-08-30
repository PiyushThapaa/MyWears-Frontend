import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { server } from '../../../App';
import { useNavigate } from 'react-router-dom';

const order = () => {

  const Navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [email, setEmail] = useState({})

  function allOrders() {
    axios.get(`${server}/orders/all`, {
      withCredentials: true
    }).then(res => setOrders(res.data.orders))
      .catch(err => console.log(err.response.data.message))
  }

  useEffect(() => {
    allOrders()
  }, [])


  useEffect(() => {
    orders.forEach(order => axios.get(`${server}/users/${order.user}`, {
      withCredentials: true
    })
      .then(res => {
        if (email[order.user] == undefined) {
          setEmail((email)=>{
            let tempObj = {...email}
            tempObj[order.user] = res.data.user.email;
            return tempObj
          })
        }
      }
      ).catch(err => console.log(err))
  )
  }, [orders])

  return (
    <div className="container mx-auto p-7">
      <h1 className="text-2xl mb-4">Customer Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Customer Email</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              return (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{order._id}</td>
                  <td className="py-2 px-4 border-b">{email[order.user]}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`${order.status === 'Delivered'
                        ? 'text-green-500'
                        : order.status === 'Shipped'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={()=>Navigate(`/admin-dashboard/order-details/${order._id}`)}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default order