import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../App";
import { data } from "autoprefixer";
import toast from "react-hot-toast";

function Profile() {
  // Sample user data (replace with real data from API or state management)
  const [user, setUser] = useState({
    name: "",
    email: "",
    shippingAddress: "",
    role: "", // 'user' or 'admin'
  });

  const [updateAddress,setUpdateAddress] = useState(false)

  useEffect(()=>{
    axios.get(`${server}/users/me`,{
        withCredentials:true
    }).then(res=>{
        const path = res.data.user
        setUser({
            name: path.name,
            email: path.email,
            shippingAddress: `${path.streetAddress}, ${path.state}, ${path.city} - ${path.zipcode}, India`,
            role: path.role
          })
    }).catch(err=>{
        console.log(err)
    })
  },[updateAddress])

  const [disabled, setDisabled] = useState(false)
  const [streetAddress, setStreetAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");

  const handleAddressChange = () => {
    if(streetAddress=='' || state=='' || city=='' || zipcode==''){
        alert("Please Enter the Address before updating it...")
        return;
    }
    setDisabled(true)
    axios.post(`${server}/users/updateAddress`,{
        streetAddress,
        state,
        city,
        zipcode
    },{
        headers:{
            "Content-Type":"application/json"
        },
        withCredentials:true
    }).then(res=>{
        toast.success(res.data.message)
        setStreetAddress("")
        setState("")
        setCity("")
        setZipcode("")
        setUpdateAddress(prev=>!prev)
    }
    ).catch(err=>{
        console.log(err)
        toast.error(err.response.data.message)
    }).finally(()=>setDisabled(false))
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Information</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Name:</label>
        <p className="text-gray-600">{user.name}</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Email:</label>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Role:</label>
        <p className="text-gray-600">{user.role === "admin" ? "Admin" : "User"}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Shipping Address:</label>
        <p className="text-gray-600">{user.shippingAddress}</p>
        <br />
        <input
          type="text"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          placeholder="Enter Street Address"
          className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Enter State"
          className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City"
          className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
        <input
          type="number"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="Enter Zip Code"
          className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          onClick={handleAddressChange}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={disabled}>
          Change Address
        </button>
      </div>
    </div>
  );
}

export default Profile;
