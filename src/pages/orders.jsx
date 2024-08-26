import React from 'react'
import {useTable,useSortBy} from 'react-table'


const data=[{
  id:"gev45234532ffdgdf",
  quantity:2,
  discount:<span className='text-red-500'>200</span>,
  amount:3800,
  status:<span className='text-green-500'>processing</span>
},{
  id:"gegerherfh234532ffdgdf",
  quantity:1,
  discount:400,
  amount:1800,
  status:'processing'
},{
  id:"gev45234532ffdgdf",
  quantity:2,
  discount:100,
  amount:1900,
  status:'shipped'
}]

const columns = [{
  Headers:"Id",
  accessor:"id"
},{
  Headers:"Quantity",
  accessor:"quantity"
},{
  Headers:"Discount",
  accessor:"discount"
},{
  Headers:"Amount",
  accessor:"amount"
},{
  Headers:"Status",
  accessor:"status"
}]

const Orders = () => {
  const {getTableProps,getTableBodyProps,headerGroups,rows,prepareRow} = useTable({
    columns,
    data
  },useSortBy)
  
  return (
  
    <div className='flex flex-col items-center'>
    <h1 className='text-4xl font-thin m-7'>My Orders</h1>
      <table {...getTableProps()} className=' border-collapse'>
      <thead>
        {headerGroups.map(hg=>(
          <tr {...hg.getHeaderGroupProps()}>
            {hg.headers.map(header=>(
              <th {...header.getHeaderProps(header.getSortByToggleProps())} className=' p-3'>
                {header.render("Headers")}
              </th>
        ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
{
  rows.map(row=>{
    prepareRow(row)
    return <tr {...row.getRowProps()} >

      {
        row.cells.map(cell=>(
          <td {...cell.getCellProps()} className='p-5 border-b-2 self-center text-center'>
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