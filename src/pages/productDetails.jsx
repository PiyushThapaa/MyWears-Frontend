import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { server } from '../App'
import { photoUrl } from './home'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ProductDetails = () => {

    const Navigate = useNavigate()

    const productId = window.location.pathname.split("/").pop()

    const [showModal, setShowModal] = useState(false)

    const [coupon, setCoupon] = useState('')
    const [discount, setDiscount] = useState(0);
    const [display, setDisplay] = useState('');
    const [couponMessage, setCouponMessage] = useState('');
    const [remainDiscount, setRemainDiscount] = useState(false)
    const [couponMessageColor, setCouponMessageColor] = useState('');
    const [count, setCount] = useState(1);
    const [disabled, setDisabled] = useState(false);
    const [maxStock, setMaxStock] = useState(1);
    const [productObj, setProductObj] = useState({})
    const [price, setPrice] = useState(productObj.price);

    const [streetAddress, setStreetAddress] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [zipcode, setZipcode] = useState(0)

    function orderConfirm (){
        axios.get(`${server}/users/me`,{
            withCredentials:true
        }).then(res=>{
            let path = res.data.user
            setStreetAddress(path.streetAddress)
            setState(path.state)
            setCity(path.city)
            setZipcode(path.zipcode)
            setShowModal(true)
        }).catch(err=>{
            toast.error(err.response.data.message)
            console.log(err)
            setShowModal(false)
        })
    }

    useEffect(() => {
        couponHandler()
    }, [remainDiscount])

    useEffect(()=>{
        setPrice(count*productObj.price-(count*productObj.price)*discount)
    },[count,productObj,discount])

    async function couponHandler() {
        try {
            const { data } = await axios.post(`${server}/coupons/verify`, {
                coupon
            },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                })
            setCouponMessageColor('green')
            setCouponMessage(`Valid Coupon : ${data.discount}% OFF`)
            setDiscount((data.discount) / 100)
        } catch (err) {
            setDiscount(0)
            setCouponMessageColor('red')
            setCouponMessage(err.response.data.message)
        }
    }

    const [updateButton, setUpdateButton] = useState(localStorage.getItem("cart") !== null ? JSON.parse(localStorage.getItem("cart")).some(obj => obj._id == productId) : null)

    const decreaseCount = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const increaseCount = () => {
        if (count < maxStock) {
            setCount(count + 1);
        }
    };

    const [size,setSize] = useState('')
    const [sizeArr, setSizeArr] = useState([])
    const [category, setCategory] = useState("")
    const [imgLoc, setImgLoc] = useState(null)
    const [imgPath, setImgPath] = useState(null)

    function addToCartHandler() {
        let arr = []
        axios.get(`${server}/products/${productId}`, {
            withCredentials: true
        }).then(res => {
            if (localStorage.getItem("cart") == null) {
                arr.push(res.data.singleProduct)
                localStorage.setItem("cart", JSON.stringify(arr))
            } else {
                arr = JSON.parse(localStorage.getItem("cart"))
                arr.push(res.data.singleProduct)
                localStorage.setItem("cart", JSON.stringify(arr))
            }
            setUpdateButton(JSON.parse(localStorage.getItem("cart")).some(obj => obj._id == productId))
            toast.success("Product Added to Cart", { position: "bottom-center" })
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        axios.get(`${server}/products/${productId}`, {
            withCredentials: true
        }).then(res => {
            const path = res.data.singleProduct;
            setCategory(path.category)
            setSizeArr(Object.keys(JSON.parse(path.stock)))
            setMaxStock(JSON.parse(path.stock)[Object.keys(JSON.parse(path.stock))[0]])
            setSize(Object.keys(JSON.parse(path.stock))[0])
            setImgPath(path.photo)
            let photo = String(path.photo).split('\\').pop()
            setImgLoc(`${photoUrl}/uploads/${photo}`)
            setProductObj(path)
        }).catch(err => {
            console.log(err)
            toast.error(err.response.data.message)
        })
    }, [])

    function orderHandler() {
        setDisabled(true)
        axios.post(`${server}/orders/new`, {
            photo: imgPath,
            name:productObj.name,
            quantity: count,
            size,
            discount,
            amount:price,
            status:"Processing",
            productId
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
            .then(res => {
                toast.success(res.data.message)
                setTimeout(()=>{
                    Navigate('/')
                },1000)
            })
            .catch(err=>toast.error(err.response.data.message))
    }

    return (
        <section className="text-gray-600 body-font ">
            <div className="container px-5 pt-4 mx-auto">
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <img alt="ecommerce" className="lg:w-1/2 w-full object-cover object-center rounded" src={imgLoc} />
                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{productObj.name}</h1>
                        <p className="leading-relaxed">Category : {category.toUpperCase()}</p>
                        <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                            <div className="flex ml-6 items-center">
                                <p className=' mr-2'>Size</p>
                                <div className="relative">
                                    <select className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10" onChange={e => {
                                        setMaxStock(JSON.parse(productObj.stock)[e.target.value])
                                        setSize(e.target.value)
                                        setCount(1)
                                    }}>
                                        {
                                            sizeArr.map((size, index) => {
                                                if (productObj.stock[size] == 0) {
                                                    return;
                                                }
                                                return <option value={size} key={index}>{size}</option>
                                            })
                                        }
                                    </select>
                                    <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                                            <path d="M6 9l6 6 6-6"></path>
                                        </svg>
                                    </span>
                                </div>
                                <p className='ml-11'>Quantity: </p>
                                <div className='flex items-center text-xl ml-5'>
                                    <button type="button" id="decrement-button" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" onClick={decreaseCount} >
                                        -
                                    </button>
                                    <div className='ml-2 mr-2'>
                                        {count}
                                    </div>
                                    <button type="button" id="increment-button" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700" onClick={increaseCount}>
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Coupon Code </label>
                                    <input type="text" id="voucher" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="" onChange={e => setCoupon(e.target.value.toUpperCase())} value={coupon}
                                        required />
                                </div>
                                {<p style={{ color: couponMessageColor, display: display ? "block" : "none" }}>{couponMessage}</p>}
                                <button type="submit" className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 bg-blue-700 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                 onClick={() => {
                                    setRemainDiscount(!remainDiscount)
                                    setDisplay(true)
                                }}
                                >Apply Code</button>
                            </div>
                        </div>
                        <br /><br />
                        <div className="flex">
                            <span className="title-font font-medium text-2xl text-gray-900">₹{price}</span>
                            <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded" onClick={orderConfirm}>Order Now</button>

                            <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded" style={{ display: updateButton ? "none" : "block" }} onClick={addToCartHandler}>Add to Cart</button>
                        </div>
                        <br />
                        <div className='flex flex-wrap gap-3'>
                        </div>
                    </div>
                </div>
            </div>
            {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Order Details
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    <b>Product Name: </b> {productObj.name}
                    <br />
                    <b>Size: </b> {size}
                    <br />
                    <b>Quantity: </b> {count}
                    <br />
                    <b>Total Amount: </b> ₹{price}
                    <br />
                    <b>Mode of Payment: </b> Offline
                    <br />
                    <b>Shipping Address: </b> {streetAddress}, {state}, {city} - {zipcode}, India
                    <br /><br />
                    <p className='text-red-600'>*If you want your product to be delivered on some other address then please first update your address then place any order*</p>
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    disabled={disabled}
                    onClick={orderHandler}
                  >
                    Order
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
        </section>
    )
}

export default ProductDetails