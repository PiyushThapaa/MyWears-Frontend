import React, { useState, useContext } from 'react'
import Logo from "../assets/MyWear Logo.png"
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context, server } from '../App';
import validator from 'validator';
import { ClipLoader } from 'react-spinners';
import toast, {Toaster} from 'react-hot-toast';

const register = () => {

  const Navigate = useNavigate()

    const {setAuthRedirect} = useContext(Context)

    const [visible,setVisible] = useState(false)
    const [type,setType] = useState(true)
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [streetAddress,setStreetAddress] = useState('')
    const [city,setCity] = useState('')
    const [state,setState] = useState('')
    const [zipcode,setZipcode] = useState(undefined)
    const [display,setDisplay] = useState(false)
    const [disabled,setDisabled] = useState(false)
    const [color,setColor] = useState('black')
  
    function handleVisibility (){
      setVisible((prev)=>!prev)
      setType((prev)=>!prev)
    }

    async function registerHandler() {
      try {
        if (name==''|| email=='' || password=='' || streetAddress=='' || state=='' || city=='' || zipcode==''){
          alert("Please fill all the credentials")
          console.log('hello')
          return;
        }
        if(!validator.isEmail(email)){
          toast.error("Enter a valid Email")
          return;
        }
        if(display){
          toast.error("Password is not matching")
          return;
        }
        if(password.length < 10){
          toast.error("Weak Password (Atleast 10 characters required)")
          return;
        }
        setDisabled(true)
        const {data} = await axios.post(`${server}/users/new`,{
          name,email,password,streetAddress,city,state,zipcode
        },{
          headers:{
            "Content-Type":"application/json"
          },
          withCredentials:true
        })
        toast.success(data.message)
        setTimeout(()=>{
          setAuthRedirect(false)
          Navigate('/')
        },1000) 
      } catch (err) {
        if(err.message!=="Network Error"){
          toast.error(err.response.data.message)
        } else{
          toast.error(err.message)
        }
      } finally{
        setDisabled(false)
      }
    }

  return (
    <div className='w-10/12 text-center content-center m-auto mt-32 p-8 rounded-lg bg-gray-200 shadow-2xl overflow-y-scroll'style={{height:"26rem"}}>
      <Toaster />
        <div className=' flex justify-center h-12'>
          <img src={Logo} alt="logo" width={55} />
        <p className='font-bold font text-4xl mb-8 ml-2'>Register</p>
        </div>
        <br />
        <input type="text" placeholder='Name' className=' w-10/12 border h-8 text-lg rounded mb-5 p-6' onChange={e=>setName(e.target.value)} value={name} />
        <br />
        <input type="email" placeholder='Email' className=' w-10/12 border h-8 text-lg rounded mb-5 p-6' onChange={e=>setEmail(e.target.value)} value={email}/>
        <br />
        <input type="text" placeholder='Street Address' className=' w-10/12 border h-8 text-lg rounded mb-5 p-6' onChange={e=>setStreetAddress(e.target.value)} value={streetAddress}/>
        <br />
        <input type="text" placeholder='State' className=' w-10/12 border h-8 text-lg rounded mb-5 p-6' onChange={e=>setState(e.target.value)} value={state} />
        <br />
        <input type="text" placeholder='City' className=' w-10/12 border h-8 text-lg rounded mb-5 p-6' onChange={e=>setCity(e.target.value)} value={city}/>
        <br />
        <input type="number" placeholder='Zip Code' className=' w-10/12 border h-8 text-lg rounded mb-5 p-6' onChange={e=>setZipcode(e.target.value)} value={zipcode} />
        <br />
        <div >
        <input type={type?"password":"text"} id='password' placeholder='Password' className=' w-10/12 border h-8 text-lg rounded p-6 mb-5' onChange={e=>{
          setPassword(e.target.value)
          setDisplay(true)
        }} value={password} />
        <br />
        <input type={type?"password":"text"} placeholder='Confirm Password' className=' w-10/12 border h-8 text-lg rounded p-6 mb-2' onChange={e=>{
          e.target.value==password?setDisplay(false):setDisplay(true)
        }} />
        <br />
        <p className='text-red-500 ' style={{display:display?'block':'none'}}>The password is not matching</p>
        <button className='mb-4 text-blue-600' onClick={handleVisibility}>{visible?"Hide":"Show"} Password</button>
        </div>
        <br />
        <button className='border-black bg-white p-2 rounded-lg hover:bg-black hover:text-white' disabled={disabled} onClick={registerHandler} onMouseOver={()=>setColor('white')} onMouseOut={()=>setColor('black')}>{disabled?<ClipLoader size={14} className='ml-4 mr-4' color={color}/>:"Register"}</button>
        <br />
        <br />
        <p>Already Registered?</p>
        <Link className='flex-row flex items-center justify-center cursor-pointer text-blue-600' to={'/login'}>
        <FaArrowRight /><p> Log In</p>
        </Link>
    </div>
  )
}

export default register