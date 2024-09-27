import React, { useEffect, useState } from 'react'
import banner from '../assets/Banner.png'
import banner2 from '../assets/Banner2.png'
import banner3 from '../assets/Banner3.png'
import ProductCard from '../components/productCard' 
import { server } from '../App'
import SkeletonLoader from '../components/skeletonLoader'
import { Slide } from 'react-slideshow-image';
import { motion } from "framer-motion"
import 'react-slideshow-image/dist/styles.css'
import Footer from '../components/footer'

export const photoUrl = "https://mywearsserver-vkp18z1e.b4a.run"
// export const photoUrl = "http://localhost:3000"

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '400px'
}
const slideImages = [banner2,banner,banner3];

const clients = [
  {
    src: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg",
    alt: "react",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg",
    alt: "node",
  },
  {
    src: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg",
    alt: "mongodb",
  },
  {
    src: "https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg",
    alt: "express",
  },
  {
    src: "https://www.vectorlogo.zone/logos/js_redux/js_redux-ar21.svg",
    alt: "redux",
  },
  {
    src: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg",
    alt: "typescript",
  },
  {
    src: "https://www.vectorlogo.zone/logos/sass-lang/sass-lang-ar21.svg",
    alt: "sass",
  },
  {
    src: "https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg",
    alt: "firebase",
  },
  {
    src: "https://www.vectorlogo.zone/logos/figma/figma-ar21.svg",
    alt: "figma",
  },

  {
    src: "https://www.vectorlogo.zone/logos/github/github-ar21.svg",
    alt: "github",
  },

  {
    src: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg",
    alt: "Docker",
  },
  {
    src: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg",
    alt: "Kubernetes",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nestjs/nestjs-ar21.svg",
    alt: "Nest.js",
  },

  {
    src: "https://www.vectorlogo.zone/logos/graphql/graphql-ar21.svg",
    alt: "GraphQL",
  },

  {
    src: "https://www.vectorlogo.zone/logos/jestjsio/jestjsio-ar21.svg",
    alt: "Jest",
  },

  {
    src: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg",
    alt: "Redis",
  },

  {
    src: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg",
    alt: "PostgreSQL",
  },
  {
    src: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg",
    alt: "Jenkins",
  },
];

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

<article className="our-clients py-16 bg-gray-100">
  <div className="container mx-auto text-center">
    <h2 className="text-3xl font-semibold mb-8">Our Clients</h2>
    <div className="flex flex-wrap justify-center gap-8">
      {clients.map((client, i) => (
        <motion.img
          initial={{
            opacity: 0,
            x: -10,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              delay: i / 20,
              ease: "circIn",
            },
          }}
          src={client.src}
          alt={client.alt}
          key={i}
        />
      ))}
    </div>
  </div>
</article>


<Footer />
    </>
  )
}

export default home