import React, { useEffect, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import ProductCard from '../components/productCard'
import axios from 'axios'
import { server } from '../App'
import PageIcon from '../components/pageIcon'
import { photoUrl } from './home'
import SkeletonLoader from '../components/skeletonLoader';

const search = () => {
  const [range, setRange] = useState(100000)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const [products, setProducts] = useState([])
  const [pageArray, setPageArray] = useState([])
  const [page, setPage] = useState(1)
  const [categoriesArr, setCategoriesArr] = useState([])

  const [show, setShow] = useState(false)

  const [displayFilter, setDisplayFilter] = useState(false)

  useEffect(() => {
    filteringFunction()
    allCategory()
  }, [search, range, category, sort, page])

  const filteringFunction = async () => {
    try {
      const filteredProducts = await axios.get(`${server}/products/all?search=${search}&price=${range}&category=${category}&sort=${sort}&page=${page}`)
      setProducts(filteredProducts.data.products)
      let pages = []
      for (let i = 1; i <= filteredProducts.data.totalPage; i++) {
        pages.push(i)
      }
      setPageArray(pages)
      setShow(true)
    } catch (error) {
      console.log(error)
    }
  }

  const allCategory = async () => {
    const categories = await axios.get(`${server}/products/all-categories`)
    if (categories) return setCategoriesArr(categories.data.allCategory)
  }

  return (
    <div className='flex md:flex-row flex-col gap-7 m-auto'>
      <aside className={`${displayFilter?"flex":"hidden"} flex-col gap-3 border border-black md:m-8 p-8 relative
      md:flex md:w-96 w-full`}>
        <p className=' text-4xl font-thin'>Filters</p>
        <b className=' text-2xl'>Sort</b>
        <select name="pricesorting" className='
        border border-black rounded h-9 w-72' onChange={(e) => {
            setSort(e.target.value)
          }}>
          <option value="">None</option>
          <option value="asc">Price(Low to High)</option>
          <option value="dsc">Price(High to Low)</option>
        </select>
        <b className=' text-2xl'>Max Price:₹{range}</b>
        <input type="range" name="range" id="range" value={range} max={100000} onChange={(e) => {
          setRange(e.target.value)
        }} />
        <b className=' text-2xl'>Category</b>
        <select name="productSorting" id="" className=' border border-black rounded h-9 w-72' onChange={(e) => {
          setCategory(e.target.value)
        }}>
          <option value="">All</option>
          {
            categoriesArr.map((category, index) => {
              return <option value={category} key={index}>{category}</option>
            })
          }
        </select>
      </aside>
      <section className=' mt-8 mr-4'>
        <div className='flex flex-col gap-6 items-center'>
        <div className='flex items-center gap-24 justify-around'>
          <p className=' text-4xl'>Products</p>
          <FaFilter size={40} className='block md:hidden p-2 bg-black text-white cursor-pointer rounded' onClick={()=>setDisplayFilter(prev=>!prev)}/>
        </div>
        <input type="text" placeholder='Search...' className='border border-black w-3/4 h-10 text-xl pl-2 rounded ' onChange={(e) => {
          setSearch(e.target.value)
        }
        } />
        </div>
        <div className='flex justify-center flex-wrap'>
          {show?
            (products.length!=0?products.map((product) => {
              let imgLoc = String(product.photo).split('\\').pop()
              return (
                <ProductCard image={`${photoUrl}/uploads/${imgLoc}`} itemName={product.name} price={product.price} key={product._id} productId={product._id} />
              )
            }):<p className='text-red-600 m-12 text-3xl'>No Product Found</p>): <div className='flex justify-center flex-wrap'>
              <SkeletonLoader/>
              <SkeletonLoader/>
              <SkeletonLoader/>
              <SkeletonLoader/>
              <SkeletonLoader/>
              <SkeletonLoader/>
            </div>
          }
        <div className='flex w-3/4 flex-wrap'>
          {
            pageArray.map((page) => {
              return <PageIcon page={page} key={page} onClick={() => setPage(page)} />
            })
          }
        </div>
        </div>
      </section>
    </div>
  )
}
export default search
