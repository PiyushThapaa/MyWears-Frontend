import React, { useEffect, useState } from 'react'
import banner from '../assets/Banner.png'
import banner2 from '../assets/Banner2.png'
import banner3 from '../assets/Banner3.png'
import ProductCard from '../components/productCard' 
import { server } from '../App'
import SkeletonLoader from '../components/skeletonLoader'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import Footer from '../components/footer'

export const photoUrl = "http://localhost:3000"

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '400px'
}
const slideImages = [banner2,banner,banner3];


const home = () => {

  const [latest,setLatest] = useState([])
  const [show, setShow] = useState(false)

  useEffect(()=>{
    fetch(`${server}/products/latest`)
  .then(raw=>raw.json())
  .then(data=>{
    setLatest(data.products)
    setShow(true)
  })
  .catch(err=>console.log(err))
  },[])

  return (
    <>
    <div className="slide-container">
        <Slide duration={1500} transitionDuration={500} autoplay>
         {slideImages.map((slideImage, index)=> (
            <div key={index}>
              <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage})` }}>
              </div>
            </div>
          ))} 
        </Slide>
      </div>
    <h1 className='m-9 text-4xl font-serif'>Latest Products</h1>
    <main className='m-5 flex gap-2 flex-wrap '>
      {show?
      latest.map((product)=>{
        let imgLoc = String(product.photo).split('\\').pop()
        return(
          <ProductCard image={`${photoUrl}/uploads/${imgLoc}`} itemName={product.name} price={product.price} productId={product._id} key={product._id}/>
        )
      }): <main className='m-5 flex gap-2 flex-wrap '>
      <SkeletonLoader/>
      <SkeletonLoader/>
      <SkeletonLoader/>
        </main>
      }
</main>
<Footer />
    </>
  )
}

export default home