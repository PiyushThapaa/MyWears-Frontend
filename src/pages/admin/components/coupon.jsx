import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { server } from '../../../App'
import toast from 'react-hot-toast'

const coupon = () => {

  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState('')
  const [allCoupons, setAllCoupons] = useState([])
  const [disabled, setDisabled] = useState(false)
  const [update,setUpdate] = useState(false)

  useEffect(() => {
    axios.get(`${server}/coupons/all`, {
      withCredentials: true
    }).then(res => setAllCoupons(res.data.coupons))
      .catch(err => console.log(err.response.data.message))
  }, [update])

  async function addCouponHandler() {
    if (coupon == '' || discount == null) {
      alert("Please enter the coupon and discount before adding it...")
      return;
    }
    if (discount < 1 || discount > 50) {
      alert("Discount should be from 1 to upto 50...")
      return;
    }
    setDisabled(true)
    axios.post(`${server}/coupons/new`,{
      coupon,discount
    },{
      headers:{
        "Content-Type":"application/json"
      },
      withCredentials:true
    }).then(res=>{
      toast.success(res.data.message)
      setCoupon('')
      setDiscount('')
    })
    .catch(err=>toast.error(err.response.data.message))
    .finally(()=>{
      setDisabled(false)
       setUpdate(!update)
    }
  )
  }

  function deleteCouponHandler (id){
   axios.delete(`${server}/coupons/${id}`,{
    withCredentials:true
   }).then(res=>toast.success(res.data.message))
   .catch(err=>toast.error(err.response.data.message))
   .finally(()=>setUpdate(!update))
  }

  return (
    <div>
      <h1 className='text-4xl mb-2'>Coupons</h1>
      <br />
      <input type="text" placeholder='Enter Coupon...' className='text-2xl outline-none ml-2' value={coupon} onChange={e => setCoupon((e.target.value).toUpperCase())} />
      <input type="number" value={discount} placeholder='Enter discount in %...' className='text-2xl outline-none ml-2' onChange={e => setDiscount(e.target.value)} />
      <button className='text-white bg-gray-900 p-2 rounded hover:bg-black' onClick={addCouponHandler} disabled={disabled}>Add</button>
      <br />
      <br />
      <div className='w-auto border rounded flex justify-center shadow-lg'>
        <table>
          <thead>
            <tr>
              <th className='p-4'>S No</th>
              <th className='p-4'>Coupons</th>
              <th className='p-4'>Discount</th>
              <th className='p-4'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              allCoupons.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className='p-4 text-center'>{index + 1}</td>
                    <td className='p-4 text-center'>{item.coupon}</td>
                    <td className='p-4 text-center'>{item.discount}%</td>
                    <td className='flex justify-center p-5'><MdDelete className='hover:text-red-600 cursor-pointer' onClick={()=>deleteCouponHandler(item._id)}/></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default coupon