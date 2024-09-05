import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useTable, useSortBy } from 'react-table'
import { server } from '../App'
import { useNavigate } from 'react-router-dom'

const columns = [{
  Headers: "Id",
  accessor: "id"
}, {
  Headers: "Product Name",
  accessor: "productName"
}, {
  Headers: "Status",
  accessor: "status"
}, {
  Headers: "Details",
  accessor: "details"
}]

const Orders = () => {

  const Navigate = useNavigate()

  const [data,setData] = useState([])

  useEffect(() => {
    axios.get(`${server}/orders/my`, {
      withCredentials: true
    }).then(res => {
      let response = []
      res.data.orders.map(order => {
        response.push({
          id: order._id,
          productName: order.name,
          status: <span className={`${order.status === 'Delivered'
            ? 'text-green-500'
            : order.status === 'Shipped'
              ? 'text-yellow-500'
              : 'text-red-500'
            }`}>{order.status}</span>,
          details: <button className='text-blue-500' onClick={()=>Navigate(`/order/${order._id}`)}>Details</button>
        })
      })
      setData(response)
    }).catch(err=>{
      toast.error(err.response.data.message)
      console.log(err)
    })
  }, [])


  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  }, useSortBy)

  return (

    <div className='flex flex-col items-center'>
      <h1 className='text-4xl font-thin m-7'>My Orders</h1>
      <table {...getTableProps()} className=' border-collapse table-fixed w-full md:w-auto'>
        <thead>
          {headerGroups.map(hg => (
            <tr {...hg.getHeaderGroupProps()}>
              {hg.headers.map(header => (
                <th {...header.getHeaderProps(header.getSortByToggleProps())} className='p-3'>
                  {header.render("Headers")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            rows.map(row => {
              prepareRow(row)
              return <tr {...row.getRowProps()} >

                {
                  row.cells.map(cell => (
                    <td {...cell.getCellProps()} className={`p-5 border-b-2 self-center text-center ${
                      cell.column.id === 'id' ? 'overflow-hidden text-ellipsis whitespace-nowrap w-28' : '' }`}>
                      {cell.render("Cell")}
                    </td>
                  ))
                }
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default Orders