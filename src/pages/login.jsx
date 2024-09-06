import React, { useState, useContext  } from 'react'
import Logo from "../assets/MyWear Logo.png"
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';
import { Context, server } from '../App';
import toast,{Toaster} from 'react-hot-toast';
import ClipLoader from "react-spinners/ClipLoader";

const login = () => {

  const Navigate = useNavigate()

  const {setAuthRedirect} = useContext(Context)

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [visible,setVisible] = useState(false)
  const [type,setType] = useState(true)
  const [disabled,setDisabled] = useState(false)
  const [color, setColor] = useState('black')
  
  async function loginHandler () {
    if (email==''|| password==''){
      toast.error("Please fill all the credentials")
      return;
    }
    if(!validator.isEmail(email)){
      toast.error("Enter a valid Email")
      return;
    }
    setDisabled(true)
    try {
      const {data} = await axios.post(`${server}/users/login`,{
        email,
        password
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

  function handleVisibility (){
    setVisible((prev)=>!prev)
    setType((prev)=>!prev)
  }
  return (
    <div className='w-10/12 text-center content-center m-auto mt-32 p-8 rounded-lg bg-gray-200 shadow-2xl'>
      <Toaster/>
        <div className=' flex justify-center h-12'>
          <img src={Logo} alt="logo" width={55} />
        <p className='font-bold font text-4xl mb-8 ml-2'>Login</p>
        </div>
        <br />
        <input type="email" value={email} placeholder='Email' className=' w-10/12 border h-8 text-lg rounded mb-5 p-6' onChange={(e)=>setEmail(e.target.value)} />
        <br />
        <div >
        <input type={type?"password":"text"} value={password} placeholder='Password' className=' w-10/12 border h-8 text-lg rounded p-6 mb-2' onChange={(e)=>setPassword(e.target.value)} />
        <br />
        <button className='mb-4 text-blue-600' onClick={handleVisibility}>{visible?"Hide":"Show"} Password</button>
        </div>
        <br />
        <button className='border-black bg-white p-2 rounded-lg hover:bg-black hover:text-white' onClick={loginHandler} onMouseOver={()=>setColor('white')} onMouseOut={()=>setColor('black')} disabled={disabled}>{disabled?<ClipLoader size={14} className='ml-4 mr-4' color={color}/>:"Log In"}</button>
        <br />
        <br />
        <p>Have not registered yet?</p>
        <Link className='flex-row flex items-center justify-center cursor-pointer text-blue-600' to={'/register'}>
        <FaArrowRight /><p>Register</p>
        </Link>
    </div>
  )
}

export default login