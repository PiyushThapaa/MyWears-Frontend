import React, { useContext } from 'react'
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  ListBulletIcon,
  TicketIcon
} from "@heroicons/react/24/solid";
import { AdminContext } from '../dashboard';

const sidebar = () => {

  const {setProducts,setOrders,setCoupons,setCustomers} = useContext(AdminContext)

  return (
    <div>
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Admin Dashboard
        </Typography>
      </div>
      <List>
        <ListItem onClick={()=>{
          setOrders(true)
          setCoupons(false)
          setCustomers(false)
          setProducts(false)
        }}>
          <ListItemPrefix>
            <ClipboardDocumentCheckIcon className="h-5 w-5" />
          </ListItemPrefix>
          Orders
        </ListItem>
        <ListItem onClick={()=>{
          setOrders(false)
          setCoupons(false)
          setCustomers(false)
          setProducts(true)
        }}>
          <ListItemPrefix>
            <ListBulletIcon className="h-5 w-5" />
          </ListItemPrefix>
          Products
        </ListItem>
        <ListItem onClick={()=>{
          setOrders(false)
          setCoupons(false)
          setCustomers(true)
          setProducts(false)
        }}>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Customers
        </ListItem>
        <ListItem onClick={()=>{
          setOrders(false)
          setCoupons(true)
          setCustomers(false)
          setProducts(false)
        }}>
          <ListItemPrefix>
            <TicketIcon className="h-5 w-5" />
          </ListItemPrefix>
          Coupons
        </ListItem>
      </List>
    </Card>
    </div>
  )
}

export default sidebar