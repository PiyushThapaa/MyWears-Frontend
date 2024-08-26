import React, { useEffect, useState } from 'react'
import banner from '../assets/Banner.png'
import ProductCard from '../components/productCard' 
import { server } from '../App'

export const photoUrl = "http://localhost:3000"

const home = () => {

  const [latest,setLatest] = useState([])

  useEffect(()=>{
    fetch(`${server}/products/latest`)
  .then(raw=>raw.json())
  .then(data=>{
    setLatest(data.products)
  })
  .catch(err=>console.log(err))
  },[])

  return (
    <>
    <section  className=' pt-80 h-16 w-full bg-no-repeat bg-cover' style={{backgroundImage:`url(${banner})`}}>
    </section>
    <h1 className='m-9 text-4xl font-serif'>Latest Products</h1>
    <main className='m-5 flex gap-2 flex-wrap '>
      {
      latest.map((product)=>{
        let imgLoc = String(product.photo).split('\\').pop()
        return(
          <ProductCard image={`${photoUrl}/uploads/${imgLoc}`} itemName={product.name} price={product.price} productId={product._id} key={product._id}/>
        )
      })
      }
    </main>
    </>
  )
}

export default home