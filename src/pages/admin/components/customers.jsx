import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { server } from '../../../App'

const customers = () => {

  const [users, setUsers] = useState([])

  async function customersListFetch() {
    axios.get(`${server}/users/all`, {
      withCredentials: true
    }).then(res => {
      setUsers(res.data.users)
    }).catch((err)=>console.log(err))
  }

  useEffect(() => {
    customersListFetch()
  }, [])

  return (
    <div>
      <h1 className='text-4xl mb-2'>Customers</h1>
      <br />
      <div className='border rounded flex justify-center shadow-lg'>
        <table>
          <thead>
            <tr>
              <th className='p-4'>S No</th>
              <th className='p-4'>Customer Name</th>
              <th className='p-4'>Email-ID</th>
              <th className='p-4'>Address</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((user, index) => {
                return (
                  <tr key={index}>
                    <td className='p-4 text-center'>{index+1}</td>
                    <td className='p-4 text-center'>{user.name}</td>
                    <td className='p-4 text-center'>{user.email}</td>
                    <td className='flex justify-center p-5'>{user.streetAddress}, {user.state} {user.city} - {user.zipcode}, India</td>
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

export default customers